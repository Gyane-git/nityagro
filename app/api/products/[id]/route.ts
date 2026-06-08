import { prisma } from "@/lib/prisma";
import { refreshLocalStockFromOms } from "@/lib/omsStock";
import { applyOmsPriceOverlay, fetchOmsProductPrices } from "@/lib/omsProductPrices";
import { NextResponse } from "next/server";

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


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid category id " + id },
        { status: 400 },
      );
    }

    const isNumericId = /^\d+$/.test(String(id));
    const category = isNumericId
      ? await prisma.products.findFirst({
          where: {
            OR: [{ productId: BigInt(id) }, { productCode: id }],
          },
          include: {
            images: {
              orderBy: { productImageId: "asc" },
            },
          },
        })
      : await prisma.products.findUnique({
          where: { productCode: id },
          include: {
            images: {
              orderBy: { productImageId: "asc" },
            },
          },
        });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
       {
        status: 404,
        headers: corsHeaders,
      },
      );
    }

    const liveStock = await refreshLocalStockFromOms([category.productCode]).catch(
      (error) => {
        console.warn("Live OMS stock refresh for product API failed", error);
        return new Map<string, number>();
      },
    );
    const livePrices = await fetchOmsProductPrices([category.productCode]).catch(
      (error) => {
        console.warn("Live OMS price refresh for product API failed", error);
        return new Map<string, { actualPrice?: number; sellingPrice?: number }>();
      },
    );
    const liveQuantity = liveStock.get(category.productCode);
    const withPrice = applyOmsPriceOverlay(
      category,
      livePrices.get(category.productCode),
    );
    const data =
      liveQuantity === undefined
        ? withPrice
        : {
            ...withPrice,
            stockQuantity: BigInt(liveQuantity),
            availableQuantity: BigInt(liveQuantity),
            omsAvailableQty: liveQuantity,
          };
    const productImages = Array.isArray(data.images)
      ? data.images.map((image) => ({
          productImageId: image.productImageId,
          imageUrl: image.imageUrl,
          isMain: image.isMain,
        }))
      : [];

    const safeData = JSON.parse(
      JSON.stringify(
        {
          ...data,
          productImages,
          galleryImages: productImages.map((image) => image.imageUrl).filter(Boolean),
        },
        (_, value) => (typeof value === "bigint" ? value.toString() : value),
      ),
    );

    return NextResponse.json({
      success: true,
      data: safeData,
    },{
        status: 200,
        headers: corsHeaders,
      },);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
     {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}
