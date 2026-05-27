import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const serialize = (data: unknown) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = BigInt(id);

    const user = await prisma.users.findUnique({
      where: { userId },
      include: {
        address: { orderBy: { updatedAt: "desc" } },
        orders: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: {
            paymentDetails: { orderBy: { paymentDetailsId: "desc" }, take: 1 },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 },
      );
    }

    const data = {
      id: user.userId.toString(),
      userId: user.userId.toString(),
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      createdAt: user.createdAt,
      addresses: user.address.map((address) => ({
        id: address.addressId.toString(),
        fullName: address.fullName,
        phone: address.phone,
        address: [
          address.locality,
          address.ward,
          address.city,
          address.district,
          address.province,
        ]
          .filter(Boolean)
          .join(", "),
        zone: { zoneName: address.locality || "" },
        city: { city: address.city },
        province: { name: address.province },
      })),
      orders: user.orders.map((order) => {
        const payment = order.paymentDetails?.[0];
        return {
          id: order.orderId.toString(),
          orderNumber: order.orderId.toString(),
          orderStatus: order.orderStatus || "PENDING",
          paymentStatus: payment?.paymentStatus || order.paymentStatus || "PENDING",
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
        };
      }),
    };

    return NextResponse.json({ success: true, data: serialize(data) });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch customer",
      },
      { status: 500 },
    );
  }
}
