import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const PHONE_REGEX = /^[+\d\s-]{7,20}$/;

function normalize(row: {
  addressId: bigint;
  userId: bigint;
  fullName: string;
  phone: string;
  email: string | null;
  province: string;
  district: string;
  city: string;
  ward: string;
  addType: string;
  locality: string | null;
  zipCode: string | null;
}) {
  return {
    id: Number(row.addressId),
    userId: row.userId.toString(),
    fullName: row.fullName,
    phone: row.phone,
    email: row.email || "",
    region: row.province,
    district: row.district,
    city: row.city,
    area: row.locality || "",
    building: "",
    colony: row.ward,
    address: [row.locality, row.ward, row.city, row.province].filter(Boolean).join(", "),
    label: row.addType || "Home",
    addType: row.addType || "Home",
    zipCode: row.zipCode || "",
  };
}

function parsePayload(body: Record<string, unknown>) {
  const userId = BigInt(String(body?.userId || "1"));
  const fullName = String(body?.fullName || "").trim();
  const phone = String(body?.phone || "").trim();
  const region = String(body?.region || "").trim();
  const city = String(body?.city || "").trim();
  const district = String(body?.district || city).trim();
  const area = String(body?.area || "").trim();
  const colony = String(body?.colony || "").trim();
  const addType = String(body?.addType || body?.label || "Home").trim();
  const zipCode = String(body?.zipCode || "").trim();

  if (!fullName || fullName.length < 2) {
    throw new Error("Full name must be at least 2 characters");
  }
  if (!phone || !PHONE_REGEX.test(phone)) {
    throw new Error("Valid phone number is required");
  }
  if (!region) {
    throw new Error("Region is required");
  }
  if (!city) {
    throw new Error("City is required");
  }
  if (!district) {
    throw new Error("District is required");
  }

  return {
    userId,
    fullName,
    phone,
    email: String(body?.email || "").trim() || null,
    province: region,
    district,
    city,
    ward: colony || "N/A",
    addType: addType || "Home",
    locality: area || null,
    zipCode: zipCode || null,
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdRaw = searchParams.get("userId") || "1";
    const userId = BigInt(userIdRaw);

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: addresses.map(normalize),
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to fetch addresses" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const payload = parsePayload(body);

    const created = await prisma.address.create({ data: payload });

    return NextResponse.json(
      {
        success: true,
        message: "Address saved successfully",
        data: normalize(created),
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to save address" },
      { status: 400, headers: corsHeaders },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const addressId = Number(body?.id);

    if (!Number.isFinite(addressId) || addressId <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid address id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const payload = parsePayload(body);
    const updated = await prisma.address.update({
      where: { addressId: BigInt(addressId) },
      data: payload,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Address updated successfully",
        data: normalize(updated),
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to update address" },
      { status: 400, headers: corsHeaders },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const addressId = Number(body?.id);

    if (!Number.isFinite(addressId) || addressId <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid address id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    await prisma.address.delete({
      where: { addressId: BigInt(addressId) },
    });

    return NextResponse.json(
      { success: true, message: "Address deleted successfully" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to delete address" },
      { status: 400, headers: corsHeaders },
    );
  }
}
