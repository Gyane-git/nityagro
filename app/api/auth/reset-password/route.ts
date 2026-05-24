import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import {
  PASSWORD_RESET_COOKIE,
  verifyPasswordResetSession,
} from "@/lib/passwordResetSession";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!email || password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Email and minimum 8 character password are required" },
        { status: 400 },
      );
    }

    const resetCookie = req.headers
      .get("cookie")
      ?.split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${PASSWORD_RESET_COOKIE}=`))
      ?.split("=")[1];

    if (!verifyPasswordResetSession(resetCookie, email)) {
      return NextResponse.json(
        { success: false, message: "OTP verification is required before password reset" },
        { status: 403 },
      );
    }

    const user = await prisma.users.findUnique({
      where: { email },
      select: { userId: true, status: true },
    });

    if (!user || !user.status) {
      return NextResponse.json(
        { success: false, message: "No active account found with this email" },
        { status: 404 },
      );
    }

    await prisma.users.update({
      where: { userId: user.userId },
      data: {
        password: hashPassword(password),
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
    response.cookies.delete(PASSWORD_RESET_COOKIE);

    return response;
  } catch (error) {
    console.error("Password reset failed:", error);
    return NextResponse.json(
      { success: false, message: "Password reset failed" },
      { status: 500 },
    );
  }
}
