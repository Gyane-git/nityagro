import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const norm = (value: unknown) => String(value || "").trim().toLowerCase();

function parseAddress(value: string | null) {
  if (!value) return {};
  try {
    return JSON.parse(value);
  } catch {
    return { cityName: value };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const address = body?.address || {};
    const city = norm(address.city || address.cityName);
    const district = norm(address.district || address.districtName);
    const province = norm(address.region || address.province || address.provinceName);

    if (!city) {
      return NextResponse.json(
        { success: false, message: "City is required", data: { deliveryCharge: 0 } },
        { status: 400 },
      );
    }

    const rows = await prisma.setShippingCost.findMany({
      where: { shippingMethod: "CITY" },
      orderBy: { updatedAt: "desc" },
    });

    const matched = rows.find((row) => {
      const location = parseAddress(row.shippingAdress);
      const cityMatches = norm(location.cityName) === city;
      const districtMatches = !district || norm(location.districtName) === district;
      const provinceMatches = !province || norm(location.provinceName) === province;
      return cityMatches && districtMatches && provinceMatches;
    });

    return NextResponse.json({
      success: true,
      data: {
        deliveryCharge: matched ? Number(matched.shippingCost || 0) : 0,
        matched: Boolean(matched),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to calculate shipping charge",
        data: { deliveryCharge: 0 },
      },
      { status: 500 },
    );
  }
}
