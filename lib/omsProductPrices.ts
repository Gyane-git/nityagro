const DEFAULT_OMS_PRODUCT_LIST_URL =
  "http://bkgroupapi.globaltech.com.np:802/api/MasterList/ProductListCustomer?DbName=NITYAM8201";

type OmsProductPrice = {
  actualPrice?: number;
  sellingPrice?: number;
};

let priceCache:
  | {
      expiresAt: number;
      map: Map<string, OmsProductPrice>;
    }
  | null = null;

function env(key: string, fallback = "") {
  return String(process.env[key] ?? fallback).trim().replace(/^['"]|['"]$/g, "");
}

function readString(...values: unknown[]) {
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (text) return text;
  }
  return "";
}

function readPositiveNumber(...values: unknown[]) {
  for (const value of values) {
    const parsed = Number(value ?? "");
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return undefined;
}

function extractRows(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  const record = payload as Record<string, unknown>;
  if (Array.isArray(record?.data)) return record.data;
  if (Array.isArray(record?.Data)) return record.Data;
  if (Array.isArray(record?.result)) return record.result;
  return [];
}

async function fetchOmsProductPriceMap() {
  if (priceCache && priceCache.expiresAt > Date.now()) {
    return priceCache.map;
  }

  const response = await fetch(env("OMS_PRODUCT_LIST_URL", DEFAULT_OMS_PRODUCT_LIST_URL), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`OMS product price fetch failed with status ${response.status}`);
  }

  const payload = await response.json().catch(() => null);
  const rows = extractRows(payload);
  const map = new Map<string, OmsProductPrice>();

  for (const row of rows) {
    const item = row as Record<string, unknown>;
    const code = readString(
      item.PCode,
      item.pCode,
      item.productCode,
      item.sku,
      item.SKU,
      item.barCode,
    );
    if (!code) continue;

    map.set(code, {
      actualPrice: readPositiveNumber(
        item.TradeRate,
        item.tradeRate,
        item.trade_rate,
        item.BuyRate,
        item.buyRate,
      ),
      sellingPrice: readPositiveNumber(
        item.MRP,
        item.mrp,
        item.SalesRate,
        item.salesRate,
        item.price,
      ),
    });
  }

  priceCache = {
    expiresAt: Date.now() + 60_000,
    map,
  };

  return map;
}

export async function fetchOmsProductPrices(productCodes: Array<string | null | undefined>) {
  const codes = Array.from(
    new Set(productCodes.map((code) => String(code || "").trim()).filter(Boolean)),
  );
  if (!codes.length) return new Map<string, OmsProductPrice>();

  const allPrices = await fetchOmsProductPriceMap();
  return new Map(
    codes
      .map((code) => {
        const price = allPrices.get(code);
        return price ? ([code, price] as const) : null;
      })
      .filter(Boolean) as Array<readonly [string, OmsProductPrice]>,
  );
}

export function applyOmsPriceOverlay<T extends { productCode: string; actualPrice: number; sellingPrice: number }>(
  product: T,
  price?: OmsProductPrice,
): T {
  if (!price) return product;

  const currentActual = Number(product.actualPrice || 0);
  const currentSelling = Number(product.sellingPrice || 0);

  return {
    ...product,
    actualPrice: price.actualPrice && price.actualPrice > 0 ? price.actualPrice : currentActual,
    sellingPrice: price.sellingPrice && price.sellingPrice > 0 ? price.sellingPrice : currentSelling,
  };
}
