import { NextResponse } from "next/server";
import { fetchOmsStockRows } from "@/lib/omsStock";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeCode =
      searchParams.get("Storecode") || searchParams.get("storeCode") || undefined;
    const sku = searchParams.get("sku") || searchParams.get("pCode") || "";
    const { rows, raw } = await fetchOmsStockRows({ sku, storeCode });

    return NextResponse.json(
      {
        success: true,
        data: rows,
        raw,
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
            : "Failed to fetch OMS stock data",
      },
      { status: 500 },
    );
  }
}
