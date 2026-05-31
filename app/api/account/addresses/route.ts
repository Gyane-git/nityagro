import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const PHONE_REGEX = /^\d{7,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_REGEX = /^[A-Za-z0-9 -]{3,12}$/;
const onlyDigits = (value: unknown) => String(value || "").replace(/\D/g, "");
const normalizeText = (value: unknown) =>
  String(value || "").trim().replace(/\s+/g, " ");

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

function parsePayload(body: Record<string, unknown>, userId: bigint) {
  const fullName = normalizeText(body?.fullName);
  const phone = onlyDigits(body?.phone);
  const email = String(body?.email || "").trim().toLowerCase();
  const region = normalizeText(body?.region);
  const city = normalizeText(body?.city);
  const district = normalizeText(body?.district || city);
  const area = normalizeText(body?.area);
  const colony = normalizeText(body?.colony);
  const addType = normalizeText(body?.addType || body?.label || "Home");
  const zipCode = String(body?.zipCode || "").trim();

  if (!fullName || fullName.length < 2) {
    throw new Error("Full name must be at least 2 characters");
  }
  if (!PHONE_REGEX.test(phone)) {
    throw new Error("Phone number must contain 7 to 15 digits only");
  }
  if (email && !EMAIL_REGEX.test(email)) {
    throw new Error("Valid email is required");
  }
  if (!region) {
    throw new Error("Province is required");
  }
  if (!district) {
    throw new Error("District is required");
  }
  if (!city) {
    throw new Error("City is required");
  }
  if (!colony) {
    throw new Error("Ward is required");
  }
  if (zipCode && !ZIP_REGEX.test(zipCode)) {
    throw new Error("Valid zip code is required");
  }
  if (!["home", "office"].includes(addType.toLowerCase())) {
    throw new Error("Address type must be Home or Office");
  }

  return {
    userId,
    fullName,
    phone,
    email: email || null,
    province: region,
    district,
    city,
    ward: colony,
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
    const auth = await requireAuth();
    const userId = BigInt(auth.sub);

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
    const auth = await requireAuth();
    const body = (await req.json()) as Record<string, unknown>;
    const payload = parsePayload(body, BigInt(auth.sub));

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
    const auth = await requireAuth();
    const body = (await req.json()) as Record<string, unknown>;
    const addressId = Number(body?.id);

    if (!Number.isFinite(addressId) || addressId <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid address id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const userId = BigInt(auth.sub);
    const existing = await prisma.address.findFirst({
      where: { addressId: BigInt(addressId), userId },
      select: { addressId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const payload = parsePayload(body, userId);
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
    const auth = await requireAuth();
    const body = (await req.json()) as Record<string, unknown>;
    const addressId = Number(body?.id);

    if (!Number.isFinite(addressId) || addressId <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid address id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const deleted = await prisma.address.deleteMany({
      where: {
        addressId: BigInt(addressId),
        userId: BigInt(auth.sub),
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404, headers: corsHeaders },
      );
    }

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
