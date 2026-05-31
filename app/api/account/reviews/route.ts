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
    const items = await prisma.productReview.findMany({
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
      },
      orderBy: { createdAt: "desc" },
    });

    const data = items.map((item) => ({
      id: item.productReviewId.toString(),
      productId: item.productId.toString(),
      productName:
        item.product?.subGroupName && item.product?.productName
          ? `${item.product.subGroupName} (${item.product.productName})`
          : item.product?.subGroupName || item.product?.productName || "Product",
      productCode: item.product?.productCode || "",
      image: item.product?.pImage || "/no-image.png",
      rating: Number(item.rating || 0),
      review: item.review || "",
      reviewImage: item.productReviewImage || "",
      status: item.reviewStatus ? "Published" : "Hidden",
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return NextResponse.json(
      { success: true, data },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch reviews";
    return NextResponse.json(
      {
        success: false,
        message: message === "UNAUTHORIZED" ? "Please login to view reviews" : message,
      },
      { status: message === "UNAUTHORIZED" ? 401 : 500, headers: corsHeaders },
    );
  }
}
