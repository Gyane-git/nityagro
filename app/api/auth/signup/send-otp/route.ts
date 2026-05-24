import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtpCode, saveAuthOtp } from "@/lib/authOtp";
import { sendAuthCodeMail } from "@/lib/authMailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s-]{7,20}$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const phone = String(body?.phone || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

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

    if (!PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Valid phone number is required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
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
