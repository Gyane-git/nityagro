import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function mapWishlist(row: {
  wishId: bigint;
  productId: bigint;
  products?: {
    productId: bigint;
    productName: string;
    subGroupName: string | null;
    sellingPrice: number;
    pImage: string | null;
  } | null;
}) {
  const product = row.products;
  return {
    wishId: row.wishId.toString(),
    id: Number(row.productId),
    productId: row.productId.toString(),
    name: product?.subGroupName || product?.productName || "Product",
    price: Number(product?.sellingPrice || 0),
    image: product?.pImage || "/products/mustard-oil.png",
  };
}

async function resolveProductId(input: unknown) {
  const raw = Number(input);
  if (!Number.isFinite(raw) || raw <= 0) return null;

  const direct = await prisma.products.findUnique({
    where: { productId: BigInt(raw) },
    select: { productId: true },
  });
  if (direct) return direct.productId;

  const variant = await prisma.productVariant.findUnique({
    where: { variantId: BigInt(raw) },
    select: { pCode: true },
  });
  if (!variant?.pCode) return null;

  const product = await prisma.products.findUnique({
    where: { productCode: variant.pCode },
    select: { productId: true },
  });

  return product?.productId || null;
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const auth = await requireAuth();
    const rows = await prisma.wishlist.findMany({
      where: { userId: BigInt(auth.sub) },
      include: {
        products: {
          select: {
            productId: true,
            productName: true,
            subGroupName: true,
            sellingPrice: true,
            pImage: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(
      { success: true, data: rows.map(mapWishlist) },
      { status: 200, headers: corsHeaders },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401, headers: corsHeaders },
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    const body = await req.json();
    const productId = await resolveProductId(body?.productId ?? body?.id);

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const userId = BigInt(auth.sub);
    const existing = await prisma.wishlist.findFirst({
      where: { userId, productId },
      select: { wishId: true },
    });

    const row = existing
      ? await prisma.wishlist.findUnique({
          where: { wishId: existing.wishId },
          include: {
            products: {
              select: {
                productId: true,
                productName: true,
                subGroupName: true,
                sellingPrice: true,
                pImage: true,
              },
            },
          },
        })
      : await prisma.wishlist.create({
          data: { userId, productId },
          include: {
            products: {
              select: {
                productId: true,
                productName: true,
                subGroupName: true,
                sellingPrice: true,
                pImage: true,
              },
            },
          },
        });

    return NextResponse.json(
      { success: true, message: "Wishlist updated", data: row ? mapWishlist(row) : null },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update wishlist",
      },
      { status: 400, headers: corsHeaders },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await requireAuth();
    const body = await req.json().catch(() => ({}));
    const userId = BigInt(auth.sub);

    if (body?.clear === true) {
      await prisma.wishlist.deleteMany({ where: { userId } });
      return NextResponse.json(
        { success: true, message: "Wishlist cleared" },
        { status: 200, headers: corsHeaders },
      );
    }

    const productId = await resolveProductId(body?.productId ?? body?.id);
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    await prisma.wishlist.deleteMany({ where: { userId, productId } });

    return NextResponse.json(
      { success: true, message: "Wishlist item removed" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update wishlist",
      },
      { status: 400, headers: corsHeaders },
    );
  }
}
