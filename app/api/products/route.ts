import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

type ProductDTO = {
  productCode: string;
  categoryId: number;
  userId: number;
  productName: string;
  slug: string;
  productVariation: string;
  productDescription: string;
  nutritionInfo: string;
  cookingInstruction: string;
  storageInstruction: string;
  pImage: string;
  productStatus: boolean;
  actualPrice: number;
  sellingPrice: number;
  deliveryTargetDays: number;
  stockQuantity: number;
  availableQuantity: number;
  flashSale: boolean;
  specialOffer: boolean;
  createdAt: string;
  updatedAt: string;
};


export async function POST(req: Request) {
  try {
    // ✅ read ONLY ONCE
    const { product }: { product: ProductDTO[] } = await req.json();

    if (!product || product.length === 0) {
      return NextResponse.json(
        { success: false, message: "product are required" },
        { status: 400 },
      );
    }
    // const normalizeCategoryAssetUrl = (value: unknown) => {
    //   if (value === null || value === undefined || value === "") return null;
    //   if (typeof value !== "string") return null;
    //   const trimmed = value.trim();

    //   if (!trimmed) return null;
    //   if (trimmed.startsWith("/categories/")) return trimmed;
    //   if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    //     return trimmed;
    //   }

    //   const cleanName = trimmed.replace(/^\/+/, "");
    //   return `/categories/${cleanName}`;
    // };

    // ✅ 1. Find existing category names
    const existing = await prisma.products.findMany({
      where: {
        productName: {
          in: product.map((c) => c.productName),
        },
      },
      select: { productName: true },
    });

    const existingNames = new Set(existing.map((e) => e.productName));

    // ✅ 2. Split data
    const newCategories = product.filter(
      (c) => !existingNames.has(c.productName),
    );
    // ✅ 3. Insert only new
    let insertedCount = 0;

    if (newCategories.length > 0) {
      const details = await prisma.products.createMany({
        data: product.map((p) => ({
          productCode: p.productCode,
          categoryId: p.categoryId,
          userId: p.userId,
          productName: p.productName,
          slug: p.slug,
          productVariation: p.productVariation,
          productDescription: p.productDescription,
          nutritionInfo: p.nutritionInfo,
          cookingInstruction: p.cookingInstruction,
          storageInstruction: p.storageInstruction,
          pImage: p.pImage,
          productStatus: p.productStatus,
          actualPrice: p.actualPrice,
          sellingPrice: p.sellingPrice,
          deliveryTargetDays: p.deliveryTargetDays,
          stockQuantity: p.stockQuantity,
          availableQuantity: p.availableQuantity,
          flashSale: p.flashSale,
          specialOffer: p.specialOffer,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
      });
      insertedCount = details.count;
    }
    return NextResponse.json(
      {
        success: true,
        count: insertedCount,
        message: "Product saved successfully",
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
