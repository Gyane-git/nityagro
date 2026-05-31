import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    const body = await req.json();
    const orderId = Number(body?.orderId || 0);
    const rating = Number(body?.rating || 0);
    const review = String(body?.review || "").trim();

    if (!Number.isFinite(orderId) || orderId <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid order id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Please select a rating between 1 and 5" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (review.length < 5) {
      return NextResponse.json(
        { success: false, message: "Review must be at least 5 characters" },
        { status: 400, headers: corsHeaders },
      );
    }

    const userId = BigInt(auth.sub);
    const order = await prisma.orders.findFirst({
      where: { orderId: BigInt(orderId), userId },
      select: {
        orderId: true,
        productId: true,
        orderStatus: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    if (String(order.orderStatus || "").toLowerCase() !== "delivered") {
      return NextResponse.json(
        { success: false, message: "Only delivered orders can be reviewed" },
        { status: 400, headers: corsHeaders },
      );
    }

    const existing = await prisma.productReview.findFirst({
      where: {
        productId: order.productId,
        userId,
      },
      select: { productReviewId: true },
    });

    const saved = existing
      ? await prisma.productReview.update({
          where: { productReviewId: existing.productReviewId },
          data: {
            rating: BigInt(rating),
            review,
            reviewStatus: true,
          },
        })
      : await prisma.productReview.create({
          data: {
            productId: order.productId,
            userId,
            rating: BigInt(rating),
            review,
            reviewStatus: true,
          },
        });

    return NextResponse.json(
      {
        success: true,
        message: existing
          ? "Review updated successfully"
          : "Review submitted successfully",
        data: {
          id: saved.productReviewId.toString(),
          productId: saved.productId.toString(),
          rating: saved.rating.toString(),
          review: saved.review,
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit review";
    return NextResponse.json(
      {
        success: false,
        message: message === "UNAUTHORIZED" ? "Please login to submit review" : message,
      },
      { status: message === "UNAUTHORIZED" ? 401 : 500, headers: corsHeaders },
    );
  }
}
