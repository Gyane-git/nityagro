import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { resolveComboItems, restoreComboItemsStock } from "@/lib/comboItems";
import { cancelOmsOrderSafely } from "@/lib/omsOrderSync";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const CANCELLABLE_STATUSES = new Set(["processing", "pending", "placed"]);
const MAX_COMBO_ITEMS_LENGTH = 190;

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

function buildComboItemsSummary(items: any[]) {
  const summary = (Array.isArray(items) ? items : [])
    .map((item) => {
      const code = String(item?.code || item?.pCode || item?.productCode || "").trim();
      const name = String(item?.name || item?.variationName || item?.productName || code).trim();
      return [code, name].filter(Boolean).join(":");
    })
    .filter(Boolean)
    .join(", ");

  if (summary.length <= MAX_COMBO_ITEMS_LENGTH) return summary;
  return `${summary.slice(0, MAX_COMBO_ITEMS_LENGTH - 3)}...`;
}

async function findExistingCancellation(client: any, comboOrderId: bigint, userId: bigint) {
  if (client.comboOrderCancellation?.findFirst) {
    return client.comboOrderCancellation.findFirst({
      where: { comboOrderId, userId },
      select: { comboOrderCancellationId: true },
    });
  }

  const rows = await client.$queryRaw`
    SELECT comboOrderCancellationId
    FROM comboOrderCancellation
    WHERE comboOrderId = ${comboOrderId} AND userId = ${userId}
    LIMIT 1
  `;
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function createCancellation(
  client: any,
  data: {
    comboOrderId: bigint;
    userId: bigint;
    comboProductId: bigint;
    comboName: string | null;
    comboItems: string;
    cancellationReason: string;
  },
) {
  if (client.comboOrderCancellation?.create) {
    return client.comboOrderCancellation.create({
      data: {
        ...data,
        cancellationStatus: true,
      },
    });
  }

  await client.$executeRaw`
    INSERT INTO comboOrderCancellation
      (comboOrderId, userId, comboProductId, comboName, comboItems, cancellationReason, cancellationStatus, createdAt, updatedAt)
    VALUES
      (${data.comboOrderId}, ${data.userId}, ${data.comboProductId}, ${data.comboName}, ${data.comboItems}, ${data.cancellationReason}, true, NOW(3), NOW(3))
  `;
  const rows = await client.$queryRaw`SELECT LAST_INSERT_ID() AS comboOrderCancellationId`;
  return Array.isArray(rows) && rows.length ? rows[0] : { comboOrderCancellationId: 0 };
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    const body = await req.json();
    const comboOrderId = Number(body?.orderId || body?.comboOrderId || 0);
    const reason = String(body?.reason || "").trim();

    if (!Number.isFinite(comboOrderId) || comboOrderId <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid combo order id is required" },
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
    const order = await prisma.comboOrders.findFirst({
      where: { comboOrderId: BigInt(comboOrderId), userId },
      include: {
        comboProduct: {
          select: {
            comboProductId: true,
            comboName: true,
            productCodes: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Combo order not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const status = String(order.orderStatus || "processing").toLowerCase();
    if (!CANCELLABLE_STATUSES.has(status)) {
      return NextResponse.json(
        { success: false, message: "Only processing combo orders can be cancelled" },
        { status: 400, headers: corsHeaders },
      );
    }

    const existing = await findExistingCancellation(prisma, order.comboOrderId, userId);

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Cancellation request already exists for this combo order" },
        { status: 409, headers: corsHeaders },
      );
    }

    const comboItems = await resolveComboItems(prisma, order.comboProduct.productCodes);
    const comboItemsSummary = buildComboItemsSummary(comboItems);
    const qty = Number(order.quantity || 1);

    const result = await prisma.$transaction(async (tx) => {
      const cancellation = await createCancellation(tx, {
        comboOrderId: order.comboOrderId,
        userId,
        comboProductId: order.comboProductId,
        comboName: order.comboProduct.comboName,
        comboItems: comboItemsSummary,
        cancellationReason: reason,
      });

      await restoreComboItemsStock(tx, comboItems, qty);

      const updatedOrder = await tx.comboOrders.update({
        where: { comboOrderId: order.comboOrderId },
        data: { orderStatus: "cancelled" },
      });

      return { cancellation, updatedOrder };
    });

    const omsCancelLog = await cancelOmsOrderSafely({
      prisma,
      localOrderId: order.comboOrderId,
      reason,
      sourceOrderType: "COMBO_ORDER",
    }).catch((error) => {
      console.error("OMS combo cancellation log failed:", error);
      return null;
    });

    return NextResponse.json(
      {
        success: true,
        message:
          omsCancelLog?.status === "SUCCESS"
            ? "Combo cancellation request submitted successfully"
            : "Combo cancellation saved locally. OMS cancellation will need retry from admin.",
        data: {
          id: result.cancellation.comboOrderCancellationId.toString(),
          orderStatus: result.updatedOrder.orderStatus,
          omsCancelStatus: omsCancelLog?.status || "FAILED",
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to cancel combo order";
    return NextResponse.json(
      {
        success: false,
        message: message === "UNAUTHORIZED" ? "Please login to cancel combo order" : message,
      },
      { status: message === "UNAUTHORIZED" ? 401 : 500, headers: corsHeaders },
    );
  }
}
