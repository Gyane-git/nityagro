import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import { requireAdminRole } from "@/lib/auth";
import { serializeAdminPermissions } from "@/lib/adminPermissions";

// GET all users
export async function GET() {
  try {
    await requireAdminRole("SUPER_ADMIN");
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
      rolePermission: true,
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
    await requireAdminRole("SUPER_ADMIN");
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
      role: "ADMIN",
      status: true,
      rolePermission: serializeAdminPermissions(body.permissions),
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

// Update an admin user's status, name, role, or sidebar permissions.
export async function PATCH(req: Request) {
  try {
    await requireAdminRole("SUPER_ADMIN");
  } catch {
    return NextResponse.json({ success: false, message: "Only super admin can manage users" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const userId = BigInt(String(body?.userId || ""));
    const current = await prisma.users.findUnique({ where: { userId }, select: { role: true } });
    if (!current) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const updated = await prisma.users.update({
      where: { userId },
      data: {
        name: body.name == null ? undefined : String(body.name).trim(),
        status: body.status == null ? undefined : Boolean(body.status),
        role: "ADMIN",
        rolePermission: body.permissions == null ? undefined : serializeAdminPermissions(body.permissions),
      },
      select: { userId: true, name: true, email: true, role: true, rolePermission: true, status: true },
    });

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(updated, (_, value) => typeof value === "bigint" ? value.toString() : value)),
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to update user" }, { status: 400 });
  }
}
