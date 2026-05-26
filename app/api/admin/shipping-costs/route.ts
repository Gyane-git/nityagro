import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type LocationPayload = {
  provinceId?: string | number;
  provinceName?: string;
  districtId?: string | number;
  districtName?: string;
  cityId?: string | number;
  cityName?: string;
};

const normalize = (value: unknown) => String(value || "").trim();

function parseAddress(value: string | null): LocationPayload {
  if (!value) return {};
  try {
    return JSON.parse(value);
  } catch {
    return { cityName: value };
  }
}

function serialize(row: {
  setShippingCostId: bigint;
  shippingAdress: string | null;
  shippingCost: number;
  createdAt: Date;
  updatedAt: Date;
}) {
  const location = parseAddress(row.shippingAdress);
  return {
    id: row.setShippingCostId.toString(),
    ...location,
    shippingCost: row.shippingCost,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const rows = await prisma.setShippingCost.findMany({
      where: { shippingMethod: "CITY" },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(
      { success: true, data: rows.map(serialize) },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch shipping costs",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const provinceId = normalize(body?.provinceId);
    const provinceName = normalize(body?.provinceName);
    const districtId = normalize(body?.districtId);
    const districtName = normalize(body?.districtName);
    const cityId = normalize(body?.cityId);
    const cityName = normalize(body?.cityName);
    const shippingCost = Number(body?.shippingCost);

    if (!provinceId || !provinceName || !districtId || !districtName || !cityId || !cityName) {
      return NextResponse.json(
        { success: false, message: "Province, district and city are required" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (!Number.isFinite(shippingCost) || shippingCost < 0) {
      return NextResponse.json(
        { success: false, message: "Valid delivery charge is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const shippingAdress = JSON.stringify({
      provinceId,
      provinceName,
      districtId,
      districtName,
      cityId,
      cityName,
    });

    const existing = await prisma.setShippingCost.findMany({
      where: { shippingMethod: "CITY" },
    });
    const matched = existing.find((row) => {
      const location = parseAddress(row.shippingAdress);
      return String(location.cityId || "") === cityId;
    });

    const saved = matched
      ? await prisma.setShippingCost.update({
          where: { setShippingCostId: matched.setShippingCostId },
          data: { shippingAdress, shippingCost },
        })
      : await prisma.setShippingCost.create({
          data: {
            userId: BigInt(1),
            minOrderAmount: 0,
            maxOrderAmount: 0,
            shippingAdress,
            shippingMethod: "CITY",
            shippingCost,
          },
        });

    return NextResponse.json(
      {
        success: true,
        message: matched
          ? "Delivery charge updated successfully"
          : "Delivery charge saved successfully",
        data: serialize(saved),
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to save shipping cost",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const id = Number(body?.id);

    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    await prisma.setShippingCost.delete({
      where: { setShippingCostId: BigInt(id) },
    });

    return NextResponse.json(
      { success: true, message: "Delivery charge deleted successfully" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete shipping cost",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
