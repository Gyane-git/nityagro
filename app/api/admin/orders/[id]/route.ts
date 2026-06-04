import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import { buildOrderStatusEmail } from "@/lib/orderEmail";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function normalizeOrderStatus(value: string | null | undefined) {
  const v = String(value || "")
    .toLowerCase()
    .trim();
  if (!v || v === "placed" || v === "pending") return "processing";
  if (["processing", "shipped", "delivered", "cancelled", "returns"].includes(v)) {
    return v;
  }
  return "processing";
}

function toDbOrderStatus(value: string | null | undefined) {
  const v = normalizeOrderStatus(value);
  if (v === "processing") return "PLACED";
  return v.toUpperCase();
}

function normalizePaymentStatus(value: string | null | undefined) {
  const v = String(value || "")
    .toLowerCase()
    .trim();
  if (!v || v === "pending") return "unpaid";
  if (["unpaid", "paid", "partial", "refunded"].includes(v)) return v;
  return "unpaid";
}

function toDbPaymentStatus(value: string | null | undefined) {
  const v = normalizePaymentStatus(value);
  if (v === "unpaid") return "PENDING";
  return v.toUpperCase();
}

function getProductDisplayName(product: { subGroupName?: string | null; productName?: string | null }) {
  const group = String(product?.subGroupName || "").trim();
  const variant = String(product?.productName || "").trim();

  if (group && variant && group.toLowerCase() !== variant.toLowerCase()) {
    return `${group} (${variant})`;
  }
  return group || variant || "N/A";
}

function getOrderAmounts(order: { quantity?: bigint | number | null; unitPrice?: number | null; productTotal?: number | null; deliveryCharge?: number | null; totalAmount?: number | null; product?: { sellingPrice?: number | null } | null }) {
  const qty = Math.max(1, Number(order.quantity || 1));
  const unitPrice = Number(order.unitPrice || 0) > 0 ? Number(order.unitPrice) : Number(order.product?.sellingPrice || 0) > 0 ? Number(order.product?.sellingPrice) : Number(order.totalAmount || 0) / qty;
  const productTotal = Number(order.productTotal || 0) > 0 ? Number(order.productTotal) : Number((unitPrice * qty).toFixed(2));
  const deliveryCharge = Number(order.deliveryCharge || 0) > 0 ? Number(order.deliveryCharge) : Math.max(0, Number(order.totalAmount || 0) - productTotal);
  const totalAmount = Number(order.totalAmount || 0) > 0 ? Number(order.totalAmount) : Number((productTotal + deliveryCharge).toFixed(2));

  return { qty, unitPrice, productTotal, deliveryCharge, totalAmount };
}

type AdminOrderRow = {
  orderId: bigint;
  quantity: bigint;
  orderStatus: string | null;
  paymentStatus: string | null;
  totalAmount: number;
  createdAt: Date;
  users?: { name: string | null; email: string | null; phone: string | null } | null;
  product?: {
    productCode: string;
    productName: string;
    subGroupName: string | null;
    sellingPrice?: number | null;
    deliveryTargetDays?: bigint | number | null;
  } | null;
  paymentDetails?: Array<{
    paymentMode: string | null;
    transactionId: string | null;
    paymentStatus: string | null;
    paymentAmount: number | null;
    paymentDate: Date | null;
    updatedAt: Date;
  }>;
  shippingDetails?: Array<{
    shippingCourier: string | null;
    trackingNumber: string | null;
    shippingDate: Date | null;
    shippingRemark: string | null;
    updatedAt: Date;
  }>;
};

function mapOrder(order: AdminOrderRow) {
  const orderStatus = normalizeOrderStatus(order.orderStatus);
  const paymentStatus = normalizePaymentStatus(order.paymentStatus);
  const payment = order.paymentDetails?.[0] || null;
  const shipping = order.shippingDetails?.[0] || null;
  const amounts = getOrderAmounts(order);
  return {
    id: order.orderId.toString(),
    orderNumber: `NG-${order.orderId.toString()}`,
    orderStatus,
    paymentStatus,
    totalAmount: amounts.totalAmount,
    subtotal: amounts.productTotal,
    shippingCost: amounts.deliveryCharge,
    tax: 0,
    createdAt: order.createdAt,
    user: {
      fullName: order.users?.name || "N/A",
      email: order.users?.email || "",
      phone: order.users?.phone || "",
    },
    paymentMethod: payment?.paymentMode || "COD",
    transactionId: payment?.transactionId || "",
    payments: payment
      ? [
          {
            paymentMode: payment.paymentMode || "COD",
            transactionId: payment.transactionId || "",
            paymentStatus: normalizePaymentStatus(payment.paymentStatus),
            amount: Number(payment.paymentAmount || 0),
            paidAt: payment.paymentDate,
          },
        ]
      : [],
    items: [
      {
        id: `${order.orderId}-1`,
        productCode: order.product?.productCode || "",
        quantity: amounts.qty,
        unitPrice: amounts.unitPrice,
        subtotal: amounts.productTotal,
        serialNumber: null,
        product: {
          name: getProductDisplayName(order.product || {}),
          deliveryTargetDays:
            order.product?.deliveryTargetDays === null ||
            order.product?.deliveryTargetDays === undefined
              ? null
              : Number(order.product.deliveryTargetDays),
        },
      },
    ],
    updateLogs: [
      ...(payment
        ? [
            {
              id: `pay-${order.orderId}`,
              eventType: "payment_status",
              fromPaymentStatus: null,
              toPaymentStatus: normalizePaymentStatus(payment.paymentStatus),
              paymentMode: payment.paymentMode,
              transactionId: payment.transactionId,
              // remark: null,
              remark: payment.paymentStatus ? `Payment ${payment.paymentStatus}` : "Payment updated",
              createdAt: payment.updatedAt,
            },
          ]
        : []),
      ...(shipping
        ? [
            {
              id: `ship-${order.orderId}`,
              eventType: "order_status",
              fromOrderStatus: null,
              toOrderStatus: orderStatus,
              courierName: shipping.shippingCourier,
              cnNumber: shipping.trackingNumber,
              cnDate: shipping.shippingDate,
              remark: shipping.shippingRemark,
              cancelReason: orderStatus === "cancelled" ? shipping.shippingRemark : null,
              createdAt: shipping.updatedAt,
            },
          ]
        : []),
    ],
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orderId = BigInt(id);

    const order = await prisma.orders.findUnique({
      where: { orderId },
      include: {
        users: { select: { name: true, email: true, phone: true } },
        product: {
          select: {
            productCode: true,
            productName: true,
            subGroupName: true,
            sellingPrice: true,
            deliveryTargetDays: true,
          },
        },
        paymentDetails: { orderBy: { paymentDetailsId: "desc" }, take: 1 },
        shippingDetails: { orderBy: { shippingDetailsId: "desc" }, take: 1 },
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, data: mapOrder(order) }, { status: 200, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch order" }, { status: 500, headers: corsHeaders });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orderId = BigInt(id);
    const body = await req.json();

    const orderStatus = body?.orderStatus ? String(body.orderStatus).toLowerCase() : null;
    const paymentStatus = body?.paymentStatus ? String(body.paymentStatus).toLowerCase() : null;
    const paymentMode = body?.paymentMode ? String(body.paymentMode) : null;
    const transactionId = body?.transactionId ? String(body.transactionId) : null;

    const current = await prisma.orders.findUnique({
      where: { orderId },
      include: {
        paymentDetails: { orderBy: { paymentDetailsId: "desc" }, take: 1 },
        shippingDetails: { orderBy: { shippingDetailsId: "desc" }, take: 1 },
      },
    });

    if (!current) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404, headers: corsHeaders });
    }

    await prisma.$transaction(async (tx) => {
      if (orderStatus) {
        await tx.orders.update({
          where: { orderId },
          data: { orderStatus: toDbOrderStatus(orderStatus) },
        });

        const shipping = current.shippingDetails?.[0];
        if (shipping) {
          await tx.shippingDetails.update({
            where: { shippingDetailsId: shipping.shippingDetailsId },
            data: {
              shippingStatus: orderStatus.toUpperCase(),
              shippingCourier: body?.courierName || shipping.shippingCourier,
              trackingNumber: body?.cnNumber || shipping.trackingNumber,
              shippingDate: body?.cnDate ? new Date(body.cnDate) : shipping.shippingDate,
              shippingRemark: body?.remark || body?.cancelReason || shipping.shippingRemark,
            },
          });

          const delivery = await tx.deliveryDetails.findFirst({
            where: { shippingDetailsId: shipping.shippingDetailsId },
            orderBy: { deliveryDetailsId: "desc" },
          });

          if (delivery) {
            await tx.deliveryDetails.update({
              where: { deliveryDetailsId: delivery.deliveryDetailsId },
              data: {
                deliveryStatus: orderStatus.toUpperCase(),
                deliveryRemark: body?.remark || body?.cancelReason || delivery.deliveryRemark,
                transactionId: body?.transactionId || delivery.transactionId,
                paymentMode: paymentMode || delivery.paymentMode,
              },
            });
          }
        }
      }

      if (paymentStatus) {
        await tx.orders.update({
          where: { orderId },
          data: { paymentStatus: toDbPaymentStatus(paymentStatus) },
        });

        const latestPayment = current.paymentDetails?.[0];
        if (latestPayment) {
          await tx.paymentDetails.update({
            where: { paymentDetailsId: latestPayment.paymentDetailsId },
            data: {
              paymentStatus: toDbPaymentStatus(paymentStatus),
              paymentMode: paymentMode || latestPayment.paymentMode,
              transactionId: transactionId ?? latestPayment.transactionId,
              paymentDate: paymentStatus === "paid" ? new Date() : latestPayment.paymentDate,
            },
          });
        } else {
          await tx.paymentDetails.create({
            data: {
              orderId,
              userId: current.userId,
              paymentMode: paymentMode || "COD",
              paymentAmount: Number(current.totalAmount || 0),
              paymentDate: paymentStatus === "paid" ? new Date() : null,
              transactionId,
              paymentStatus: toDbPaymentStatus(paymentStatus),
            },
          });
        }
      }
    });

    const updated = await prisma.orders.findUnique({
      where: { orderId },
      include: {
        users: { select: { name: true, email: true, phone: true } },
        product: {
          select: {
            productCode: true,
            productName: true,
            subGroupName: true,
            sellingPrice: true,
            deliveryTargetDays: true,
          },
        },
        paymentDetails: { orderBy: { paymentDetailsId: "desc" }, take: 1 },
        shippingDetails: { orderBy: { shippingDetailsId: "desc" }, take: 1 },
      },
    });

    if (!updated) {
      return NextResponse.json({ success: false, message: "Order not found after update" }, { status: 404, headers: corsHeaders });
    }

    const mapped = mapOrder(updated);

    // Email notification on status/payment update (safe fail).
    try {
      if (mapped.user?.email && (orderStatus || paymentStatus)) {
        const emailContent = buildOrderStatusEmail({
          customerName: mapped.user.fullName || "Customer",
          orderId: mapped.id,
          productName: mapped.items?.[0]?.product?.name || "Product",
          orderStatus: mapped.orderStatus || "processing",
          paymentStatus: mapped.paymentStatus || "unpaid",
          amount: Number(mapped.totalAmount || 0),
        });
        await sendMail({
          to: mapped.user.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });
      }
    } catch (mailError) {
      console.error("Order status email send failed:", mailError);
    }

    return NextResponse.json({ success: true, data: mapped }, { status: 200, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to update order" }, { status: 500, headers: corsHeaders });
  }
}
