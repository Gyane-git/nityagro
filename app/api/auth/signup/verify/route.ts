import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthOtp } from "@/lib/authOtp";
import { hashPassword } from "@/lib/password";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const otp = String(body?.otp || "").trim();

    if (name.length < 2) {
      return NextResponse.json(
        { success: false, message: "Full name is required" },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "Valid email is required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: "Valid 6-digit OTP is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.users.findUnique({
      where: { email },
      select: { userId: true },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 },
      );
    }

    const verified = await verifyAuthOtp(email, "VERIFY_EMAIL", otp);
    if (!verified) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 },
      );
    }

    const user = await prisma.users.create({
      data: {
        email,
        name,
        password: hashPassword(password),
        role: "customer",
        status: true,
        rolePermission: null,
      },
      select: {
        userId: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    const safeData = JSON.parse(
      JSON.stringify(user, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    return NextResponse.json(
      {
        success: true,
        message: "Account verified and created successfully. Please login.",
        data: safeData,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup OTP verify failed:", error);
    return NextResponse.json(
      { success: false, message: "Signup verification failed" },
      { status: 500 },
    );
  }
}
