import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import { requireAdminRole } from "@/lib/auth";

// GET all users
export async function GET() {
  try {
    await requireAdminRole();
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const users = await prisma.users.findMany({
    select: {
      userId: true,
      name: true,
      email: true,
      phone: true,
      city: true,
      state: true,
      zipCode: true,
      country: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const safeData = JSON.parse(
    JSON.stringify(users, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );

  return NextResponse.json({ success: true, data: safeData });
}

// CREATE user
export async function POST(req: Request) {
  try {
    await requireAdminRole();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Public signup requires email OTP verification",
      },
      { status: 401 },
    );
  }

  const body = await req.json();

  if (!body?.email || !body?.name || !body?.password) {
    return NextResponse.json(
      {
        success: false,
        message: "name, email and password are required",
      },
      { status: 400 },
    );
  }

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (password.length < 8) {
    return NextResponse.json(
      { success: false, message: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { success: false, message: "Email already registered" },
      { status: 409 },
    );
  }

  const user = await prisma.users.create({
    data: {
      email,
      name: String(body.name || "").trim(),
      password: hashPassword(password),
      role: "customer",
      status: true,
      rolePermission: null,
      phone: body.phone || null,
      city: body.city || null,
      state: body.state || null,
      zipCode: body.zipCode || null,
      country: body.country || null,
    },
  });

  const safeData = JSON.parse(
    JSON.stringify(user, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );

  return NextResponse.json({ success: true, data: safeData }, { status: 201 });
}
