import { prisma } from "@/lib/prisma";
import type { PrismaClient } from "@prisma/client";

const DEFAULT_OMS_STOCK_URL =
  "http://nityamecomapi.globaltech.com.np/api/v1/full-reset";
const DEFAULT_OMS_TOKEN_URL = "http://nityamecomapi.globaltech.com.np/token";
const DEFAULT_STORE_CODE = "NITYAM8201";
let stockTokenCache: { token: string; tokenType: string; expiresAt: number } | null =
  null;

type StockRow = {
  PCode?: unknown;
  pCode?: unknown;
  SKU?: unknown;
  sku?: unknown;
  ItemCode?: unknown;
  itemCode?: unknown;
  barCode?: unknown;
  barcode?: unknown;
  StockQty?: unknown;
  stockQty?: unknown;
  Qty?: unknown;
  qty?: unknown;
  StockQuantity?: unknown;
  stockQuantity?: unknown;
  AvailableQuantity?: unknown;
  availableQuantity?: unknown;
  availableQty?: unknown;
};

export type NormalizedOmsStockRow = StockRow & {
  PCode: string;
  pCode: string;
  StockQty: number;
  stockQuantity: number;
  availableQuantity: number;
};

function readString(...values: unknown[]) {
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (text) return text;
  }
  return "";
}

function readNumber(...values: unknown[]) {
  for (const value of values) {
    const parsed = Number(value ?? "");
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function env(key: string, fallback = "") {
  return String(process.env[key] ?? fallback).trim().replace(/^['\"]|['\"]$/g, "");
}

async function parseJsonResponse(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { raw: text };
  }
}

async function getOmsStockToken() {
  if (stockTokenCache?.token && stockTokenCache.expiresAt > Date.now() + 60_000) {
    return stockTokenCache;
  }

  const url = env("OMS_TOKEN_URL", DEFAULT_OMS_TOKEN_URL);
  const username = env("OMS_USERNAME");
  const password = env("OMS_PASSWORD");
  const grantType = env("OMS_GRANT_TYPE", "password");

  if (!username || !password) {
    throw new Error("OMS stock credentials are missing in environment");
  }

  const body = new URLSearchParams({
    username,
    password,
    grant_type: grantType,
  });

  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      username,
      password,
      grant_type: grantType,
    },
    body,
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(`OMS stock token failed with status ${response.status}`);
  }

  const token = String((data as { access_token?: unknown })?.access_token || "").trim();
  if (!token) {
    throw new Error("OMS stock token response missing access_token");
  }

  const tokenType = String((data as { token_type?: unknown })?.token_type || "bearer")
    .trim()
    .toLowerCase();
  const expiresIn = Number((data as { expires_in?: unknown })?.expires_in || 3600);
  stockTokenCache = {
    token,
    tokenType,
    expiresAt: Date.now() + Math.max(60, expiresIn - 120) * 1000,
  };

  return stockTokenCache;
}

export async function warmOmsStockAuth() {
  const token = await getOmsStockToken();
  return {
    authenticated: true,
    tokenType: token.tokenType,
    expiresAt: token.expiresAt,
  };
}

export function normalizeOmsStockRows(payload: unknown): NormalizedOmsStockRow[] {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { data?: unknown[] })?.data)
      ? (payload as { data: unknown[] }).data
      : Array.isArray((payload as { Data?: unknown[] })?.Data)
        ? (payload as { Data: unknown[] }).Data
        : Array.isArray((payload as { result?: unknown[] })?.result)
          ? (payload as { result: unknown[] }).result
          : [];

  return source
    .map((row) => {
      const stockRow = row as StockRow;
      const pCode = readString(
        stockRow.sku,
        stockRow.SKU,
        stockRow.PCode,
        stockRow.pCode,
        stockRow.ItemCode,
        stockRow.itemCode,
        stockRow.barCode,
        stockRow.barcode,
      );
      const stockQuantity = readNumber(
        stockRow.availableQty,
        stockRow.availableQuantity,
        stockRow.AvailableQuantity,
        stockRow.StockQty,
        stockRow.stockQty,
        stockRow.StockQuantity,
        stockRow.stockQuantity,
        stockRow.Qty,
        stockRow.qty,
      );

      return {
        ...stockRow,
        PCode: pCode,
        pCode,
        StockQty: stockQuantity,
        stockQuantity,
        availableQuantity: stockQuantity,
      };
    })
    .filter((row) => row.pCode);
}

type FetchOmsStockRowsArgs = {
  sku?: string;
  storeCode?: string;
};

function createStockError(status: number, payload: unknown) {
  const detail = JSON.stringify(payload).slice(0, 700);
  return new Error(`OMS stock API failed with status ${status}: ${detail}`);
}

export async function fetchOmsStockRows(args: FetchOmsStockRowsArgs = {}) {
  const upstreamUrl = new URL(env("OMS_STOCK_URL", DEFAULT_OMS_STOCK_URL));
  upstreamUrl.searchParams.set(
    "Storecode",
    args.storeCode || env("OMS_STORE_CODE", DEFAULT_STORE_CODE),
  );

  const cleanSku = String(args.sku || "").trim();
  if (cleanSku) upstreamUrl.searchParams.set("sku", cleanSku);

  const { token, tokenType } = await getOmsStockToken();
  const username = env("OMS_USERNAME");
  const password = env("OMS_PASSWORD");
  const grantType = env("OMS_GRANT_TYPE", "password");
  const authCandidates = Array.from(
    new Set([
      `${tokenType} ${token}`,
      `Bearer ${token}`,
      `bearer ${token}`,
      token,
    ]),
  );

  let payload: unknown = null;
  let lastStatus = 500;

  for (const authorization of authCandidates) {
    const response = await fetch(upstreamUrl.toString(), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: authorization,
        username,
        password,
        grant_type: grantType,
      },
    });

    payload = await parseJsonResponse(response);

    if (response.ok) {
      return {
        rows: normalizeOmsStockRows(payload),
        raw: payload,
      };
    }

    lastStatus = response.status;
    if (![401, 403, 500].includes(response.status)) break;
  }

  throw createStockError(lastStatus, payload);
}

export async function fetchOmsStockMap(productCodes: Array<string | null | undefined>) {
  const uniqueCodes = Array.from(
    new Set(productCodes.map((code) => String(code || "").trim()).filter(Boolean)),
  );
  if (!uniqueCodes.length) return new Map<string, number>();

  const stockEntries = await Promise.all(
    uniqueCodes.map(async (code) => {
      const { rows } = await fetchOmsStockRows({ sku: code });
      const matched = rows.find((row) => row.pCode === code);
      return matched ? ([code, matched.availableQuantity] as const) : null;
    }),
  );

  return new Map(stockEntries.filter(Boolean) as Array<readonly [string, number]>);
}

export async function refreshLocalStockFromOms(
  productCodes: Array<string | null | undefined>,
  db: PrismaClient = prisma,
) {
  const uniqueCodes = Array.from(
    new Set(productCodes.map((code) => String(code || "").trim()).filter(Boolean)),
  );
  if (!uniqueCodes.length) return new Map<string, number>();

  const omsStockByCode = await fetchOmsStockMap(uniqueCodes);
  if (!omsStockByCode.size) return new Map<string, number>();

  const effectiveStockByCode = new Map(
    Array.from(omsStockByCode.entries()).map(([code, qty]) => [
      code,
      Math.max(0, Number(qty || 0)),
    ]),
  );

  await Promise.all(
    Array.from(effectiveStockByCode.entries()).map(([productCode, quantity]) =>
      Promise.all([
        db.products.updateMany({
          where: { productCode },
          data: {
            stockQuantity: BigInt(quantity),
            availableQuantity: BigInt(quantity),
          },
        }),
        db.productVariant.updateMany({
          where: { pCode: productCode },
          data: { stockQuantity: BigInt(quantity) },
        }),
      ]),
    ),
  );

  return effectiveStockByCode;
}
