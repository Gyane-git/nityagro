import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const auth = await requireAuth();
    const user = await prisma.users.findUnique({
      where: { userId: BigInt(auth.sub) },
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
      },
    });

    if (!user || !user.status) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        userId: user.userId.toString(),
        type: auth.type,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }
}
