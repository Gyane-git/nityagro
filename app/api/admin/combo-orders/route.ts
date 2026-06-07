import { prisma } from "@/lib/prisma";
import { resolveComboItems } from "@/lib/comboItems";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function normalizeOrderStatus(value: string | null | undefined) {
  const status = String(value || "").toLowerCase().trim();
  if (!status || status === "placed" || status === "pending") return "processing";
  if (["processing", "shipped", "delivered", "cancelled", "returns"].includes(status)) return status;
  return "processing";
}

function normalizePaymentStatus(value: string | null | undefined) {
  const status = String(value || "").toLowerCase().trim();
  if (!status || status === "pending") return "unpaid";
  if (["unpaid", "paid", "partial", "refunded"].includes(status)) return status;
  return "unpaid";
}

function getMainImage(combo: any) {
  const images = Array.isArray(combo?.productImages) ? combo.productImages : [];
  return images.find((image: any) => image.isMain)?.imageUrl || images[0]?.imageUrl || "/no-image.png";
}

function mapComboOrder(order: any, statusOverride?: string) {
  const combo = order.comboProduct || {};
  const comboItems = Array.isArray(combo.comboItems) ? combo.comboItems : [];
  const productCodes = comboItems.length
    ? comboItems.map((item: any) => item.code)
    : String(combo.productCodes || "").split(",").map((code) => code.trim()).filter(Boolean);
  const orderStatus = normalizeOrderStatus(statusOverride || order.orderStatus);
  const paymentStatus = normalizePaymentStatus(order.paymentStatus);
  const firstComboItem = comboItems[0];
  const comboDisplayName = comboItems.length
    ? comboItems.map((item: any) => item.name).join(", ")
    : combo.comboName || "Combo Product";

  return {
    id: order.comboOrderId.toString(),
    orderNumber: `NC-${order.comboOrderId.toString()}`,
    orderStatus,
    paymentStatus,
    totalAmount: Number(order.totalAmount || 0),
    subtotal: Number(order.productTotal || order.totalAmount || 0),
    shippingCost: Number(order.deliveryCharge || 0),
    tax: 0,
    createdAt: order.createdAt,
    user: {
      fullName: order.users?.name || "N/A",
      email: order.users?.email || "",
      phone: order.users?.phone || "",
    },
    paymentMethod: "COD",
    transactionId: "",
    payments: [{ paymentMode: "COD", transactionId: "", paymentStatus, amount: Number(order.totalAmount || 0), paidAt: null }],
    items: [{ id: `${order.comboOrderId}-combo`, productCode: combo.comboCode || "", quantity: Number(order.quantity || 1), unitPrice: Number(order.unitPrice || combo.comboPrice || 0), subtotal: Number(order.productTotal || order.totalAmount || 0), serialNumber: null, product: { name: comboDisplayName, comboName: combo.comboName || "Combo Product", image: firstComboItem?.image || getMainImage(combo), productCodes, comboItems } }],
    updateLogs: [],
  };
}

async function getComboStatusOverrides(orderIds: bigint[]) {
  if (!orderIds.length) return new Map<string, string>();

  const overrides = new Map<string, string>();
  try {
    const cancellations = await prisma.$queryRaw`
      SELECT comboOrderId
      FROM comboOrderCancellation
      WHERE comboOrderId IN (${Prisma.join(orderIds)})
    `;
    const returns = await prisma.$queryRaw`
      SELECT cor.comboOrderId
      FROM comboOrderReturn cor
      INNER JOIN comboOrders co ON co.comboOrderId = cor.comboOrderId
      WHERE cor.comboOrderId IN (${Prisma.join(orderIds)})
        AND LOWER(COALESCE(co.orderStatus, '')) <> 'shipped'
    `;

    if (Array.isArray(cancellations)) {
      cancellations.forEach((row: any) => {
        overrides.set(String(row.comboOrderId), "cancelled");
      });
    }
    if (Array.isArray(returns)) {
      returns.forEach((row: any) => {
        overrides.set(String(row.comboOrderId), "returns");
      });
    }
  } catch (error) {
    console.warn("Combo request status override unavailable", error);
  }
  return overrides;
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

    const orders = await prisma.comboOrders.findMany({
      include: {
        users: { select: { name: true, email: true, phone: true } },
        comboProduct: { include: { productImages: { orderBy: [{ isMain: "desc" }, { createdAt: "asc" }] } } },
      },
      orderBy: { createdAt: "desc" },
    });

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => ({
        ...order,
        comboProduct: order.comboProduct
          ? {
              ...order.comboProduct,
              comboItems: await resolveComboItems(
                prisma,
                order.comboProduct.productCodes,
              ),
            }
          : order.comboProduct,
      })),
    );

    const statusOverrides = await getComboStatusOverrides(
      ordersWithItems.map((order) => order.comboOrderId),
    );
    const mapped = ordersWithItems.map((order) =>
      mapComboOrder(order, statusOverrides.get(String(order.comboOrderId))),
    );
    const filtered = mapped.filter((row) => {
      if (status !== "all" && row.orderStatus !== status) return false;
      if (search) {
        const hay = [row.orderNumber, row.id, row.user.fullName, row.user.email, row.items[0]?.product?.name, row.items[0]?.productCode].join(" ").toLowerCase();
        if (!hay.includes(search)) return false;
      }
      if (dateFrom && new Date(row.createdAt) < new Date(`${dateFrom}T00:00:00`)) return false;
      if (dateTo && new Date(row.createdAt) > new Date(`${dateTo}T23:59:59.999`)) return false;
      return true;
    });

    const statusCounts = filtered.reduce((acc, row) => {
      acc.all += 1;
      if (acc[row.orderStatus] !== undefined) acc[row.orderStatus] += 1;
      return acc;
    }, { all: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0, returns: 0 } as Record<string, number>);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;

    return NextResponse.json({ success: true, data: filtered.slice(start, start + limit), meta: { page: safePage, totalPages, total, statusCounts } }, { status: 200, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch combo orders" }, { status: 500, headers: corsHeaders });
  }
}
