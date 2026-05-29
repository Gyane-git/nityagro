import { prisma as defaultPrisma } from "@/lib/prisma";

const DEFAULT_OMS_SAVE_ORDER_URL =
  "http://bkgroupapi.globaltech.com.np:802/api/Order/SaveOrder";

type PrismaLike = typeof defaultPrisma;

type OmsSyncItem = {
  itemCode: string;
  qty: number;
  rate: number;
  totalAmt?: number;
  discountAmount?: number;
  discountRate?: number;
  vatAmount?: number;
  vatRate?: number;
  exciseAmount?: number;
  exciseRate?: number;
};

type OmsSyncArgs = {
  prisma?: PrismaLike;
  orderType: "ORDER" | "COMBO_ORDER" | string;
  localOrderIds: Array<string | number | bigint>;
  items: OmsSyncItem[];
  comment?: string;
};

function isOmsSuccess(response: unknown) {
  if (response == null) return true;
  if (typeof response === "string") {
    const lowered = response.toLowerCase();
    return !lowered.includes("error") && !lowered.includes("fail");
  }

  const data = response as Record<string, unknown>;
  const status = String(data.status || data.Status || data.result || data.Result || "").toLowerCase();
  const success = data.success ?? data.Success ?? data.isSuccess ?? data.IsSuccess;
  const code = String(data.code || data.Code || data.responseCode || data.ResponseCode || "").toLowerCase();
  const message = String(data.message || data.Message || data.error || data.Error || "").toLowerCase();

  if (success === true || success === "true") return true;
  if (["success", "ok", "200", "1", "true"].includes(status)) return true;
  if (["success", "ok", "200", "1", "true"].includes(code)) return true;
  if (success === false || success === "false") return false;
  if (["failed", "fail", "error", "0", "false"].includes(status)) return false;
  if (["failed", "fail", "error", "0", "false"].includes(code)) return false;
  if (message.includes("error") || message.includes("fail")) return false;

  // Some legacy OMS APIs return a plain success object without a standard flag.
  return true;
}

const toAmount = (value: unknown) => {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
};

const toQty = (value: unknown) => {
  const qty = Number(value || 0);
  return Number.isFinite(qty) && qty > 0 ? String(qty) : "1";
};

const toNumberString = (value: unknown, fallback = "0") => {
  const amount = Number(value ?? fallback);
  return Number.isFinite(amount) ? String(amount) : fallback;
};

export function buildOmsOrderPayload(items: OmsSyncItem[], comment = "Website Order") {
  return {
    DbName: process.env.OMS_DB_NAME || "Nityam8201",
    OrderDetails: [
      {
        SalesmanId: process.env.OMS_SALESMAN_ID || "",
        RouteCode: process.env.OMS_ROUTE_CODE || "1",
        OutletCode: process.env.OMS_OUTLET_CODE || "Y000000001",
        OrderBy: process.env.OMS_ORDER_BY || "1000002",
        Comment: comment,
        Lat: toNumberString(process.env.OMS_LAT, "0"),
        Lng: toNumberString(process.env.OMS_LNG, "0"),
        // This legacy OMS endpoint expects a Unix timestamp in seconds, not an ISO date.
        Timestamp: process.env.OMS_TIMESTAMP || String(Math.floor(Date.now() / 1000)),
        ItemDetails: items.map((item) => {
          const rate = Number(item.rate || 0);
          const qty = Number(item.qty || 1);
          const totalAmt = Number(item.totalAmt ?? rate * qty);

          return {
            ExciseAmount: toAmount(item.exciseAmount),
            DiscountAmount: toAmount(item.discountAmount),
            TotalAmt: toAmount(totalAmt),
            Qty: toQty(qty),
            DiscountRate: toAmount(item.discountRate),
            VatAmount: toAmount(item.vatAmount),
            VatRate: toAmount(item.vatRate),
            ExciseRate: toAmount(item.exciseRate),
            Rate: toAmount(rate),
            ItemCode: String(item.itemCode || "").trim(),
          };
        }),
      },
    ],
  };
}

async function postOmsOrder(payload: ReturnType<typeof buildOmsOrderPayload>) {
  const url = process.env.OMS_SAVE_ORDER_URL || DEFAULT_OMS_SAVE_ORDER_URL;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data: unknown = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      `OMS SaveOrder failed (${response.status}): ${typeof data === "string" ? data : JSON.stringify(data)}`,
    );
  }

  if (!isOmsSuccess(data)) {
    throw new Error(`OMS SaveOrder rejected payload: ${typeof data === "string" ? data : JSON.stringify(data)}`);
  }

  return data;
}

async function tryPostWithRetry(payload: ReturnType<typeof buildOmsOrderPayload>, retries = 1) {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return { response: await postOmsOrder(payload), attempts: attempt + 1 };
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
    }
  }
  throw lastError;
}

export async function syncOmsOrderSafely(args: OmsSyncArgs) {
  const db = args.prisma || defaultPrisma;
  const cleanItems = args.items.filter((item) => String(item.itemCode || "").trim());
  const payload = buildOmsOrderPayload(cleanItems, args.comment || "Website Order");
  const localOrderIds = args.localOrderIds.map((id) => id.toString()).join(",");
  const now = new Date();

  if (cleanItems.length === 0) {
    console.error("OMS order sync skipped: no valid ItemCode", { localOrderIds, items: args.items });
    return await db.omsOrderSyncLog.create({
      data: {
        orderType: String(args.orderType || "ORDER"),
        localOrderIds,
        status: "FAILED",
        attempts: 0,
        payload,
        errorMessage: "OMS sync skipped because no valid ItemCode/pCode was found for order items.",
        lastTriedAt: now,
      },
    });
  }

  try {
    const result = await tryPostWithRetry(payload, 1);
    return await db.omsOrderSyncLog.create({
      data: {
        orderType: String(args.orderType || "ORDER"),
        localOrderIds,
        status: "SUCCESS",
        attempts: result.attempts,
        payload,
        response: result.response as object,
        lastTriedAt: now,
      },
    });
  } catch (error) {
    console.error("OMS order sync failed:", error);
    return await db.omsOrderSyncLog.create({
      data: {
        orderType: String(args.orderType || "ORDER"),
        localOrderIds,
        status: "FAILED",
        attempts: 2,
        payload,
        errorMessage: error instanceof Error ? error.message : "OMS order sync failed",
        lastTriedAt: now,
      },
    });
  }
}

export async function retryOmsOrderSync(id: string | number | bigint, db: PrismaLike = defaultPrisma) {
  const row = await db.omsOrderSyncLog.findUnique({
    where: { omsOrderSyncLogId: BigInt(id) },
  });

  if (!row) throw new Error("OMS sync log not found");

  const now = new Date();
  try {
    const result = await tryPostWithRetry(row.payload as ReturnType<typeof buildOmsOrderPayload>, 1);
    return await db.omsOrderSyncLog.update({
      where: { omsOrderSyncLogId: row.omsOrderSyncLogId },
      data: {
        status: "SUCCESS",
        attempts: row.attempts + result.attempts,
        response: result.response as object,
        errorMessage: null,
        lastTriedAt: now,
      },
    });
  } catch (error) {
    return await db.omsOrderSyncLog.update({
      where: { omsOrderSyncLogId: row.omsOrderSyncLogId },
      data: {
        status: "FAILED",
        attempts: row.attempts + 2,
        errorMessage: error instanceof Error ? error.message : "OMS order sync retry failed",
        lastTriedAt: now,
      },
    });
  }
}
