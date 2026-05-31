import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function PUT(req: Request) {
  try {
    const auth = await requireAuth();
    const body = await req.json();
    const currentPassword = String(body?.currentPassword || "");
    const newPassword = String(body?.newPassword || "");

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, message: "Current password is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (!newPassword.trim() || newPassword.length < 8 || newPassword.length > 72) {
      return NextResponse.json(
        { success: false, message: "New password must be 8 to 72 characters" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, message: "New password must be different from current password" },
        { status: 400, headers: corsHeaders },
      );
    }

    const userId = BigInt(auth.sub);
    const user = await prisma.users.findUnique({
      where: { userId },
      select: { userId: true, password: true, status: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    if (!user.status) {
      return NextResponse.json(
        { success: false, message: "Your account is inactive. Please contact support." },
        { status: 403, headers: corsHeaders },
      );
    }

    if (!verifyPassword(currentPassword, user.password)) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400, headers: corsHeaders },
      );
    }

    await prisma.users.update({
      where: { userId },
      data: { password: hashPassword(newPassword) },
    });

    return NextResponse.json(
      { success: true, message: "Password changed successfully" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Password change failed";
    return NextResponse.json(
      {
        success: false,
        message: message === "UNAUTHORIZED" ? "Please login to change password" : message,
      },
      { status: message === "UNAUTHORIZED" ? 401 : 500, headers: corsHeaders },
    );
  }
}
