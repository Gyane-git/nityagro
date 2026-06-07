import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function normalizeReturnStatus(value: unknown) {
  const status = String(value || "").toLowerCase().trim();
  if (["new", "shipped", "cancelled", "refunded"].includes(status)) return status;
  return "";
}

function toOptionalString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

async function patchComboReturn(rawId: string, nextStatus: string, body: any) {
  const returnId = BigInt(rawId.replace(/^combo-/i, ""));

  const current = await prisma.comboOrderReturn.findUnique({
    where: { comboOrderReturnId: returnId },
    include: {
      comboOrder: {
        select: {
          comboOrderId: true,
          totalAmount: true,
          paymentStatus: true,
          orderStatus: true,
        },
      },
    },
  });

  if (!current) {
    return NextResponse.json(
      { success: false, message: "Combo return request not found" },
      { status: 404, headers: corsHeaders },
    );
  }

  await prisma.$transaction(async (tx) => {
    if (nextStatus === "cancelled") {
      await tx.comboOrderReturn.update({
        where: { comboOrderReturnId: returnId },
        data: { returnStatus: false },
      });
      await tx.comboOrders.update({
        where: { comboOrderId: current.comboOrderId },
        data: { orderStatus: "cancelled" },
      });
      return;
    }

    await tx.comboOrderReturn.update({
      where: { comboOrderReturnId: returnId },
      data: { returnStatus: true },
    });

    if (nextStatus === "shipped") {
      await tx.comboOrders.update({
        where: { comboOrderId: current.comboOrderId },
        data: { orderStatus: "SHIPPED" },
      });
      return;
    }

    if (nextStatus === "refunded") {
      await tx.comboOrders.update({
        where: { comboOrderId: current.comboOrderId },
        data: { paymentStatus: "REFUNDED" },
      });
    }
  });

  return NextResponse.json(
    {
      success: true,
      message: "Combo return status updated successfully",
      data: {
        id: `combo-${current.comboOrderReturnId.toString()}`,
        status: nextStatus,
      },
    },
    { status: 200, headers: corsHeaders },
  );
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const nextStatus = normalizeReturnStatus(body?.status);

    if (!nextStatus) {
      return NextResponse.json(
        { success: false, message: "Valid return status is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (/^combo-\d+$/i.test(id)) {
      return patchComboReturn(id, nextStatus, body);
    }

    const returnId = BigInt(id);

    const current = await prisma.orderReturn.findUnique({
      where: { orderReturnId: returnId },
      include: {
        orders: {
          select: {
            orderId: true,
            userId: true,
            productId: true,
            totalAmount: true,
            orderStatus: true,
            shippingDetails: {
              orderBy: { shippingDetailsId: "desc" },
              take: 1,
            },
            paymentDetails: {
              orderBy: { paymentDetailsId: "desc" },
              take: 1,
            },
            orderCancellation: {
              orderBy: { orderCancellationId: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    if (!current) {
      return NextResponse.json(
        { success: false, message: "Return request not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    await prisma.$transaction(async (tx) => {
      if (nextStatus === "cancelled") {
        const adminReason = toOptionalString(body?.adminReason || body?.reason);
        if (!adminReason) {
          throw new Error("Cancellation reason is required");
        }

        await tx.orderReturn.update({
          where: { orderReturnId: returnId },
          data: { returnStatus: false },
        });

        const existingCancellation = current.orders?.orderCancellation?.[0];
        if (existingCancellation) {
          await tx.orderCancellation.update({
            where: {
              orderCancellationId: existingCancellation.orderCancellationId,
            },
            data: {
              adminCancellationReason: adminReason,
              cancellationStatus: true,
            },
          });
        } else {
          await tx.orderCancellation.create({
            data: {
              orderId: current.orderId,
              userId: current.userId,
              productId: current.productId,
              cancellationReason: current.reason || "Return cancelled by admin",
              adminCancellationReason: adminReason,
              cancellationStatus: true,
            },
          });
        }

        await tx.orders.update({
          where: { orderId: current.orderId },
          data: { orderStatus: "cancelled" },
        });
        return;
      }

      await tx.orderReturn.update({
        where: { orderReturnId: returnId },
        data: { returnStatus: true },
      });

      if (nextStatus === "shipped") {
        const latestShipping = current.orders?.shippingDetails?.[0];
        const data = {
          shippingStatus: "RETURN_SHIPPED",
          shippingCourier: body?.courierName || latestShipping?.shippingCourier || null,
          trackingNumber: body?.cnNumber || latestShipping?.trackingNumber || null,
          shippingDate: body?.cnDate
            ? new Date(body.cnDate)
            : latestShipping?.shippingDate || new Date(),
          shippingRemark:
            body?.remark ||
            latestShipping?.shippingRemark ||
            "Return shipment processed",
        };

        if (latestShipping) {
          await tx.shippingDetails.update({
            where: { shippingDetailsId: latestShipping.shippingDetailsId },
            data,
          });
        } else {
          await tx.shippingDetails.create({
            data: {
              orderId: current.orderId,
              productId: current.productId,
              ...data,
            },
          });
        }

        await tx.orders.update({
          where: { orderId: current.orderId },
          data: { orderStatus: "SHIPPED" },
        });
      }

      if (nextStatus === "refunded") {
        const refundMode = toOptionalString(body?.refundMode || body?.paymentMode);
        const transactionId = toOptionalString(body?.transactionId);
        const refundRemark = toOptionalString(body?.remark);
        const refundAmount = Number(body?.amount || current.orders?.totalAmount || 0);

        if (!refundMode) {
          throw new Error("Refund payment mode is required");
        }
        if (!Number.isFinite(refundAmount) || refundAmount <= 0) {
          throw new Error("Valid refund amount is required");
        }

        await tx.paymentDetails.create({
          data: {
            orderId: current.orderId,
            userId: current.userId,
            paymentMode: refundMode,
            paymentAmount: refundAmount,
            paymentDate: new Date(),
            transactionId,
            paymentStatus: "REFUNDED",
          },
        });

        await tx.orders.update({
          where: { orderId: current.orderId },
          data: { paymentStatus: "REFUNDED" },
        });

        const latestShipping = current.orders?.shippingDetails?.[0];
        const shippingRemark = refundRemark
          ? `Refund: ${refundRemark}`
          : "Payment refunded for returned order";

        if (latestShipping) {
          await tx.shippingDetails.update({
            where: { shippingDetailsId: latestShipping.shippingDetailsId },
            data: { shippingRemark },
          });
        } else {
          await tx.shippingDetails.create({
            data: {
              orderId: current.orderId,
              productId: current.productId,
              shippingStatus: "RETURN_REFUNDED",
              shippingRemark,
            },
          });
        }
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Return status updated successfully",
        data: {
          id: current.orderReturnId.toString(),
          status: nextStatus,
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update return",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
