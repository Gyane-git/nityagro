import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
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
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || "20")));
    const status = String(searchParams.get("status") || "all").toLowerCase();
    const search = String(searchParams.get("search") || "").trim().toLowerCase();
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const orders = await prisma.orders.findMany({
      include: {
        users: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        product: {
          select: {
            productId: true,
            productCode: true,
            productName: true,
            subGroupName: true,
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
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = orders.map((order) => {
      const orderStatus = normalizeOrderStatus(order.orderStatus);
      const paymentStatus = normalizePaymentStatus(order.paymentStatus);
      const productName = getProductDisplayName(order.product || {});
      const payment = order.paymentDetails?.[0] || null;
      return {
        id: order.orderId.toString(),
        orderNumber: `NG-${order.orderId.toString()}`,
        orderStatus,
        paymentStatus,
        totalAmount: Number(order.totalAmount || 0),
        subtotal: Number(order.totalAmount || 0),
        shippingCost: 0,
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
            quantity: Number(order.quantity || 1),
            subtotal: Number(order.totalAmount || 0),
            serialNumber: null,
            product: {
              name: productName,
            },
          },
        ],
        updateLogs: [],
      };
    });

    const filtered = mapped.filter((row) => {
      if (status !== "all" && row.orderStatus !== status) return false;

      if (search) {
        const hay = [
          row.orderNumber,
          row.id,
          row.user.fullName,
          row.user.email,
          row.items[0]?.product?.name,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(search)) return false;
      }

      if (dateFrom) {
        const from = new Date(`${dateFrom}T00:00:00`);
        if (new Date(row.createdAt) < from) return false;
      }

      if (dateTo) {
        const to = new Date(`${dateTo}T23:59:59.999`);
        if (new Date(row.createdAt) > to) return false;
      }

      return true;
    });

    const statusCounts = filtered.reduce(
      (acc, row) => {
        acc.all += 1;
        if (acc[row.orderStatus] !== undefined) acc[row.orderStatus] += 1;
        return acc;
      },
      {
        all: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        returns: 0,
      } as Record<string, number>,
    );

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return NextResponse.json(
      {
        success: true,
        data,
        meta: {
          page: safePage,
          totalPages,
          total,
          statusCounts,
        },
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
