import { NextResponse } from "next/server";

const LOCATION_DATA =
  process.env.LOCATION_DATA || "https://devmind-locationdata.vercel.app";

export async function GET() {
  try {
    const response = await fetch(`${LOCATION_DATA}/api/provinces/en`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch provinces" },
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
          error instanceof Error ? error.message : "Failed to fetch provinces",
      },
      { status: 500 },
    );
  }
}
