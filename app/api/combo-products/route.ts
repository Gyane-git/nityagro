import { prisma } from "@/lib/prisma";
import { getPublicUploadDir } from "@/lib/uploadPaths";
import { attachComboItems, attachComboItemsMany } from "@/lib/comboItems";
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const serialize = (data: unknown) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function toBoolean(value: unknown, fallback = true) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lowered = value.trim().toLowerCase();
    if (["1", "true", "yes", "active"].includes(lowered)) return true;
    if (["0", "false", "no", "inactive"].includes(lowered)) return false;
  }
  return fallback;
}

function safeFileName(raw: string) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function imageExtension(file: File) {
  const extMap: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  if (extMap[file.type]) return extMap[file.type];
  return path.extname(file.name || "").toLowerCase() || ".png";
}

async function saveComboImage(file: File, type: "main" | "gallery") {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Invalid image type. Only jpg, png, webp and gif are allowed.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base =
    safeFileName(file.name.replace(/\.[^/.]+$/, "")) || "combo-image";
  const fileName = `${type}-${base}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}${imageExtension(file)}`;
  const uploadDir = getPublicUploadDir("uploads", "combos");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);

  return `/uploads/combos/${fileName}`;
}

function parseProductCodes(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((code) => String(code || "").trim()).filter(Boolean);
  }
  return String(value || "")
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const combo = await prisma.comboProduct.findUnique({
        where: { comboProductId: BigInt(id) },
        include: {
          productImages: {
            orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
          },
          product: {
            select: {
              productId: true,
              productCode: true,
              productName: true,
              subGroupName: true,
              pImage: true,
            },
          },
        },
      });

      if (!combo) {
        return NextResponse.json(
          { success: false, message: "Combo product not found" },
          { status: 404, headers: corsHeaders },
        );
      }

      return NextResponse.json(
        { success: true, data: serialize(await attachComboItems(prisma, combo)) },
        { status: 200, headers: corsHeaders },
      );
    }

    const combos = await prisma.comboProduct.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        productImages: {
          orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
        },
        product: {
          select: {
            productId: true,
            productCode: true,
            productName: true,
            subGroupName: true,
            pImage: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: serialize(await attachComboItemsMany(prisma, combos)) },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to fetch combo products" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Combo product id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const comboProductId = BigInt(id);
    const contentType = req.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");
    const formData = isMultipart ? await req.formData() : null;
    const body = isMultipart ? null : await req.json();
    const getValue = (key: string) =>
      isMultipart ? formData?.get(key) : body?.[key];

    const comboName = String(getValue("comboName") || "").trim();
    if (!comboName) {
      return NextResponse.json(
        { success: false, message: "Combo name is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const productCodes = parseProductCodes(getValue("productCodes"));
    const productId = Number(getValue("productId") || 0);
    if (!Number.isFinite(productId) || productId <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid product is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const updated = await prisma.comboProduct.update({
      where: { comboProductId },
      data: {
        comboName,
        productId: BigInt(productId),
        productCodes: productCodes.join(","),
        productPrices: Number(getValue("productPrices") || 0),
        comboPrice: Number(getValue("comboPrice") || 0),
        discount: Number(getValue("discount") || 0),
        slug: String(getValue("slug") || "").trim() || null,
        comboDescription:
          String(getValue("comboDescription") || "").trim() || null,
        comboStatus: toBoolean(getValue("comboStatus"), true),
      },
    });

    if (isMultipart && formData) {
      const imageRows: {
        comboProductId: bigint;
        imageUrl: string;
        isMain: boolean;
      }[] = [];

      const mainImage = formData.get("mainImage");
      if (mainImage instanceof File && mainImage.size > 0) {
        await prisma.productImage.deleteMany({
          where: { comboProductId, isMain: true },
        });
        imageRows.push({
          comboProductId,
          imageUrl: await saveComboImage(mainImage, "main"),
          isMain: true,
        });
      }

      const galleryImages = formData.getAll("galleryImages");
      const hasGalleryUpload = galleryImages.some(
        (entry) => entry instanceof File && entry.size > 0,
      );
      if (hasGalleryUpload) {
        await prisma.productImage.deleteMany({
          where: { comboProductId, isMain: false },
        });
      }

      for (const entry of galleryImages) {
        if (entry instanceof File && entry.size > 0) {
          imageRows.push({
            comboProductId,
            imageUrl: await saveComboImage(entry, "gallery"),
            isMain: false,
          });
        }
      }

      if (imageRows.length > 0) {
        await prisma.productImage.createMany({ data: imageRows });
      }
    }

    const comboWithImages = await prisma.comboProduct.findUnique({
      where: { comboProductId: updated.comboProductId },
      include: {
        productImages: {
          orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
        },
        product: {
          select: {
            productId: true,
            productCode: true,
            productName: true,
            subGroupName: true,
            pImage: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Combo product updated successfully",
        data: serialize(await attachComboItems(prisma, comboWithImages)),
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update combo product",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");
    const formData = isMultipart ? await req.formData() : null;
    const body = isMultipart ? null : await req.json();

    const getValue = (key: string) =>
      isMultipart ? formData?.get(key) : body?.[key];

    const resolvedComboCode = String(getValue("comboCode") || "").trim();
    const comboName = String(getValue("comboName") || "").trim();
    const productId = Number(getValue("productId") || 0);
    const productCodes = parseProductCodes(getValue("productCodes"));
    const productPrices = Number(getValue("productPrices") || 0);
    const comboPrice = Number(getValue("comboPrice") || 0);
    const discount = Number(getValue("discount") || 0);

    if (!resolvedComboCode) {
      return NextResponse.json(
        { success: false, message: "Combo code is required" },
        { status: 400, headers: corsHeaders },
      );
    }
    if (!comboName) {
      return NextResponse.json(
        { success: false, message: "Combo name is required" },
        { status: 400, headers: corsHeaders },
      );
    }
    if (!Number.isFinite(productId) || productId <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid product is required" },
        { status: 400, headers: corsHeaders },
      );
    }
    if (productCodes.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one product variant is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const product = await prisma.products.findUnique({
      where: { productId: BigInt(productId) },
      select: { productId: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Selected product not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const created = await prisma.comboProduct.create({
      data: {
        comboCode: resolvedComboCode,
        comboName,
        productId: BigInt(productId),
        productCodes: productCodes.join(","),
        productPrices,
        comboPrice,
        discount,
        slug: String(getValue("slug") || "").trim() || null,
        comboDescription:
          String(getValue("comboDescription") || "").trim() || null,
        comboStatus: toBoolean(getValue("comboStatus"), true),
      },
    });

    if (isMultipart && formData) {
      const imageRows: {
        comboProductId: bigint;
        imageUrl: string;
        isMain: boolean;
      }[] = [];

      const mainImage = formData.get("mainImage");
      if (mainImage instanceof File && mainImage.size > 0) {
        imageRows.push({
          comboProductId: created.comboProductId,
          imageUrl: await saveComboImage(mainImage, "main"),
          isMain: true,
        });
      }

      const galleryImages = formData.getAll("galleryImages");
      for (const entry of galleryImages) {
        if (entry instanceof File && entry.size > 0) {
          imageRows.push({
            comboProductId: created.comboProductId,
            imageUrl: await saveComboImage(entry, "gallery"),
            isMain: false,
          });
        }
      }

      if (imageRows.length > 0) {
        await prisma.productImage.createMany({ data: imageRows });
      }
    }

    const comboWithImages = await prisma.comboProduct.findUnique({
      where: { comboProductId: created.comboProductId },
      include: {
        productImages: {
          orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
        },
        product: {
          select: {
            productId: true,
            productCode: true,
            productName: true,
            subGroupName: true,
            pImage: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Combo product created successfully",
        data: serialize(await attachComboItems(prisma, comboWithImages)),
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to create combo product" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Combo product id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const comboProductId = BigInt(id);
    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { comboProductId } }),
      prisma.comboProduct.delete({ where: { comboProductId } }),
    ]);

    return NextResponse.json(
      { success: true, message: "Combo product deleted successfully" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete combo product",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
