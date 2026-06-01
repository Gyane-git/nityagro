import { prisma } from "@/lib/prisma";
import { refreshLocalStockFromOms } from "@/lib/omsStock";
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

    const category = await prisma.productVariant.findMany({
      where: { subGroupName: id },
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

    const productCodes = category.map((item) => item.pCode).filter(Boolean);
    const products = productCodes.length
      ? await prisma.products.findMany({
          where: { productCode: { in: productCodes } },
          select: {
            productId: true,
            productCode: true,
            pImage: true,
            sellingPrice: true,
            actualPrice: true,
            stockQuantity: true,
            availableQuantity: true,
            productStatus: true,
          },
        })
      : [];
    const productByCode = new Map(
      products.map((product) => [product.productCode, product]),
    );
    const liveStockByCode = await refreshLocalStockFromOms(productCodes).catch((error) => {
      console.warn("Live OMS variant stock overlay failed", error);
      return new Map<string, number>();
    });

    const rows = category.map((item) => {
      const product = productByCode.get(item.pCode);
      const liveStock = liveStockByCode.get(item.pCode);
      return {
        ...item,
        stockQuantity: liveStock ?? item.stockQuantity,
        omsAvailableQty: liveStock ?? null,
        productId: product?.productId ?? null,
        productImage: product?.pImage ?? null,
        productSellingPrice: product?.sellingPrice ?? null,
        productActualPrice: product?.actualPrice ?? null,
        productStockQuantity: liveStock ?? product?.stockQuantity ?? null,
        productAvailableQuantity: liveStock ?? product?.availableQuantity ?? null,
        productStatus: product?.productStatus ?? true,
      };
    });

    const safeData = JSON.parse(
      JSON.stringify(rows, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
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
