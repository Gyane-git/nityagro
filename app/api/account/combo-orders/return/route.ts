import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { resolveComboItems, restoreComboItemsStock } from "@/lib/comboItems";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function daysSince(value: Date) {
  return Math.floor((Date.now() - value.getTime()) / (1000 * 60 * 60 * 24));
}

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

async function findExistingReturn(client: any, comboOrderId: bigint, userId: bigint) {
  if (client.comboOrderReturn?.findFirst) {
    return client.comboOrderReturn.findFirst({
      where: { comboOrderId, userId },
      select: { comboOrderReturnId: true },
    });
  }

  const rows = await client.$queryRaw`
    SELECT comboOrderReturnId
    FROM comboOrderReturn
    WHERE comboOrderId = ${comboOrderId} AND userId = ${userId}
    LIMIT 1
  `;
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function createComboReturn(
  client: any,
  data: {
    comboOrderId: bigint;
    userId: bigint;
    comboProductId: bigint;
    comboName: string | null;
    comboItems: string;
    reason: string;
  },
) {
  if (client.comboOrderReturn?.create) {
    return client.comboOrderReturn.create({
      data: {
        ...data,
        returnStatus: true,
      },
    });
  }

  await client.$executeRaw`
    INSERT INTO comboOrderReturn
      (comboOrderId, userId, comboProductId, comboName, comboItems, reason, returnStatus, createdAt, updatedAt)
    VALUES
      (${data.comboOrderId}, ${data.userId}, ${data.comboProductId}, ${data.comboName}, ${data.comboItems}, ${data.reason}, true, NOW(3), NOW(3))
  `;
  const rows = await client.$queryRaw`SELECT LAST_INSERT_ID() AS comboOrderReturnId`;
  return Array.isArray(rows) && rows.length ? rows[0] : { comboOrderReturnId: 0 };
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
        { success: false, message: "Return reason must be at least 5 characters" },
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

    if (String(order.orderStatus || "").toLowerCase() !== "delivered") {
      return NextResponse.json(
        { success: false, message: "Only delivered combo orders can be returned" },
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

    const existing = await findExistingReturn(prisma, order.comboOrderId, userId);

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Return request already exists for this combo order" },
        { status: 409, headers: corsHeaders },
      );
    }

    const comboItems = await resolveComboItems(prisma, order.comboProduct.productCodes);
    const comboItemsSummary = buildComboItemsSummary(comboItems);
    const qty = Number(order.quantity || 1);

    const result = await prisma.$transaction(async (tx) => {
      const comboReturn = await createComboReturn(tx, {
        comboOrderId: order.comboOrderId,
        userId,
        comboProductId: order.comboProductId,
        comboName: order.comboProduct.comboName,
        comboItems: comboItemsSummary,
        reason,
      });

      await restoreComboItemsStock(tx, comboItems, qty);

      const updatedOrder = await tx.comboOrders.update({
        where: { comboOrderId: order.comboOrderId },
        data: { orderStatus: "returns" },
      });

      return { comboReturn, updatedOrder };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Combo return request submitted successfully",
        data: {
          id: result.comboReturn.comboOrderReturnId.toString(),
          orderStatus: result.updatedOrder.orderStatus,
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit combo return";
    return NextResponse.json(
      {
        success: false,
        message: message === "UNAUTHORIZED" ? "Please login to submit combo return" : message,
      },
      { status: message === "UNAUTHORIZED" ? 401 : 500, headers: corsHeaders },
    );
  }
}
