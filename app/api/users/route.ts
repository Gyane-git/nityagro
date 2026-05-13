import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all users
export async function GET() {
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

  const user = await prisma.users.create({
    data: {
      email: body.email,
      name: body.name,
      password: body.password,
      role: body.role || "customer",
      status: typeof body.status === "boolean" ? body.status : true,
      rolePermission: body.rolePermission || null,
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
