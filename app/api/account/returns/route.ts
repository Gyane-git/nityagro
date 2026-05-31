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

export async function GET() {
  try {
    const auth = await requireAuth();
    const items = await prisma.orderReturn.findMany({
      where: { userId: BigInt(auth.sub) },
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
    });

    const data = items.map((item) => ({
      id: item.orderReturnId.toString(),
      orderId: item.orderId.toString(),
      orderNumber: `NG-${item.orderId.toString()}`,
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
