import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtpCode, saveAuthOtp } from "@/lib/authOtp";
import { sendAuthCodeMail } from "@/lib/authMailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "Valid email is required" },
        { status: 400 },
      );
    }

    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        userId: true,
        email: true,
        name: true,
        status: true,
      },
    });

    if (!user || !user.status) {
      return NextResponse.json(
        { success: false, message: "No active account found with this email" },
        { status: 404 },
      );
    }

    const otpCode = generateOtpCode();
    await saveAuthOtp(email, "RESET_PASSWORD", otpCode);
    await sendAuthCodeMail({
      to: email,
      subject: "Reset your Nityagro password",
      code: otpCode,
      text: `Hello ${user.name || "there"}, use this OTP to reset your Nityagro password.`,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
      data: { email },
    });
  } catch (error) {
    console.error("Forgot password failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 },
    );
  }
}
