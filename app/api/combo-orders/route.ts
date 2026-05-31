import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import {
  decrementComboItemsStock,
  getComboAvailability,
  resolveComboItems,
} from "@/lib/comboItems";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const serialize = (data: unknown) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );

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

function mapComboOrder(order: any) {
  const images = Array.isArray(order.comboProduct?.productImages)
    ? order.comboProduct.productImages
    : [];
  const mainImage = images.find((image: any) => image.isMain)?.imageUrl || images[0]?.imageUrl || "/no-image.png";

  const comboItems = Array.isArray(order.comboProduct?.comboItems)
    ? order.comboProduct.comboItems
    : [];

  return {
    id: order.comboOrderId.toString(),
    orderNumber: `NC-${order.comboOrderId.toString()}`,
    comboProductId: order.comboProductId.toString(),
    totalAmount: Number(order.totalAmount || 0),
    subtotal: Number(order.productTotal || order.totalAmount || 0),
    shippingCost: Number(order.deliveryCharge || 0),
    quantity: Number(order.quantity || 1),
    orderStatus: normalizeOrderStatus(order.orderStatus),
    paymentStatus: normalizePaymentStatus(order.paymentStatus),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    combo: {
      id: order.comboProduct?.comboProductId?.toString() || order.comboProductId.toString(),
      name: order.comboProduct?.comboName || "Combo Product",
      code: order.comboProduct?.comboCode || "",
      description: order.comboProduct?.comboDescription || "",
      image: mainImage,
      productCodes: order.comboProduct?.productCodes || "",
      items: comboItems,
      comboPrice: Number(order.comboProduct?.comboPrice || order.totalAmount || 0),
    },
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const auth = await requireAuth();
    const orders = await prisma.comboOrders.findMany({
      where: { userId: BigInt(auth.sub) },
      include: {
        comboProduct: {
          include: {
            productImages: {
              orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
            },
          },
        },
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

    return NextResponse.json(
      { success: true, data: serialize(ordersWithItems.map(mapComboOrder)) },
      { status: 200, headers: corsHeaders },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Please login to view combo orders" },
      { status: 401, headers: corsHeaders },
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    const body = await req.json();
    const comboProductId = Number(body?.comboProductId || body?.id || 0);
    const qty = Math.max(1, Number(body?.qty || 1));

    if (!Number.isFinite(comboProductId) || comboProductId <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid combo product is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const combo = await prisma.comboProduct.findUnique({
      where: { comboProductId: BigInt(comboProductId) },
      include: {
        productImages: {
          orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
        },
      },
    });

    if (!combo || combo.comboStatus === false) {
      return NextResponse.json(
        { success: false, message: "Combo product is not available" },
        { status: 404, headers: corsHeaders },
      );
    }

    const comboItems = await resolveComboItems(prisma, combo.productCodes);
    const availability = getComboAvailability(comboItems, qty);
    if (availability.comboOutOfStock) {
      const itemNames = availability.outOfStockItems
        .map((item: any) => item.name)
        .filter(Boolean)
        .join(", ");
      return NextResponse.json(
        {
          success: false,
          message: itemNames
            ? `Combo is out of stock. Unavailable item(s): ${itemNames}`
            : "Combo is out of stock",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    const totalAmount = Number((Number(combo.comboPrice || 0) * qty).toFixed(2));
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.comboOrders.create({
        data: {
          userId: BigInt(auth.sub),
          comboProductId: combo.comboProductId,
          quantity: BigInt(qty),
          unitPrice: Number(combo.comboPrice || 0),
          productTotal: totalAmount,
          deliveryCharge: 0,
          totalAmount,
          orderStatus: "PLACED",
          paymentStatus: "PENDING",
        },
        include: {
          comboProduct: {
            include: {
              productImages: {
                orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
              },
            },
          },
        },
      });

      await decrementComboItemsStock(tx, comboItems, qty);

      return created;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Combo order placed successfully",
        data: serialize(mapComboOrder({
          ...order,
          comboProduct: {
            ...order.comboProduct,
            comboItems,
          },
        })),
      },
      { status: 201, headers: corsHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (
      message.includes("comboOrders") ||
      message.includes("doesn't exist") ||
      message.includes("does not exist")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Combo orders table is missing. Please run prisma migration before placing combo orders.",
        },
        { status: 500, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: message || "Failed to place combo order",
      },
      { status: 400, headers: corsHeaders },
    );
  }
}
