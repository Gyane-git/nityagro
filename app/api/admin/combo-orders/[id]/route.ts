import { prisma } from "@/lib/prisma";
import { resolveComboItems } from "@/lib/comboItems";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function normalizeOrderStatus(value: string | null | undefined) {
  const status = String(value || "").toLowerCase().trim();
  if (!status || status === "placed" || status === "pending") return "processing";
  return status;
}

function normalizePaymentStatus(value: string | null | undefined) {
  const status = String(value || "").toLowerCase().trim();
  if (!status || status === "pending") return "unpaid";
  return status;
}

function getMainImage(combo: any) {
  const images = Array.isArray(combo?.productImages) ? combo.productImages : [];
  return images.find((image: any) => image.isMain)?.imageUrl || images[0]?.imageUrl || "/no-image.png";
}

function mapComboOrder(order: any, statusOverride?: string) {
  const combo = order.comboProduct || {};
  const comboItems = Array.isArray(combo.comboItems) ? combo.comboItems : [];
  const paymentStatus = normalizePaymentStatus(order.paymentStatus);
  const comboDisplayName = comboItems.length
    ? comboItems.map((item: any) => item.name).join(", ")
    : combo.comboName || "Combo Product";
  return {
    id: order.comboOrderId.toString(),
    orderNumber: `NC-${order.comboOrderId.toString()}`,
    orderStatus: normalizeOrderStatus(statusOverride || order.orderStatus),
    paymentStatus,
    totalAmount: Number(order.totalAmount || 0),
    subtotal: Number(order.productTotal || order.totalAmount || 0),
    shippingCost: Number(order.deliveryCharge || 0),
    tax: 0,
    createdAt: order.createdAt,
    user: { fullName: order.users?.name || "N/A", email: order.users?.email || "", phone: order.users?.phone || "" },
    paymentMethod: "COD",
    transactionId: "",
    payments: [{ paymentMode: "COD", transactionId: "", paymentStatus, amount: Number(order.totalAmount || 0), paidAt: null }],
    items: [{ id: `${order.comboOrderId}-combo`, productCode: combo.comboCode || "", quantity: Number(order.quantity || 1), unitPrice: Number(order.unitPrice || combo.comboPrice || 0), subtotal: Number(order.productTotal || order.totalAmount || 0), product: { name: comboDisplayName, comboName: combo.comboName || "Combo Product", image: comboItems[0]?.image || getMainImage(combo), comboItems } }],
    updateLogs: [],
    availableSerialNumbers: [],
    serialSelectionRequired: false,
  };
}

async function getComboStatusOverride(comboOrderId: bigint) {
  try {
    const cancellations = await prisma.$queryRaw`
      SELECT comboOrderId
      FROM comboOrderCancellation
      WHERE comboOrderId = ${comboOrderId}
      LIMIT 1
    `;
    if (Array.isArray(cancellations) && cancellations.length) {
      return "cancelled";
    }

    const returns = await prisma.$queryRaw`
      SELECT cor.comboOrderId
      FROM comboOrderReturn cor
      INNER JOIN comboOrders co ON co.comboOrderId = cor.comboOrderId
      WHERE cor.comboOrderId = ${comboOrderId}
        AND LOWER(COALESCE(co.orderStatus, '')) <> 'shipped'
      LIMIT 1
    `;
    if (Array.isArray(returns) && returns.length) {
      return "returns";
    }
  } catch (error) {
    console.warn("Combo order status override unavailable", error);
  }
  return undefined;
}

async function getComboOrder(id: string) {
  const order = await prisma.comboOrders.findUnique({
    where: { comboOrderId: BigInt(id) },
    include: { users: { select: { name: true, email: true, phone: true } }, comboProduct: { include: { productImages: { orderBy: [{ isMain: "desc" }, { createdAt: "asc" }] } } } },
  });
  if (!order?.comboProduct) return order;
  return {
    ...order,
    comboProduct: {
      ...order.comboProduct,
      comboItems: await resolveComboItems(prisma, order.comboProduct.productCodes),
    },
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await getComboOrder(id);
    if (!order) return NextResponse.json({ success: false, message: "Combo order not found" }, { status: 404, headers: corsHeaders });
    const override = await getComboStatusOverride(BigInt(id));
    return NextResponse.json({ success: true, data: mapComboOrder(order, override) }, { status: 200, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to load combo order" }, { status: 500, headers: corsHeaders });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data: { orderStatus?: string; paymentStatus?: string } = {};
    if (body?.orderStatus) data.orderStatus = String(body.orderStatus).toUpperCase();
    if (body?.paymentStatus) data.paymentStatus = String(body.paymentStatus).toUpperCase();
    await prisma.comboOrders.update({ where: { comboOrderId: BigInt(id) }, data });
    const updated = await getComboOrder(id);
    const override = await getComboStatusOverride(BigInt(id));
    return NextResponse.json({ success: true, message: "Combo order updated successfully", data: mapComboOrder(updated, override) }, { status: 200, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to update combo order" }, { status: 500, headers: corsHeaders });
  }
}
