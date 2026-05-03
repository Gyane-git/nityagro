import { prisma } from "@/lib/prisma";
import { printTreeView } from "next/dist/build/utils";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ✅ Preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const categories = await prisma.categories.findMany();
    // 🔥 Fix BigInt serialization
    const safeData = JSON.parse(
      JSON.stringify(categories, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
    return Response.json(
      {
        success: true,
        data: safeData,
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { categoryName,
        userId, } =
      body;

    if (!categoryName) {
      return NextResponse.json(
        { success: false, message: "Category description is required" },
        { status: 400 },
      );
    }

    const createdCategory = await prisma.categories.create({
      data: {
        categoryName,
        userId,
      },
    });

    // 🔥 Fix BigInt serialization
    const safeData = JSON.parse(
      JSON.stringify(createdCategory, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    return NextResponse.json(
      { success: true, data: safeData, message: "Category save successful" },
      { headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PUT(req: Request) {
  const body = await req.json();

  const { categoryId, categoryDesc } = body;
  if (!categoryId) {
    return NextResponse.json(
      { success: false, message: "CategoryId  is required" },
      { status: 400 },
    );
  }
  try {
    const category = await prisma.categories.update({
      where: { categoryId: categoryId },
      data: {
        ...(categoryDesc && { categoryDesc: categoryDesc }),
      },
    });

    const safeData = JSON.parse(
      JSON.stringify(category, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: safeData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  /* ---------- DELETE DB ---------- */
  const body = await req.json();
  const { categoryId } = body;
  try {
    await prisma.categories.delete({
      where: { categoryId: categoryId },
    });

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("CATEGORY_DELETE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 },
    );
  }
}
