import { NextResponse } from "next/server";

const LOCATION_DATA =
  process.env.LOCATION_DATA || "https://devmind-locationdata.vercel.app";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get("district");

    if (!district) {
      return NextResponse.json(
        { success: false, message: "District id is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${LOCATION_DATA}/api/municipalities/en?district=${encodeURIComponent(
        district,
      )}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch municipalities" },
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
          error instanceof Error
            ? error.message
            : "Failed to fetch municipalities",
      },
      { status: 500 },
    );
  }
}
