import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function normalizeOrderStatus(value: string | null | undefined) {
  const v = String(value || "").toLowerCase().trim();
  if (!v || v === "placed" || v === "pending") return "processing";
  if (["processing", "shipped", "delivered", "cancelled", "returns"].includes(v)) {
    return v;
  }
  return "processing";
}

function normalizePaymentStatus(value: string | null | undefined) {
  const v = String(value || "").toLowerCase().trim();
  if (!v || v === "pending") return "unpaid";
  if (["unpaid", "paid", "partial", "refunded"].includes(v)) return v;
  return "unpaid";
}

function getProductDisplayName(product: {
  subGroupName?: string | null;
  productName?: string | null;
}) {
  const group = String(product?.subGroupName || "").trim();
  const variant = String(product?.productName || "").trim();
  if (group && variant && group.toLowerCase() !== variant.toLowerCase()) {
    return `${group} (${variant})`;
  }
  return group || variant || "N/A";
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdRaw = searchParams.get("userId") || "1";
    const status = String(searchParams.get("status") || "all").toLowerCase();
    const search = String(searchParams.get("search") || "").trim().toLowerCase();

    const userId = BigInt(userIdRaw);

    const orders = await prisma.orders.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            productCode: true,
            productName: true,
            subGroupName: true,
            pImage: true,
          },
        },
        paymentDetails: {
          orderBy: { paymentDetailsId: "desc" },
          take: 1,
          select: {
            paymentMode: true,
            transactionId: true,
            paymentStatus: true,
            paymentAmount: true,
            paymentDate: true,
          },
        },
        shippingDetails: {
          orderBy: { shippingDetailsId: "desc" },
          take: 1,
          select: {
            shippingStatus: true,
            shippingDate: true,
            shippingRemark: true,
            shippingCourier: true,
            trackingNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = orders.map((order) => {
      const orderStatus = normalizeOrderStatus(order.orderStatus);
      const payment = order.paymentDetails?.[0] || null;
      const shipping = order.shippingDetails?.[0] || null;
      return {
        id: order.orderId.toString(),
        orderNumber: `NG-${order.orderId.toString()}`,
        orderStatus,
        paymentStatus: normalizePaymentStatus(order.paymentStatus),
        totalAmount: Number(order.totalAmount || 0),
        createdAt: order.createdAt,
        paymentMethod: payment?.paymentMode || "COD",
        transactionId: payment?.transactionId || "",
        shipping: {
          status: shipping?.shippingStatus || "PENDING",
          shippingDate: shipping?.shippingDate || null,
          remark: shipping?.shippingRemark || "",
          courier: shipping?.shippingCourier || "",
          trackingNumber: shipping?.trackingNumber || "",
        },
        items: [
          {
            id: `${order.orderId}-1`,
            productCode: order.product?.productCode || "",
            name: getProductDisplayName(order.product || {}),
            image: order.product?.pImage || "/products/mustard-oil.png",
            qty: 1,
            unitPrice: Number(order.totalAmount || 0),
            subtotal: Number(order.totalAmount || 0),
          },
        ],
      };
    });

    const filtered = mapped.filter((order) => {
      if (status !== "all" && order.orderStatus !== status) return false;

      if (search) {
        const hay = [
          order.orderNumber,
          order.items[0]?.name,
          order.items[0]?.productCode,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(search)) return false;
      }

      return true;
    });

    return NextResponse.json(
      {
        success: true,
        data: filtered,
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch orders",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
