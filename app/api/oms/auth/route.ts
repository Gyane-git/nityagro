import { NextResponse } from "next/server";
import { warmOmsStockAuth } from "@/lib/omsStock";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const auth = await warmOmsStockAuth();

    return NextResponse.json(
      {
        success: true,
        authenticated: auth.authenticated,
        tokenType: auth.tokenType,
        expiresAt: auth.expiresAt,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to authenticate OMS stock API",
      },
      { status: 500 },
    );
  }
}
