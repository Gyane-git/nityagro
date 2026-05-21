import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


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
  subGroupName?:string;
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

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

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
  const fileName = `${type}-${base}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);

  return `/uploads/products/${fileName}`;
}


export async function GET() {
  try {
    const productGroupWise = await prisma.products.findMany({
      distinct: ["subGroupName"],
    });

    // Fix BigInt serialization
    const safeData = JSON.parse(
      JSON.stringify(productGroupWise, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    return Response.json(
      {
        success: true,
        data: safeData,
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500, headers: corsHeaders },
    );
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
          sellingPrice: toNumber(
            formData.get("sellingPrice") || formData.get("SellingPrice"),
          ),
          deliveryTargetDays: toOptionalBigInt(
            formData.get("deliveryTargetDays") || formData.get("delivaryTargetDays"),
          ),
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
      return NextResponse.json(
        { success: false, message: "Products are required" },
        { status: 400, headers: corsHeaders },
      );
    }

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of product) {
      const existing = await prisma.products.findUnique({
        where: { productCode: item.productCode },
        select: { productCode: true },
      });

      const createPayload = {
        categoryId: item.categoryId,
        userId: BigInt(item.userId),
        productName: item.productName,
        subGroupName: item.subGroupName ?? null,
        slug: item.slug ?? null,
        productVariation: item.productVariation ?? null,
        productDescription: item.productDescription ?? null,
        nutritionInfo: item.nutritionInfo ?? null,
        cookingInstruction: item.cookingInstruction ?? null,
        storageInstruction: item.storageInstruction ?? null,
        pImage: item.pImage ?? null,
        productStatus:
          typeof item.productStatus === "boolean" ? item.productStatus : false,
        actualPrice: Number(item.actualPrice ?? 0),
        sellingPrice: Number(item.sellingPrice ?? 0),
        deliveryTargetDays:
          item.deliveryTargetDays !== undefined && item.deliveryTargetDays !== null
            ? BigInt(item.deliveryTargetDays)
            : null,
        stockQuantity:
          item.stockQuantity !== undefined && item.stockQuantity !== null
            ? BigInt(item.stockQuantity)
            : null,
        availableQuantity:
          item.availableQuantity !== undefined && item.availableQuantity !== null
            ? BigInt(item.availableQuantity)
            : null,
        flashSale: Boolean(item.flashSale),
        specialOffer: Boolean(item.specialOffer),
      };

      const updatePayload = {
        categoryId: item.categoryId,
        userId: BigInt(item.userId),
        productName: item.productName,
        productStatus:
          typeof item.productStatus === "boolean" ? item.productStatus : false,
        actualPrice: Number(item.actualPrice ?? 0),
        sellingPrice: Number(item.sellingPrice ?? 0),
        deliveryTargetDays:
          item.deliveryTargetDays !== undefined && item.deliveryTargetDays !== null
            ? BigInt(item.deliveryTargetDays)
            : undefined,
        stockQuantity:
          item.stockQuantity !== undefined && item.stockQuantity !== null
            ? BigInt(item.stockQuantity)
            : undefined,
        availableQuantity:
          item.availableQuantity !== undefined && item.availableQuantity !== null
            ? BigInt(item.availableQuantity)
            : undefined,
        flashSale: Boolean(item.flashSale),
        specialOffer: Boolean(item.specialOffer),
        subGroupName:
          toOptionalTrimmedStringOrUndefined(item.subGroupName) ?? undefined,
        slug: toOptionalTrimmedStringOrUndefined(item.slug),
        productVariation: toOptionalTrimmedStringOrUndefined(item.productVariation),
        productDescription: toOptionalTrimmedStringOrUndefined(item.productDescription),
        nutritionInfo: toOptionalTrimmedStringOrUndefined(item.nutritionInfo),
        cookingInstruction: toOptionalTrimmedStringOrUndefined(item.cookingInstruction),
        storageInstruction: toOptionalTrimmedStringOrUndefined(item.storageInstruction),
        pImage: toOptionalTrimmedStringOrUndefined(item.pImage),
      };

      if (existing) {
        await prisma.products.update({
          where: { productCode: item.productCode },
          data: updatePayload,
        });
        updatedCount += 1;
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

    const nutritionalInformation = formData.get(
      "nutritionalInformation"
    ) as string;

    const cookingDescription = formData.get(
      "cookingDescription"
    ) as string;

    const storageInstruction = formData.get(
      "storageInstruction"
    ) as string;

    const delivaryTargetDays = formData.get(
      "delivaryTargetDays"
    ) as string;

    const productStatusRaw = formData.get("productStatus");
    const specialOfferRaw = formData.get("specialOffer");
    const productStatus = productStatusRaw === "true";
    const specialOffer = specialOfferRaw === "true";

    const productImage = formData.get("productImage") as File | null;
    const galleryImageFiles = formData
      .getAll("productImages")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (!productCode) {
      return NextResponse.json(
        {
          success: false,
          message: "productCode is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
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
          productDescription:
            productDescription.trim() || null,
        }),

        ...(nutritionalInformation !== undefined && {
          nutritionInfo:
            nutritionalInformation.trim() || null,
        }),

        ...(cookingDescription !== undefined && {
          cookingInstruction:
            cookingDescription.trim() || null,
        }),

        ...(storageInstruction !== undefined && {
          storageInstruction:
            storageInstruction.trim() || null,
        }),

        ...(delivaryTargetDays !== undefined && {
          deliveryTargetDays: Number(delivaryTargetDays),
        }),

        ...(imagePath && {
          pImage: imagePath,
        }),
      },
    });

    const statusGroupName =
      typeof subGroupName === "string" && subGroupName.trim()
        ? subGroupName.trim()
        : existingProduct.subGroupName;

    if (statusGroupName) {
      await prisma.products.updateMany({
        where: { subGroupName: statusGroupName },
        data: {
          ...(productStatusRaw !== null && { productStatus }),
          ...(specialOfferRaw !== null && { specialOffer }),
        },
      });
    } else {
      await prisma.products.update({
        where: { productCode },
        data: {
          ...(productStatusRaw !== null && { productStatus }),
          ...(specialOfferRaw !== null && { specialOffer }),
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

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        data: {
          ...product,
          galleryCount: galleryImageFiles.length,
        },
      },
      {
        status: 200,
        headers: corsHeaders,
      }
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
      }
    );
  }
}

// export async function PUT(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       productCode,
//       productDescription	,
//       nutritionalInformation,
//       cookingDescription,
//       storageInstruction,
//       productStatus,
//       delivaryTargetDays,
//       productImage,
    
//     } = body;

//     if (!productCode) {
//       return NextResponse.json(
//         { success: false, message: "productCode is required" },
//         { status: 400, headers: corsHeaders },
//       );
//     }

  

//     const product = await prisma.products.update({
//       where: { productCode: productCode },
//       data: {
//         ...(productDescription	 !== undefined && {
//           productDescription	: typeof productDescription	 === "string" ? productDescription	.trim() || null : null,
//         }),
//         ...(nutritionalInformation !== undefined && {
//           nutritionInfo: typeof nutritionalInformation === "string" ? nutritionalInformation.trim() || null : null,
//         }),
//         ...(cookingDescription !== undefined && {
//           cookingInstruction:
//             typeof cookingDescription === "string"
//               ? cookingDescription.trim() || null
//               : null,
//         }),
//          ...(storageInstruction !== undefined && {
//           storageInstruction:
//             typeof storageInstruction === "string"
//               ? storageInstruction.trim() || null
//               : null,
//         }),
//          ...(productStatus !== undefined && {
//           productStatus: Boolean(productStatus),
//         }),
//         ...(delivaryTargetDays !== undefined && {
//           deliveryTargetDays: delivaryTargetDays,
//         }),
//         ...(productImage !== undefined && {
//           pImage: productImage,
//         }),
       
       
//       },
//     });

//     const safeData = JSON.parse(
//       JSON.stringify(product, (_, value) =>
//         typeof value === "bigint" ? value.toString() : value,
//       ),
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         message: `product updated successfully`,
//         data: safeData,
//       },
//       { status: 200, headers: corsHeaders },
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: String(error) },
//       { status: 500, headers: corsHeaders },
//     );
//   }
// }
