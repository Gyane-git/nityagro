import { prisma } from "@/lib/prisma";
import { refreshLocalStockFromOms } from "@/lib/omsStock";
import { applyOmsPriceOverlay, fetchOmsProductPrices } from "@/lib/omsProductPrices";
import { getPublicUploadDir } from "@/lib/uploadPaths";
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

type ProductDTO = {
  productCode: string;
  categoryId: string;
  userId: number;
  productName: string;
  subGroupName?: string;
  slug?: string;
  productVariation?: string;
  productDescription?: string;
  nutritionInfo?: string;
  cookingInstruction?: string;
  storageInstruction?: string;
  pImage?: string;
  productStatus?: boolean;
  actualPrice: number;
  sellingPrice: number;
  deliveryTargetDays?: number;
  stockQuantity?: number;
  availableQuantity?: number;
  flashSale?: boolean;
  specialOffer?: boolean;
};

function toOptionalTrimmedStringOrUndefined(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

function nullableBigInt(value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  return BigInt(Number(value));
}

function sameBigIntValue(left: bigint | null | undefined, right: bigint | null) {
  return String(left ?? "") === String(right ?? "");
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function toOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function toRequiredString(value: FormDataEntryValue | null, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim();
}

function toNumber(value: FormDataEntryValue | null, fallback = 0) {
  if (typeof value !== "string") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toOptionalBigInt(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return BigInt(trimmed);
  } catch {
    return null;
  }
}

function fileExt(file: File) {
  const extMap: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  if (extMap[file.type]) return extMap[file.type];
  const parsed = path.extname(file.name || "").toLowerCase();
  return parsed || ".png";
}

function safeName(raw: string) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function saveProductImage(file: File, type: "main" | "gallery") {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Invalid image type");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = fileExt(file);
  const base = safeName(file.name.replace(/\.[^/.]+$/, "")) || "product-image";
  const fileName = `${type}-${base}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const uploadDir = getPublicUploadDir("uploads", "products");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);

  return `/uploads/products/${fileName}`;
}

export async function GET() {
  try {
    const productGroupWise = await prisma.products.findMany({
      distinct: ["subGroupName"],
    });

    const liveStockByCode = await refreshLocalStockFromOms(productGroupWise.map((product) => product.productCode)).catch((error) => {
      console.warn("Live OMS stock overlay failed", error);
      return new Map<string, number>();
    });
    const livePriceByCode = await fetchOmsProductPrices(
      productGroupWise.map((product) => product.productCode),
    ).catch((error) => {
      console.warn("Live OMS price overlay failed", error);
      return new Map<string, { actualPrice?: number; sellingPrice?: number }>();
    });
    const rows = productGroupWise.map((product) => {
      const liveStock = liveStockByCode.get(product.productCode);
      const withPrice = applyOmsPriceOverlay(
        product,
        livePriceByCode.get(product.productCode),
      );
      if (liveStock === undefined) return withPrice;
      return {
        ...withPrice,
        stockQuantity: liveStock,
        availableQuantity: liveStock,
        omsAvailableQty: liveStock,
      };
    });

    const safeData = JSON.parse(JSON.stringify(rows, (_, value) => (typeof value === "bigint" ? value.toString() : value)));

    return Response.json(
      {
        success: true,
        data: safeData,
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const productCode = toRequiredString(formData.get("productCode"));
      const productName = toRequiredString(formData.get("productName"));
      const categoryId = toRequiredString(formData.get("categoryId"));

      if (!productCode || !productName || !categoryId) {
        return NextResponse.json(
          {
            success: false,
            message: "productCode, productName and categoryId are required",
          },
          { status: 400, headers: corsHeaders },
        );
      }

      const mainImageFile = formData.get("productImage");
      const productImages = formData.getAll("productImages");
      let mainImageUrl: string | null = null;

      if (mainImageFile instanceof File && mainImageFile.size > 0) {
        mainImageUrl = await saveProductImage(mainImageFile, "main");
      }

      const createdProduct = await prisma.products.create({
        data: {
          productCode,
          categoryId,
          userId: BigInt(toNumber(formData.get("userId"), 1)),
          productName,
          subGroupName: toOptionalString(formData.get("subGroupName")),
          slug: toOptionalString(formData.get("slug")),
          productVariation: toOptionalString(formData.get("productVariation")),
          productDescription: toOptionalString(formData.get("productDescription")),
          nutritionInfo: toOptionalString(formData.get("nutritionInfo")),
          cookingInstruction: toOptionalString(formData.get("cookingInstruction")),
          storageInstruction: toOptionalString(formData.get("storageInstruction")),
          pImage: mainImageUrl,
          productStatus: formData.get("productStatus") === "true",
          actualPrice: toNumber(formData.get("actualPrice")),
          sellingPrice: toNumber(formData.get("sellingPrice") || formData.get("SellingPrice")),
          deliveryTargetDays: toOptionalBigInt(formData.get("deliveryTargetDays") || formData.get("delivaryTargetDays")),
          stockQuantity: toOptionalBigInt(formData.get("stockQuantity")),
          availableQuantity: toOptionalBigInt(formData.get("availableQuantity")),
          flashSale: formData.get("flashSale") === "true",
          specialOffer: formData.get("specialOffer") === "true",
        },
      });

      const galleryUrls: string[] = [];
      for (const entry of productImages) {
        if (entry instanceof File && entry.size > 0) {
          const imageUrl = await saveProductImage(entry, "gallery");
          galleryUrls.push(imageUrl);
        }
      }

      if (galleryUrls.length > 0) {
        await prisma.productImage.createMany({
          data: galleryUrls.map((imageUrl) => ({
            productId: createdProduct.productId,
            imageUrl,
          })),
        });
      }

      return NextResponse.json(
        {
          success: true,
          message: "Product saved successfully",
          data: {
            productId: createdProduct.productId.toString(),
            productCode: createdProduct.productCode,
            pImage: createdProduct.pImage,
            galleryCount: galleryUrls.length,
          },
        },
        { status: 200, headers: corsHeaders },
      );
    }

    const { product }: { product: ProductDTO[] } = await req.json();
    if (!product || product.length === 0) {
      return NextResponse.json({ success: false, message: "Products are required" }, { status: 400, headers: corsHeaders });
    }

    let insertedCount = 0;
    let updatedCount = 0;
    let deactivatedSubGroupCount = 0;
    const deactivatedSubGroups = new Set<string>();

    for (const item of product) {
      const nextCategoryId = normalizeText(item.categoryId);
      const nextProductName = normalizeText(item.productName);
      const nextSubGroupName = normalizeText(item.subGroupName) || null;
      const source = item as ProductDTO & Record<string, unknown>;
      const nextActualPrice = Number(
        source.actualPrice ??
          source.TradeRate ??
          source.tradeRate ??
          source.trade_rate ??
          source.BuyRate ??
          0,
      );
      const nextSellingPrice = Number(
        source.sellingPrice ??
          source.MRP ??
          source.mrp ??
          source.SalesRate ??
          source.salesRate ??
          0,
      );
      const nextDeliveryTargetDays = item.deliveryTargetDays !== undefined && item.deliveryTargetDays !== null ? nullableBigInt(item.deliveryTargetDays) : null;
      const nextStockQuantity = item.stockQuantity !== undefined && item.stockQuantity !== null ? nullableBigInt(item.stockQuantity) : null;
      const nextAvailableQuantity = item.availableQuantity !== undefined && item.availableQuantity !== null ? nullableBigInt(item.availableQuantity) : null;

      const existing = await prisma.products.findUnique({
        where: { productCode: item.productCode },
        select: {
          productCode: true,
          categoryId: true,
          productName: true,
          subGroupName: true,
          actualPrice: true,
          sellingPrice: true,
          deliveryTargetDays: true,
          stockQuantity: true,
          availableQuantity: true,
        },
      });

      const createPayload = {
        categoryId: nextCategoryId,
        userId: BigInt(item.userId),
        productName: nextProductName,
        subGroupName: nextSubGroupName,
        slug: item.slug ?? null,
        productVariation: item.productVariation ?? null,
        productDescription: item.productDescription ?? null,
        nutritionInfo: item.nutritionInfo ?? null,
        cookingInstruction: item.cookingInstruction ?? null,
        storageInstruction: item.storageInstruction ?? null,
        pImage: item.pImage ?? null,
        productStatus: typeof item.productStatus === "boolean" ? item.productStatus : false,
        actualPrice: nextActualPrice,
        sellingPrice: nextSellingPrice,
        deliveryTargetDays: nextDeliveryTargetDays,
        stockQuantity: nextStockQuantity,
        availableQuantity: nextAvailableQuantity,
        flashSale: Boolean(item.flashSale),
        specialOffer: Boolean(item.specialOffer),
      };

      const updatePayload = {
        categoryId: nextCategoryId,
        userId: BigInt(item.userId),
        productName: nextProductName,
        actualPrice: nextActualPrice,
        sellingPrice: nextSellingPrice,
        deliveryTargetDays: nextDeliveryTargetDays ?? undefined,
        stockQuantity: nextStockQuantity ?? undefined,
        availableQuantity: nextAvailableQuantity ?? undefined,
        subGroupName: nextSubGroupName ?? undefined,
        slug: toOptionalTrimmedStringOrUndefined(item.slug),
        productVariation: toOptionalTrimmedStringOrUndefined(item.productVariation),
        productDescription: toOptionalTrimmedStringOrUndefined(item.productDescription),
        nutritionInfo: toOptionalTrimmedStringOrUndefined(item.nutritionInfo),
        cookingInstruction: toOptionalTrimmedStringOrUndefined(item.cookingInstruction),
        storageInstruction: toOptionalTrimmedStringOrUndefined(item.storageInstruction),
        pImage: toOptionalTrimmedStringOrUndefined(item.pImage),
      };

      if (existing) {
        const stockChanged = !sameBigIntValue(existing.stockQuantity, nextStockQuantity) || !sameBigIntValue(existing.availableQuantity, nextAvailableQuantity);
        const omsIdentityChanged = normalizeText(existing.categoryId) !== nextCategoryId || normalizeText(existing.productName) !== nextProductName || normalizeText(existing.subGroupName) !== normalizeText(nextSubGroupName) || Number(existing.actualPrice ?? 0) !== nextActualPrice || Number(existing.sellingPrice ?? 0) !== nextSellingPrice;

        await prisma.products.update({
          where: { productCode: item.productCode },
          data: updatePayload,
        });
        updatedCount += 1;

        if (omsIdentityChanged) {
          const affectedSubGroup = nextSubGroupName || existing.subGroupName || "";
          if (affectedSubGroup) {
            const result = await prisma.products.updateMany({
              where: { subGroupName: affectedSubGroup },
              data: { productStatus: false },
            });
            deactivatedSubGroups.add(affectedSubGroup);
            deactivatedSubGroupCount += result.count;
          } else {
            await prisma.products.update({
              where: { productCode: item.productCode },
              data: { productStatus: false },
            });
            deactivatedSubGroupCount += 1;
          }
        } else if (stockChanged) {
          // Stock-only refreshes come from OMS full-reset and must not change product status.
        }
      } else {
        await prisma.products.create({
          data: {
            productCode: item.productCode,
            ...createPayload,
          },
        });
        insertedCount += 1;
      }
    }

    return NextResponse.json(
      {
        success: true,
        insertedCount,
        updatedCount,
        deactivatedSubGroupCount,
        deactivatedSubGroups: Array.from(deactivatedSubGroups),
        message: "Products synced successfully",
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: String(error),
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    const productCode = formData.get("productCode") as string;
    const subGroupName = formData.get("subGroupName") as string | null;

    const productDescription = formData.get("productDescription") as string;

    const nutritionalInformation = formData.get("nutritionalInformation") as string;

    const cookingDescription = formData.get("cookingDescription") as string;

    const storageInstruction = formData.get("storageInstruction") as string;

    const delivaryTargetDays = formData.get("delivaryTargetDays") as string;

    const productStatusRaw = formData.get("productStatus");
    const specialOfferRaw = formData.get("specialOffer");
    const productStatus = productStatusRaw === "true";
    const specialOffer = specialOfferRaw === "true";

    const productImage = formData.get("productImage") as File | null;
    const galleryImageFiles = formData.getAll("productImages").filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (!productCode) {
      return NextResponse.json(
        {
          success: false,
          message: "productCode is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const existingProduct = await prisma.products.findUnique({
      where: { productCode },
      select: { subGroupName: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        },
      );
    }

    let imagePath: string | null = null;

    if (productImage && productImage.size > 0) {
      imagePath = await saveProductImage(productImage, "main");
    }

    const product = await prisma.products.update({
      where: {
        productCode,
      },
      data: {
        ...(productDescription !== undefined && {
          productDescription: productDescription.trim() || null,
        }),

        ...(nutritionalInformation !== undefined && {
          nutritionInfo: nutritionalInformation.trim() || null,
        }),

        ...(cookingDescription !== undefined && {
          cookingInstruction: cookingDescription.trim() || null,
        }),

        ...(storageInstruction !== undefined && {
          storageInstruction: storageInstruction.trim() || null,
        }),

        ...(delivaryTargetDays !== undefined && {
          deliveryTargetDays: Number(delivaryTargetDays),
        }),

        ...(imagePath && {
          pImage: imagePath,
        }),
      },
    });

    const statusGroupName = typeof subGroupName === "string" && subGroupName.trim() ? subGroupName.trim() : existingProduct.subGroupName;

    if (statusGroupName) {
      await prisma.products.updateMany({
        where: { subGroupName: statusGroupName },
        data: {
          ...(productStatusRaw !== null && { productStatus }),
          ...(specialOfferRaw !== null && { specialOffer }),
          ...(delivaryTargetDays !== undefined && {
            deliveryTargetDays:
              String(delivaryTargetDays || "").trim() === ""
                ? null
                : BigInt(Number(delivaryTargetDays)),
          }),
        },
      });
    } else {
      await prisma.products.update({
        where: { productCode },
        data: {
          ...(productStatusRaw !== null && { productStatus }),
          ...(specialOfferRaw !== null && { specialOffer }),
          ...(delivaryTargetDays !== undefined && {
            deliveryTargetDays:
              String(delivaryTargetDays || "").trim() === ""
                ? null
                : BigInt(Number(delivaryTargetDays)),
          }),
        },
      });
    }

    if (galleryImageFiles.length > 0) {
      const galleryUrls: string[] = [];
      for (const file of galleryImageFiles) {
        galleryUrls.push(await saveProductImage(file, "gallery"));
      }

      await prisma.$transaction([
        prisma.productImage.deleteMany({
          where: { productId: product.productId },
        }),
        prisma.productImage.createMany({
          data: galleryUrls.map((imageUrl) => ({
            productId: product.productId,
            imageUrl,
          })),
        }),
      ]);
    }

    const safeProduct = JSON.parse(
      JSON.stringify(
        {
          ...product,
          galleryCount: galleryImageFiles.length,
        },
        (_, value) => (typeof value === "bigint" ? value.toString() : value),
      ),
    );

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        data: safeProduct,
      },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: String(error),
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}
