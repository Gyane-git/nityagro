import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid category id " + id },
        { status: 400 },
      );
    }

    const category = await prisma.products.findUnique({
      where: { productCode: id },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
       {
        status: 404,
        headers: corsHeaders,
      },
      );
    }

    const safeData = JSON.parse(
      JSON.stringify(category, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    return NextResponse.json({
      success: true,
      data: safeData,
    },{
        status: 200,
        headers: corsHeaders,
      },);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
     {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}

