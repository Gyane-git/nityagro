import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

function serializeProduct(row: {
  productId: bigint;
  productCode: string;
  productName: string;
  subGroupName: string | null;
  categoryId: string;
  pImage: string | null;
  sellingPrice: number;
  actualPrice: number;
}) {
  const name = row.subGroupName || row.productName || "Product";
  return {
    id: row.productId.toString(),
    productId: row.productId.toString(),
    product_code: row.productCode,
    productCode: row.productCode,
    product_name: name,
    productName: row.productName,
    subGroupName: row.subGroupName,
    category: row.categoryId,
    price: Number(row.sellingPrice || row.actualPrice || 0),
    main_image_full_url: row.pImage || "/no-image.png",
    image: row.pImage || "/no-image.png",
    url: `/products/${row.productId.toString()}`,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = String(
      searchParams.get("name") ||
        searchParams.get("q") ||
        searchParams.get("query") ||
        "",
    ).trim();
    const limit = Math.min(30, Math.max(1, Number(searchParams.get("limit") || 10)));
    const offset = Math.max(0, Number(searchParams.get("offset") || 0));

    if (!query) {
      return NextResponse.json(
        { success: true, products: { products: [], total: 0 }, data: [] },
        { status: 200, headers: corsHeaders },
      );
    }

    const where = {
      productStatus: true,
      OR: [
        { productName: { contains: query } },
        { subGroupName: { contains: query } },
        { productCode: { contains: query } },
        { categoryId: { contains: query } },
      ],
    };

    const [rows, total] = await Promise.all([
      prisma.products.findMany({
        where,
        distinct: ["subGroupName"],
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        skip: offset,
        take: limit,
        select: {
          productId: true,
          productCode: true,
          productName: true,
          subGroupName: true,
          categoryId: true,
          pImage: true,
          sellingPrice: true,
          actualPrice: true,
        },
      }),
      prisma.products.count({ where }),
    ]);

    const products = rows.map(serializeProduct);

    return NextResponse.json(
      {
        success: true,
        products: { products, total, limit, offset },
        data: products,
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Search failed",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
