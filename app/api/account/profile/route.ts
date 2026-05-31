import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{7,15}$/;
const onlyDigits = (value: unknown) => String(value || "").replace(/\D/g, "");

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const auth = await requireAuth();
    const userId = BigInt(auth.sub);

    const user = await prisma.users.findUnique({
      where: { userId },
      select: {
        userId: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...user,
          userId: user.userId.toString(),
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to load profile" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await requireAuth();
    const body = await req.json();
    const userId = BigInt(auth.sub);

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const phone = onlyDigits(body?.phone);
    const city = String(body?.city || "").trim();
    const state = String(body?.state || "").trim();
    const zipCode = String(body?.zipCode || "").trim();
    const country = String(body?.country || "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, message: "Name must be at least 2 characters" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (phone && !PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Phone number must contain 7 to 15 digits only" },
        { status: 400, headers: corsHeaders },
      );
    }

    const duplicate = await prisma.users.findFirst({
      where: {
        email,
        NOT: { userId },
      },
      select: { userId: true },
    });

    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "Email already used by another account" },
        { status: 409, headers: corsHeaders },
      );
    }

    const updated = await prisma.users.update({
      where: { userId },
      data: {
        name,
        email,
        phone: phone || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        country: country || null,
      },
      select: {
        userId: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: {
          ...updated,
          userId: updated.userId.toString(),
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to update profile" },
      { status: 500, headers: corsHeaders },
    );
  }
}
