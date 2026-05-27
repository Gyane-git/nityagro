import { NextResponse } from "next/server";

const OMS_PRODUCT_LIST_URL =
  process.env.OMS_PRODUCT_LIST_URL ||
  "http://bkgroupapi.globaltech.com.np:802/api/MasterList/ProductListCustomer?DbName=NITYAM8201";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const response = await fetch(OMS_PRODUCT_LIST_URL, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    const text = await response.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch OMS data",
          status: response.status,
          data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(
      data || { success: true, data: [] },
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
          error instanceof Error ? error.message : "Failed to fetch OMS data",
      },
      { status: 500 },
    );
  }
}
