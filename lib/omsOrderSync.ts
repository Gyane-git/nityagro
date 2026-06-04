import { prisma as defaultPrisma } from "@/lib/prisma";

const DEFAULT_OMS_TOKEN_URL = "http://nityamecomapi.globaltech.com.np/token";
const DEFAULT_OMS_PLACE_ORDER_URL =
  "http://nityamecomapi.globaltech.com.np/api/v1/placeEcomOrder";
const DEFAULT_OMS_CANCEL_ORDER_URL =
  "http://nityamecomapi.globaltech.com.np/api/v1/CancelOrder";

type PrismaLike = typeof defaultPrisma;

type OmsSyncItem = {
  itemCode: string;
  qty: number;
  rate: number;
  totalAmt?: number;
  discountAmount?: number;
  discountRate?: number;
  dispatchAmount?: number;
  remarks?: string;
};

type OmsCustomer = {
  name?: string | null;
  phone?: string | null;
  memberCode?: string | null;
  userCode?: string | null;
};

type OmsSyncArgs = {
  prisma?: PrismaLike;
  orderType: "ORDER" | "COMBO_ORDER" | string;
  localOrderIds: Array<string | number | bigint>;
  items: OmsSyncItem[];
  comment?: string;
  paymentMode?: string;
  paymentAmount?: number;
  deliveryCharge?: number;
  customer?: OmsCustomer | null;
};

type OmsOrderPayload = ReturnType<typeof buildOmsOrderPayload>;
type OmsCancelPayload = OmsOrderPayload;

let tokenCache: { token: string; expiresAt: number } | null = null;

function env(key: string, fallback = "") {
  return String(process.env[key] ?? fallback).trim().replace(/^['\"]|['\"]$/g, "");
}

function isOmsSuccess(response: unknown) {
  if (response == null) return true;
  if (typeof response === "string") {
    const lowered = response.toLowerCase();
    return !lowered.includes("error") && !lowered.includes("fail");
  }

  const data = response as Record<string, unknown>;
  const status = String(data.status || data.Status || data.result || data.Result || "").toLowerCase();
  const success = data.success ?? data.Success ?? data.isSuccess ?? data.IsSuccess;
  const code = String(data.code || data.Code || data.responseCode || data.ResponseCode || data.status_code || "").toLowerCase();
  const message = String(data.message || data.Message || data.error || data.Error || "").toLowerCase();

  if (success === true || success === "true") return true;
  if (["success", "ok", "200", "1", "true"].includes(status)) return true;
  if (["success", "ok", "200", "1", "true"].includes(code)) return true;
  if (success === false || success === "false") return false;
  if (["failed", "fail", "error", "0", "false"].includes(status)) return false;
  if (["failed", "fail", "error", "0", "false"].includes(code)) return false;
  if (message.includes("error") || message.includes("fail")) return false;

  return true;
}

const moneyString = (value: unknown) => {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? String(Number(amount.toFixed(2))) : "0";
};

const qtyString = (value: unknown) => {
  const qty = Number(value || 0);
  return Number.isFinite(qty) && qty > 0 ? String(qty) : "1";
};

function getPaymentAmount(paymentMode: string, amount: unknown) {
  const mode = paymentMode.toLowerCase();
  if (mode === "cod" || mode === "cash on delivery") return "0";
  return moneyString(amount);
}

function getCashBankName(paymentMode: string) {
  const normalized = paymentMode.toLowerCase();
  if (normalized === "connectips") {
    return env("OMS_CONNECTIPS_CASHBANKNAME", "CONNECTIPS");
  }
  if (normalized === "cod" || normalized === "cash on delivery") {
    return env("OMS_COD_CASHBANKNAME", "COD");
  }
  return paymentMode || env("OMS_COD_CASHBANKNAME", "COD");
}

function getCustomerName(customer?: OmsCustomer | null) {
  return String(customer?.name || env("OMS_DEFAULT_CUSTOMER_NAME", "Ecommerce Party")).trim();
}

function getCustomerPhone(customer?: OmsCustomer | null) {
  return String(customer?.phone || env("OMS_DEFAULT_CUSTOMER_PHONE", "")).trim();
}

function getMemberCode(customer?: OmsCustomer | null) {
  return String(
    customer?.memberCode ||
      customer?.userCode ||
      env("OMS_MEMBER_CODE") ||
      env("OMS_ORDER_BY", "1000002"),
  ).trim();
}

function buildUserDetails(customer?: OmsCustomer | null) {
  const name = getCustomerName(customer);
  const phone = getCustomerPhone(customer);
  const code = String(customer?.userCode || getMemberCode(customer) || env("OMS_USER_CODE", "U001")).trim();

  return {
    userName: name,
    userCode: code,
    phone,
    deliveryTime: new Date().toISOString(),
  };
}

export function buildOmsOrderPayload(
  items: OmsSyncItem[],
  options: {
    comment?: string;
    localOrderIds?: Array<string | number | bigint>;
    paymentMode?: string;
    paymentAmount?: number;
    deliveryCharge?: number;
    customer?: OmsCustomer | null;
  } = {},
) {
  const paymentMode = String(options.paymentMode || "COD").trim() || "COD";
  const localOrderIds = options.localOrderIds?.map((id) => id.toString()).filter(Boolean) || [];
  const orderNumber = localOrderIds.length ? localOrderIds.join("-") : `WEB-${Date.now()}`;
  const customerName = getCustomerName(options.customer);
  const customerPhone = getCustomerPhone(options.customer);
  const memberCode = getMemberCode(options.customer);
  const deliveryCharge = Number(options.deliveryCharge || 0);

  return {
    storeCode: env("OMS_STORE_CODE") || env("OMS_DB_NAME", "NITYAM8201"),
    orderNumber,
    SalesCenter: env("OMS_SALES_CENTER", ""),
    orderId: orderNumber,
    Updated: new Date().toISOString(),
    remarks: options.comment || "Website Order",
    membercode: memberCode,
    membername: customerName,
    membermobile: customerPhone,
    PaymentAmount: getPaymentAmount(paymentMode, options.paymentAmount),
    CustomerName: customerName,
    Cashbankname: getCashBankName(paymentMode),
    Order: items.map((item, index) => {
      const qty = Number(item.qty || 1);
      const unitPrice = Number(item.rate || 0);
      const finalPrice = Number(item.totalAmt ?? unitPrice * qty);
      const dispatchAmount = Number(item.dispatchAmount ?? (index === 0 ? deliveryCharge : 0));

      return {
        sku: String(item.itemCode || "").trim(),
        quantity: qtyString(qty),
        unitPrice: moneyString(unitPrice),
        finalPrice: moneyString(finalPrice),
        remarks: item.remarks || "Website Order",
        DiscountAmount: moneyString(item.discountAmount),
        Discountrate: moneyString(item.discountRate),
        DispatchAmount: moneyString(dispatchAmount),
      };
    }),
    userDetails: buildUserDetails(options.customer),
  };
}

async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { raw: text };
  }
}

async function getOmsToken() {
  if (tokenCache?.token && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }

  const url = env("OMS_TOKEN_URL", DEFAULT_OMS_TOKEN_URL);
  const username = env("OMS_USERNAME", "9802069643");
  const password = env("OMS_PASSWORD", "9802069643");
  const grantType = env("OMS_GRANT_TYPE", "password");
  const body = new URLSearchParams({ username, password, grant_type: grantType });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      username,
      password,
      grant_type: grantType,
    },
    body,
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(`OMS token failed (${response.status}): ${JSON.stringify(data)}`);
  }

  const token = String((data as any)?.access_token || "").trim();
  if (!token) throw new Error(`OMS token response missing access_token: ${JSON.stringify(data)}`);

  const expiresIn = Number((data as any)?.expires_in || 3600);
  tokenCache = {
    token,
    expiresAt: Date.now() + Math.max(60, expiresIn - 120) * 1000,
  };

  return token;
}

async function postOmsOrder(payload: OmsOrderPayload) {
  const url = env("OMS_PLACE_ORDER_URL", DEFAULT_OMS_PLACE_ORDER_URL);
  const token = await getOmsToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(`OMS placeEcomOrder failed (${response.status}): ${JSON.stringify(data)}`);
  }

  if (!isOmsSuccess(data)) {
    throw new Error(`OMS placeEcomOrder rejected payload: ${JSON.stringify(data)}`);
  }

  return data;
}

function getOmsResponseOrderNumber(response: unknown) {
  const data = response as Record<string, unknown> | null | undefined;
  return String(data?.orderNumber || data?.OrderNumber || data?.orderNo || "").trim();
}

function buildOmsCancelPayload(
  originalPayload: OmsOrderPayload,
  omsOrderNumber: string,
  reason?: string,
): OmsCancelPayload {
  return {
    ...originalPayload,
    orderNumber: omsOrderNumber,
    orderId: omsOrderNumber,
    Updated: new Date().toISOString(),
    remarks: reason || "Website order cancelled",
    Order: Array.isArray(originalPayload.Order) ? originalPayload.Order : [],
  };
}

async function postOmsCancelOrder(payload: OmsCancelPayload) {
  const url = env("OMS_CANCEL_ORDER_URL", DEFAULT_OMS_CANCEL_ORDER_URL);
  const token = await getOmsToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(`OMS CancelOrder failed (${response.status}): ${JSON.stringify(data)}`);
  }

  if (!isOmsSuccess(data)) {
    throw new Error(`OMS CancelOrder rejected payload: ${JSON.stringify(data)}`);
  }

  return data;
}

async function tryPostWithRetry(payload: OmsOrderPayload, retries = 1) {
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
  const localOrderIds = args.localOrderIds.map((id) => id.toString()).join(",");
  const payload = buildOmsOrderPayload(cleanItems, {
    comment: args.comment || "Website Order",
    localOrderIds: args.localOrderIds,
    paymentMode: args.paymentMode || "COD",
    paymentAmount: args.paymentAmount || 0,
    deliveryCharge: args.deliveryCharge || 0,
    customer: args.customer,
  });
  const now = new Date();

  if (cleanItems.length === 0) {
    console.error("OMS order sync skipped: no valid sku/pCode", { localOrderIds, items: args.items });
    return await db.omsOrderSyncLog.create({
      data: {
        orderType: String(args.orderType || "ORDER"),
        localOrderIds,
        status: "FAILED",
        attempts: 0,
        payload,
        errorMessage: "OMS sync skipped because no valid sku/pCode was found for order items.",
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
    const result = await tryPostWithRetry(row.payload as OmsOrderPayload, 1);
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

export async function cancelOmsOrderSafely(args: {
  prisma?: PrismaLike;
  localOrderId: string | number | bigint;
  reason?: string;
  sourceOrderType?: "ORDER" | "COMBO_ORDER" | string;
}) {
  const db = args.prisma || defaultPrisma;
  const localOrderId = args.localOrderId.toString();
  const now = new Date();
  const sourceOrderType = String(args.sourceOrderType || "ORDER");
  const cancelOrderType =
    sourceOrderType === "COMBO_ORDER" ? "COMBO_ORDER_CANCEL" : "ORDER_CANCEL";

  const logs = await db.omsOrderSyncLog.findMany({
    where: {
      orderType: sourceOrderType,
      status: "SUCCESS",
      localOrderIds: {
        contains: localOrderId,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const orderLog = logs.find((log) =>
    String(log.localOrderIds || "")
      .split(",")
      .map((id) => id.trim())
      .includes(localOrderId),
  );

  if (!orderLog) {
    return await db.omsOrderSyncLog.create({
      data: {
        orderType: cancelOrderType,
        localOrderIds: localOrderId,
        status: "FAILED",
        attempts: 0,
        payload: {
          localOrderId,
          reason: args.reason || "Website order cancelled",
        },
        errorMessage:
          "OMS cancellation skipped because successful OMS order sync log was not found.",
        lastTriedAt: now,
      },
    });
  }

  const omsOrderNumber = getOmsResponseOrderNumber(orderLog.response);
  if (!omsOrderNumber) {
    return await db.omsOrderSyncLog.create({
      data: {
        orderType: cancelOrderType,
        localOrderIds: localOrderId,
        status: "FAILED",
        attempts: 0,
        payload: orderLog.payload as object,
        errorMessage:
          "OMS cancellation skipped because OMS orderNumber was missing in order sync response.",
        lastTriedAt: now,
      },
    });
  }

  const payload = buildOmsCancelPayload(
    orderLog.payload as OmsOrderPayload,
    omsOrderNumber,
    args.reason,
  );

  try {
    const response = await postOmsCancelOrder(payload);
    return await db.omsOrderSyncLog.create({
      data: {
        orderType: cancelOrderType,
        localOrderIds: localOrderId,
        status: "SUCCESS",
        attempts: 1,
        payload,
        response: response as object,
        lastTriedAt: now,
      },
    });
  } catch (error) {
    console.error("OMS order cancellation failed:", error);
    return await db.omsOrderSyncLog.create({
      data: {
        orderType: cancelOrderType,
        localOrderIds: localOrderId,
        status: "FAILED",
        attempts: 1,
        payload,
        errorMessage:
          error instanceof Error ? error.message : "OMS order cancellation failed",
        lastTriedAt: now,
      },
    });
  }
}
