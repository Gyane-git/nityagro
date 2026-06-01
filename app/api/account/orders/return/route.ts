import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function daysSince(value: Date) {
  return Math.floor((Date.now() - value.getTime()) / (1000 * 60 * 60 * 24));
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    const body = await req.json();
    const orderId = Number(body?.orderId || 0);
    const reason = String(body?.reason || "").trim();

    if (!Number.isFinite(orderId) || orderId <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid order id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (reason.length < 5) {
      return NextResponse.json(
        { success: false, message: "Return reason must be at least 5 characters" },
        { status: 400, headers: corsHeaders },
      );
    }

    const userId = BigInt(auth.sub);
    const order = await prisma.orders.findFirst({
      where: { orderId: BigInt(orderId), userId },
      select: {
        orderId: true,
        userId: true,
        productId: true,
        quantity: true,
        orderStatus: true,
        updatedAt: true,
        createdAt: true,
        product: {
          select: { productCode: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    if (String(order.orderStatus || "").toLowerCase() !== "delivered") {
      return NextResponse.json(
        { success: false, message: "Only delivered orders can be returned" },
        { status: 400, headers: corsHeaders },
      );
    }

    const deliveredDate = order.updatedAt || order.createdAt;
    if (daysSince(deliveredDate) > 7) {
      return NextResponse.json(
        { success: false, message: "Return window expired after 7 days" },
        { status: 400, headers: corsHeaders },
      );
    }

    const existing = await prisma.orderReturn.findFirst({
      where: { orderId: order.orderId, userId },
      select: { orderReturnId: true },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Return request already exists for this order" },
        { status: 409, headers: corsHeaders },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const orderReturn = await tx.orderReturn.create({
        data: {
          orderId: order.orderId,
          userId,
          productId: order.productId,
          reason,
          returnStatus: true,
        },
      });

      const updatedOrder = await tx.orders.update({
        where: { orderId: order.orderId },
        data: { orderStatus: "returns" },
      });

      await tx.products.update({
        where: { productId: order.productId },
        data: {
          stockQuantity: { increment: order.quantity },
          availableQuantity: { increment: order.quantity },
        },
      });

      if (order.product?.productCode) {
        await tx.productVariant.updateMany({
          where: { pCode: order.product.productCode },
          data: { stockQuantity: { increment: order.quantity } },
        });
      }

      return { orderReturn, updatedOrder };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Return request submitted successfully",
        data: {
          id: result.orderReturn.orderReturnId.toString(),
          orderStatus: result.updatedOrder.orderStatus,
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit return request";
    return NextResponse.json(
      {
        success: false,
        message: message === "UNAUTHORIZED" ? "Please login to submit return request" : message,
      },
      { status: message === "UNAUTHORIZED" ? 401 : 500, headers: corsHeaders },
    );
  }
}
