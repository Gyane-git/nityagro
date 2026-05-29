import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function mapCart(row: {
  cartId: bigint;
  productId: bigint;
  quantity: bigint;
  product?: {
    productId: bigint;
    productCode: string;
    productName: string;
    subGroupName: string | null;
    sellingPrice: number;
    pImage: string | null;
    stockQuantity: bigint | null;
    availableQuantity: bigint | null;
  productStatus: boolean;
  variantStockQuantity?: bigint | null;
  } | null;
}) {
  const product = row.product;
  const name = product?.subGroupName || product?.productName || "Product";
  const availableStock = Math.max(
    Number(product?.variantStockQuantity ?? 0),
    Number(product?.availableQuantity ?? 0),
    Number(product?.stockQuantity ?? 0),
  );

  return {
    cartId: row.cartId.toString(),
    id: Number(row.productId),
    productId: row.productId.toString(),
    name,
    price: Number(product?.sellingPrice || 0),
    image: product?.pImage || "/products/mustard-oil.png",
    qty: Number(row.quantity || 1),
    weight: product?.productName || "1 item",
    stockQuantity: availableStock,
    availableQuantity: availableStock,
    productStatus: product?.productStatus !== false,
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

async function getAvailableStock(productId: bigint) {
  const product = await prisma.products.findUnique({
    where: { productId },
    select: {
      productCode: true,
      stockQuantity: true,
      availableQuantity: true,
    },
  });
  if (!product) return 0;

  const variant = await prisma.productVariant.findFirst({
    where: { pCode: product.productCode },
    select: { stockQuantity: true },
  });

  return Math.max(
    Number(variant?.stockQuantity ?? 0),
    Number(product.availableQuantity ?? 0),
    Number(product.stockQuantity ?? 0),
  );
}

async function mapCartRows(rows: Array<Parameters<typeof mapCart>[0]>) {
  const codes = rows
    .map((row) => row.product?.productCode)
    .filter((code): code is string => Boolean(code));
  const variants = codes.length
    ? await prisma.productVariant.findMany({
        where: { pCode: { in: codes } },
        select: { pCode: true, stockQuantity: true },
      })
    : [];
  const stockByCode = new Map(
    variants.map((variant) => [variant.pCode, variant.stockQuantity]),
  );

  return rows.map((row) =>
    mapCart({
      ...row,
      product: row.product
        ? {
            ...row.product,
            variantStockQuantity: stockByCode.get(row.product.productCode),
          }
        : row.product,
    }),
  );
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const auth = await requireAuth();
    const rows = await prisma.cartList.findMany({
      where: { userId: BigInt(auth.sub) },
      include: {
        product: {
          select: {
            productId: true,
            productCode: true,
            productName: true,
            subGroupName: true,
            sellingPrice: true,
            pImage: true,
            stockQuantity: true,
            availableQuantity: true,
            productStatus: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(
      { success: true, data: await mapCartRows(rows) },
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
    const requestedQuantity = Math.max(1, Number(body?.quantity ?? body?.qty ?? 1));

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const userId = BigInt(auth.sub);
    const availableStock = await getAvailableStock(productId);
    const existing = await prisma.cartList.findFirst({
      where: { userId, productId },
      select: { cartId: true, quantity: true },
    });
    const nextQuantity =
      availableStock > 0
        ? Math.min(Number(existing?.quantity || 0) + requestedQuantity, availableStock)
        : Number(existing?.quantity || 0) + requestedQuantity;

    const row = existing
      ? await prisma.cartList.update({
          where: { cartId: existing.cartId },
          data: { quantity: BigInt(nextQuantity) },
          include: {
            product: {
              select: {
                productId: true,
                productCode: true,
                productName: true,
                subGroupName: true,
                sellingPrice: true,
                pImage: true,
                stockQuantity: true,
                availableQuantity: true,
                productStatus: true,
              },
            },
          },
        })
      : await prisma.cartList.create({
          data: { userId, productId, quantity: BigInt(availableStock > 0 ? Math.min(requestedQuantity, availableStock) : requestedQuantity) },
          include: {
            product: {
              select: {
                productId: true,
                productCode: true,
                productName: true,
                subGroupName: true,
                sellingPrice: true,
                pImage: true,
                stockQuantity: true,
                availableQuantity: true,
                productStatus: true,
              },
            },
          },
        });

    return NextResponse.json(
      { success: true, message: "Cart updated", data: (await mapCartRows([row]))[0] },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update cart",
      },
      { status: 400, headers: corsHeaders },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await requireAuth();
    const body = await req.json();
    const productId = await resolveProductId(body?.productId ?? body?.id);
    const requestedQuantity = Math.max(1, Number(body?.quantity ?? body?.qty ?? 1));

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const existing = await prisma.cartList.findFirst({
      where: { userId: BigInt(auth.sub), productId },
      select: { cartId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Cart item not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const availableStock = await getAvailableStock(productId);
    const quantity =
      availableStock > 0 ? Math.min(requestedQuantity, availableStock) : requestedQuantity;

    await prisma.cartList.update({
      where: { cartId: existing.cartId },
      data: { quantity: BigInt(quantity) },
    });

    return NextResponse.json(
      { success: true, message: "Cart quantity updated" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update cart",
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
      await prisma.cartList.deleteMany({ where: { userId } });
      return NextResponse.json(
        { success: true, message: "Cart cleared" },
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

    await prisma.cartList.deleteMany({ where: { userId, productId } });

    return NextResponse.json(
      { success: true, message: "Cart item removed" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update cart",
      },
      { status: 400, headers: corsHeaders },
    );
  }
}
