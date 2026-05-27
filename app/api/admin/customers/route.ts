import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const serialize = (data: unknown) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));
    const search = String(searchParams.get("search") || "").trim();
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : {};

    const [total, users] = await prisma.$transaction([
      prisma.users.count({ where }),
      prisma.users.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              address: true,
              orders: true,
            },
          },
        },
      }),
    ]);

    const data = users.map((user) => ({
      id: user.userId.toString(),
      userId: user.userId.toString(),
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      createdAt: user.createdAt,
      orderCount: user._count.orders,
      _count: {
        addresses: user._count.address,
      },
    }));

    return NextResponse.json({
      success: true,
      data: serialize(data),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch customers",
      },
      { status: 500 },
    );
  }
}
