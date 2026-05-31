import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

async function fetchComboReturns(userId: bigint) {
  try {
    return await prisma.$queryRaw`
      SELECT
        cor.comboOrderReturnId,
        cor.comboOrderId,
        cor.userId,
        cor.comboProductId,
        cor.comboName,
        cor.comboItems,
        cor.reason,
        cor.returnImage,
        cor.returnStatus,
        cor.createdAt,
        cor.updatedAt,
        co.orderStatus,
        co.paymentStatus,
        co.totalAmount,
        cp.comboCode,
        cp.comboName AS comboProductName,
        (
          SELECT pi.imageUrl
          FROM productImage pi
          WHERE pi.comboProductId = cor.comboProductId
          ORDER BY pi.isMain DESC, pi.createdAt ASC
          LIMIT 1
        ) AS image
      FROM comboOrderReturn cor
      LEFT JOIN comboOrders co ON co.comboOrderId = cor.comboOrderId
      LEFT JOIN comboProduct cp ON cp.comboProductId = cor.comboProductId
      WHERE cor.userId = ${userId}
      ORDER BY cor.createdAt DESC
    `;
  } catch (error) {
    console.warn("Combo return list unavailable", error);
    return [];
  }
}

export async function GET() {
  try {
    const auth = await requireAuth();
    const userId = BigInt(auth.sub);
    const [items, comboItems] = await Promise.all([
      prisma.orderReturn.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              productId: true,
              productCode: true,
              productName: true,
              subGroupName: true,
              pImage: true,
            },
          },
          orders: {
            select: {
              orderId: true,
              orderStatus: true,
              paymentStatus: true,
              totalAmount: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      fetchComboReturns(userId),
    ]);

    const normalData = items.map((item) => ({
      id: item.orderReturnId.toString(),
      orderId: item.orderId.toString(),
      orderNumber: `NG-${item.orderId.toString()}`,
      orderType: "normal",
      productId: item.productId.toString(),
      productName:
        item.product?.subGroupName && item.product?.productName
          ? `${item.product.subGroupName} (${item.product.productName})`
          : item.product?.subGroupName || item.product?.productName || "Product",
      productCode: item.product?.productCode || "",
      image: item.product?.pImage || "/no-image.png",
      reason: item.reason || "",
      returnImage: item.returnImage || "",
      status: item.returnStatus ? "Submitted" : "Closed",
      orderStatus: item.orders?.orderStatus || "",
      paymentStatus: item.orders?.paymentStatus || "",
      totalAmount: Number(item.orders?.totalAmount || 0),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    const comboData = (comboItems as any[]).map((item: any) => {
      return {
        id: `combo-${item.comboOrderReturnId.toString()}`,
        orderId: item.comboOrderId.toString(),
        orderNumber: `NC-${item.comboOrderId.toString()}`,
        orderType: "combo",
        productId: item.comboProductId.toString(),
        productName: item.comboName || item.comboProductName || "Combo Product",
        productCode: item.comboCode || "COMBO",
        image: item.image || "/no-image.png",
        reason: item.reason || "",
        returnImage: item.returnImage || "",
        status: item.returnStatus ? "Submitted" : "Closed",
        orderStatus: item.orderStatus || "",
        paymentStatus: item.paymentStatus || "",
        totalAmount: Number(item.totalAmount || 0),
        comboItems: item.comboItems || "",
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    const data = [...normalData, ...comboData].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
    );

    return NextResponse.json(
      { success: true, data },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch returns";
    return NextResponse.json(
      {
        success: false,
        message: message === "UNAUTHORIZED" ? "Please login to view returns" : message,
      },
      { status: message === "UNAUTHORIZED" ? 401 : 500, headers: corsHeaders },
    );
  }
}
