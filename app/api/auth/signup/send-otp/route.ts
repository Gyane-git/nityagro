import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtpCode, saveAuthOtp } from "@/lib/authOtp";
import { sendAuthCodeMail } from "@/lib/authMailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{7,15}$/;
const NAME_REGEX = /^[A-Za-z\s.'-]{2,80}$/;
const onlyDigits = (value: unknown) => String(value || "").replace(/\D/g, "");
const normalizeName = (value: unknown) =>
  String(value || "").trim().replace(/\s+/g, " ");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = normalizeName(body?.name);
    const phone = onlyDigits(body?.phone);
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!NAME_REGEX.test(name)) {
      return NextResponse.json(
        { success: false, message: "Valid full name is required" },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "Valid email is required" },
        { status: 400 },
      );
    }

    if (!PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Phone number must contain 7 to 15 digits only" },
        { status: 400 },
      );
    }

    if (password.length < 8 || password.length > 72 || !password.trim()) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
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

    const otpCode = generateOtpCode();
    await saveAuthOtp(email, "VERIFY_EMAIL", otpCode);
    await sendAuthCodeMail({
      to: email,
      subject: "Verify your Nityagro account",
      code: otpCode,
      text: `Hello ${name}, use this OTP to verify your Nityagro account.`,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email. Please verify to create account.",
      data: { email },
    });
  } catch (error) {
    console.error("Signup OTP send failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send signup OTP" },
      { status: 500 },
    );
  }
}
