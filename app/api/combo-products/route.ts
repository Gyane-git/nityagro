import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const serialize = (data: unknown) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const combos = await prisma.comboProduct.findMany({
      orderBy: { createdAt: "desc" },
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
    });

    return NextResponse.json(
      { success: true, data: serialize(combos) },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to fetch combo products" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const comboCode = String(body?.comboCode || "").trim();
    const comboName = String(body?.comboName || "").trim();
    const productId = Number(body?.productId || 0);
    const productCodes = Array.isArray(body?.productCodes)
      ? body.productCodes.map((code: unknown) => String(code || "").trim()).filter(Boolean)
      : String(body?.productCodes || "")
          .split(",")
          .map((code) => code.trim())
          .filter(Boolean);
    const productPrices = Number(body?.productPrices || 0);
    const comboPrice = Number(body?.comboPrice || 0);
    const discount = Number(body?.discount || 0);

    if (!comboCode) {
      return NextResponse.json(
        { success: false, message: "Combo code is required" },
        { status: 400, headers: corsHeaders },
      );
    }
    if (!comboName) {
      return NextResponse.json(
        { success: false, message: "Combo name is required" },
        { status: 400, headers: corsHeaders },
      );
    }
    if (!Number.isFinite(productId) || productId <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid product is required" },
        { status: 400, headers: corsHeaders },
      );
    }
    if (productCodes.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one product variant is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const product = await prisma.products.findUnique({
      where: { productId: BigInt(productId) },
      select: { productId: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Selected product not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const created = await prisma.comboProduct.create({
      data: {
        comboCode,
        comboName,
        productId: BigInt(productId),
        productCodes: productCodes.join(","),
        productPrices,
        comboPrice,
        discount,
        slug: String(body?.slug || "").trim() || null,
        comboDescription: String(body?.comboDescription || "").trim() || null,
        comboStatus:
          typeof body?.comboStatus === "boolean" ? body.comboStatus : true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Combo product created successfully",
        data: serialize(created),
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to create combo product" },
      { status: 500, headers: corsHeaders },
    );
  }
}
