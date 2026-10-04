import { NextResponse } from "next/server";
import { fetchOmsStockMap, fetchOmsStockRows, persistOmsStockRows } from "@/lib/omsStock";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeCode =
      searchParams.get("Storecode") || searchParams.get("storeCode") || undefined;
    const sku = searchParams.get("sku") || searchParams.get("pCode") || "";

    if (sku) {
      const stockMap = await fetchOmsStockMap([sku]);
      const quantity = stockMap.get(String(sku).trim());
      if (quantity !== undefined) {
        const row = {
          PCode: String(sku).trim(),
          pCode: String(sku).trim(),
          availableQty: quantity,
          stockQuantity: quantity,
          StockQty: quantity,
          availableQuantity: quantity,
        };
        await persistOmsStockRows([row]).catch((error) => {
          console.warn("Failed to persist authoritative OMS stock", error);
        });

        return NextResponse.json(
          { success: true, data: [row], raw: row },
          {
            status: 200,
            headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
          },
        );
      }
    }

    const { rows, raw } = await fetchOmsStockRows({ sku, storeCode });
    await persistOmsStockRows(rows).catch((error) => {
      console.warn("Failed to persist OMS stock from stock API", error);
    });

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
