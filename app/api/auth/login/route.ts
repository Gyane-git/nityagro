import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { hashPassword, isHashedPassword, verifyPassword } from "@/lib/password";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 8;
const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN", "SUPERADMIN"]);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeRole(role: string | null | undefined) {
  return String(role || "customer").trim().toUpperCase();
}

function isAdminRole(role: string | null | undefined) {
  const normalized = normalizeRole(role);
  return ADMIN_ROLES.has(normalized) || normalized.includes("ADMIN");
}

function safeUser(user: {
  userId: bigint;
  name: string;
  email: string;
  role: string;
  status: boolean;
}) {
  const admin = isAdminRole(user.role);

  return {
    userId: user.userId.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    type: admin ? "ADMIN" : "USER",
    redirectTo: admin ? "/admin/dashboard" : "/profile",
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "Valid email is required" },
        { status: 400 },
      );
    }
    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 },
      );
    }

    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        userId: true,
        name: true,
        email: true,
        password: true,
        role: true,
        status: true,
      },
    });

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }

    if (!user.status) {
      return NextResponse.json(
        { success: false, message: "Your account is inactive. Please contact support." },
        { status: 403 },
      );
    }

    if (!isHashedPassword(user.password)) {
      await prisma.users.update({
        where: { userId: user.userId },
        data: { password: hashPassword(password) },
      });
    }

    const admin = isAdminRole(user.role);
    const token = signToken({
      sub: user.userId.toString(),
      role: user.role,
      type: admin ? "ADMIN" : "USER",
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: safeUser(user),
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    if (admin) {
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      });
    } else {
      response.cookies.delete("admin_token");
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      },
      { status: 500 },
    );
  }
}
