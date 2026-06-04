import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { cancelOmsOrderSafely } from "@/lib/omsOrderSync";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const CANCELLABLE_STATUSES = new Set(["processing", "pending", "placed"]);

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
        { success: false, message: "Cancellation reason must be at least 5 characters" },
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

    const status = String(order.orderStatus || "processing").toLowerCase();
    if (!CANCELLABLE_STATUSES.has(status)) {
      return NextResponse.json(
        { success: false, message: "Only processing orders can be cancelled" },
        { status: 400, headers: corsHeaders },
      );
    }

    const existing = await prisma.orderCancellation.findFirst({
      where: { orderId: order.orderId, userId },
      select: { orderCancellationId: true },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Cancellation request already exists for this order" },
        { status: 409, headers: corsHeaders },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const cancellation = await tx.orderCancellation.create({
        data: {
          orderId: order.orderId,
          userId,
          productId: order.productId,
          cancellationReason: reason,
          cancellationStatus: true,
        },
      });

      const updatedOrder = await tx.orders.update({
        where: { orderId: order.orderId },
        data: { orderStatus: "cancelled" },
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

      return { cancellation, updatedOrder };
    });

    const omsCancelLog = await cancelOmsOrderSafely({
      prisma,
      localOrderId: order.orderId,
      reason,
    }).catch((error) => {
      console.error("OMS cancellation log failed:", error);
      return null;
    });

    return NextResponse.json(
      {
        success: true,
        message:
          omsCancelLog?.status === "SUCCESS"
            ? "Cancellation request submitted successfully"
            : "Cancellation saved locally. OMS cancellation will need retry from admin.",
        data: {
          id: result.cancellation.orderCancellationId.toString(),
          orderStatus: result.updatedOrder.orderStatus,
          omsCancelStatus: omsCancelLog?.status || "FAILED",
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to cancel order";
    return NextResponse.json(
      {
        success: false,
        message: message === "UNAUTHORIZED" ? "Please login to cancel order" : message,
      },
      { status: message === "UNAUTHORIZED" ? 401 : 500, headers: corsHeaders },
    );
  }
}
