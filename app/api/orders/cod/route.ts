import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type CheckoutItemInput = {
  id: number | string;
  qty?: number;
  unitPrice?: number;
  total?: number;
  name?: string;
};

type AddressInput = {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
  area?: string;
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: CheckoutItemInput[] = Array.isArray(body?.items) ? body.items : [];
    const address: AddressInput | null = body?.address ?? null;
    const userId = Number(body?.userId ?? 1);

    if (!items.length) {
      return NextResponse.json(
        { success: false, message: "No checkout items provided" },
        { status: 400, headers: corsHeaders },
      );
    }

    const normalizedItems = items
      .map((item) => ({
        productId: Number(item.id),
        qty: Math.max(1, Number(item.qty ?? 1)),
        unitPrice: Number(item.unitPrice ?? 0),
      }))
      .filter((item) => Number.isFinite(item.productId) && item.productId > 0);

    if (!normalizedItems.length) {
      return NextResponse.json(
        { success: false, message: "Invalid checkout item ids" },
        { status: 400, headers: corsHeaders },
      );
    }

    const productIds = normalizedItems.map((item) => BigInt(item.productId));

    const products = await prisma.products.findMany({
      where: { productId: { in: productIds } },
      select: {
        productId: true,
        productName: true,
        sellingPrice: true,
        actualPrice: true,
        productStatus: true,
      },
    });

    const productMap = new Map(products.map((p) => [p.productId.toString(), p]));

    const missing = normalizedItems.filter(
      (item) => !productMap.has(String(item.productId)),
    );
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, message: "Some products no longer exist" },
        { status: 400, headers: corsHeaders },
      );
    }

    const inactive = normalizedItems.filter((item) => {
      const p = productMap.get(String(item.productId));
      return !p?.productStatus;
    });
    if (inactive.length > 0) {
      return NextResponse.json(
        { success: false, message: "Some products are inactive" },
        { status: 400, headers: corsHeaders },
      );
    }

    const txCode = `COD-${Date.now()}`;
    const now = new Date();

    const created = await prisma.$transaction(async (tx) => {
      const createdOrders: {
        orderId: bigint;
        productId: bigint;
        totalAmount: number;
      }[] = [];

      for (const row of normalizedItems) {
        const product = productMap.get(String(row.productId));
        const unitPrice = row.unitPrice > 0 ? row.unitPrice : Number(product?.sellingPrice ?? 0);
        const lineTotal = Number((unitPrice * row.qty).toFixed(2));

        const order = await tx.orders.create({
          data: {
            userId: BigInt(userId),
            productId: BigInt(row.productId),
            totalAmount: lineTotal,
            orderStatus: "PLACED",
            paymentStatus: "PENDING",
          },
        });

        await tx.paymentDetails.create({
          data: {
            orderId: order.orderId,
            userId: BigInt(userId),
            paymentMode: "COD",
            paymentAmount: lineTotal,
            paymentDate: now,
            transactionId: txCode,
            paymentStatus: "PENDING",
          },
        });

        await tx.shippingDetails.create({
          data: {
            orderId: order.orderId,
            productId: BigInt(row.productId),
            shippingStatus: "PENDING",
            shippingRemark: address
              ? [
                  address.fullName,
                  address.phone,
                  address.address,
                  address.city,
                  address.region,
                  address.area,
                ]
                  .filter(Boolean)
                  .join(" | ")
              : "",
          },
        });

        createdOrders.push({
          orderId: order.orderId,
          productId: order.productId,
          totalAmount: order.totalAmount,
        });
      }

      return createdOrders;
    });

    const grandTotal = created.reduce((sum, o) => sum + Number(o.totalAmount), 0);

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully (Cash on Delivery)",
        data: {
          orderIds: created.map((o) => o.orderId.toString()),
          transactionId: txCode,
          itemCount: created.length,
          grandTotal,
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Order placement failed",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
