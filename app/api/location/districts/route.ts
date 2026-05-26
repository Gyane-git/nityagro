import { NextResponse } from "next/server";

const LOCATION_DATA =
  process.env.LOCATION_DATA || "https://devmind-locationdata.vercel.app";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const province = searchParams.get("province");

    if (!province) {
      return NextResponse.json(
        { success: false, message: "Province id is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${LOCATION_DATA}/api/districts/en?province=${encodeURIComponent(
        province,
      )}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch districts" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch districts",
      },
      { status: 500 },
    );
  }
}
