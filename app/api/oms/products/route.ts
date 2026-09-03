import { NextResponse } from "next/server";

const DEFAULT_OMS_PRODUCT_LIST_URL =
  "http://bkgroupapi.globaltech.com.np:802/api/MasterList/ProductListDivisionwise";
const DEFAULT_OMS_PRODUCT_DB_NAME = "BKGRP08301";
const DEFAULT_OMS_STORE_CODE = "BKGRP08301";
const DEFAULT_OMS_DIVISION_CODE = "1";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function env(key: string, fallback = "") {
  return String(process.env[key] ?? fallback).trim().replace(/^['"]|['"]$/g, "");
}

function getProductDbName() {
  return env(
    "OMS_PRODUCT_DB_NAME",
    env("OMS_PRODUCT_LIST_DB_NAME", DEFAULT_OMS_PRODUCT_DB_NAME),
  );
}

function getStoreCode() {
  return env("OMS_STORE_CODE", env("OMS_DB_NAME", DEFAULT_OMS_STORE_CODE));
}

function getDivisionCode() {
  const value = env("OMS_DIV_CODE", env("OMS_DIVISION_CODE", DEFAULT_OMS_DIVISION_CODE));
  return value.toLowerCase() === "nityagro" ? DEFAULT_OMS_DIVISION_CODE : value;
}

function buildOmsProductListUrl() {
  const configuredUrl = env("OMS_PRODUCT_LIST_URL", DEFAULT_OMS_PRODUCT_LIST_URL);
  const url = new URL(configuredUrl);
  const isDivisionwise = /ProductListDivisionwise/i.test(url.pathname);

  if (isDivisionwise) {
    if (!url.searchParams.has("dbname") && !url.searchParams.has("DbName")) {
      url.searchParams.set("dbname", getProductDbName());
    }
    if (!url.searchParams.has("Div") && !url.searchParams.has("DivCode")) {
      url.searchParams.set("Div", getDivisionCode());
    }
    return url.toString();
  }

  if (!url.searchParams.has("DbName") && !url.searchParams.has("dbname")) {
    url.searchParams.set("DbName", getStoreCode());
  }
  if (!url.searchParams.has("DivCode") && !url.searchParams.has("Div")) {
    url.searchParams.set("DivCode", getDivisionCode());
  }
  return url.toString();
}

function normalizeOmsProductRow(row: unknown) {
  if (!row || typeof row !== "object") return row;
  const item = row as Record<string, unknown>;

  return {
    ...item,
    PCode: item.PCode ?? item.pCode ?? item.sku,
    PDesc: item.PDesc ?? item.product ?? item.ProductName ?? item.productName,
    PShortName: item.PShortName ?? item.Code,
    GroupName: item.GroupName ?? item.GrpDesc,
    GroupCode: item.GroupCode ?? item.GrpCode,
    SubGroupName: item.SubGroupName ?? item.SGrpDesc ?? item.product ?? item.PDesc,
    SubGroupCode: item.SubGroupCode ?? item.SGrpCode,
    MRP: item.MRP ?? item.Mrp ?? item.mrp ?? item.SalesRate,
    TradeRate: item.TradeRate ?? item.Rate ?? item.BuyRate,
  };
}

function normalizeOmsProductPayload(payload: unknown) {
  const normalizeRows = (rows: unknown[]) => rows.map(normalizeOmsProductRow);

  if (Array.isArray(payload)) return normalizeRows(payload);
  if (!payload || typeof payload !== "object") return payload;

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.data)) {
    return { ...record, data: normalizeRows(record.data) };
  }
  if (Array.isArray(record.Data)) {
    return { ...record, Data: normalizeRows(record.Data) };
  }
  if (Array.isArray(record.result)) {
    return { ...record, result: normalizeRows(record.result) };
  }

  return payload;
}

export async function GET() {
  try {
    const response = await fetch(buildOmsProductListUrl(), {
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
      normalizeOmsProductPayload(data || { success: true, data: [] }),
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
