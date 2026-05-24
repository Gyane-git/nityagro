import { NextResponse } from "next/server";
import { verifyAuthOtp } from "@/lib/authOtp";
import {
  createPasswordResetSession,
  PASSWORD_RESET_COOKIE,
} from "@/lib/passwordResetSession";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const otp = String(body?.otp || "").trim();

    if (!email || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: "Valid email and 6-digit OTP are required" },
        { status: 400 },
      );
    }

    const verified = await verifyAuthOtp(email, "RESET_PASSWORD", otp);
    if (!verified) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });
    response.cookies.set(PASSWORD_RESET_COOKIE, createPasswordResetSession(email), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 10 * 60,
    });

    return response;
  } catch (error) {
    console.error("OTP verification failed:", error);
    return NextResponse.json(
      { success: false, message: "OTP verification failed" },
      { status: 500 },
    );
  }
}
