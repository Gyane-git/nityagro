import { NextResponse } from "next/server";
import { generateConnectIPSToken } from "@/lib/connectipsToken";
import { logConnectIPSDebug } from "@/lib/connectipsDebug";

const CURRENCY = "NPR";

const unwrap = (value?: string | null) => {
  const raw = String(value || "").trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1).trim();
  }
  return raw;
};

function nowTxnDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  // ConnectIPS gateway commonly expects txn date in d-m-Y format.
  return `${dd}-${mm}-${yyyy}`;
}

function normalizeAmount(amount: number) {
  const fixed = Number(amount.toFixed(2));
  return Number.isInteger(fixed) ? String(Math.trunc(fixed)) : String(fixed);
}

function normalizeConnectIpsAmount(amount: number) {
  return String(Math.round(Number(amount || 0) * 100));
}

function fitField(value: string, maxLength: number) {
  return String(value || "").trim().slice(0, maxLength);
}

function hasShippingAddress(address: any) {
  if (!address) return false;
  return Boolean(
    String(address.fullName || "").trim() &&
      String(address.phone || "").trim() &&
      String(address.city || "").trim() &&
      String(address.region || "").trim(),
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = Number(body?.amount || 0);
    const items = Array.isArray(body?.items) ? body.items : [];
    const address = body?.address || null;

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        { status: 400 },
      );
    }
    if (items.length === 0) {
      return NextResponse.json(
        { success: false, message: "No checkout items provided" },
        { status: 400 },
      );
    }
    if (!hasShippingAddress(address)) {
      return NextResponse.json(
        { success: false, message: "Please set shipping address before placing order" },
        { status: 400 },
      );
    }

    const MERCHANTID = unwrap(
      process.env.CONNECTIPS_MERCHANTID ||
        process.env.NEXT_PUBLIC_CONNECTIPS_MERCHANTID,
    );
    const APPID = unwrap(
      process.env.CONNECTIPS_APPID || process.env.NEXT_PUBLIC_CONNECTIPS_APPID,
    );
    const APPNAME = fitField(
      unwrap(process.env.NEXT_PUBLIC_CONNECTIPS_APPNAME) || "NITYAGRO",
      30,
    );
    const GATEWAY_URL = unwrap(process.env.NEXT_PUBLIC_CONNECTIPS_API_URL);
    const HOSTNAME = unwrap(process.env.NEXT_PUBLIC_HOSTNAME) || new URL(req.url).origin;

    if (!MERCHANTID || !APPID || !GATEWAY_URL) {
      const missing = [
        !MERCHANTID ? "NEXT_PUBLIC_CONNECTIPS_MERCHANTID/CONNECTIPS_MERCHANTID" : null,
        !APPID ? "NEXT_PUBLIC_CONNECTIPS_APPID/CONNECTIPS_APPID" : null,
        !GATEWAY_URL ? "NEXT_PUBLIC_CONNECTIPS_API_URL" : null,
      ]
        .filter(Boolean)
        .join(", ");
      return NextResponse.json(
        { success: false, message: `ConnectIPS env is not configured. Missing: ${missing}` },
        { status: 500 },
      );
    }

    const uniqueSuffix = Date.now().toString().slice(-15);
    const TXNID = fitField(`NG${uniqueSuffix}`, 20);
    const REFERENCEID = fitField(`RF${uniqueSuffix}`, 20);
    const ORDERAMT = normalizeAmount(amount);
    const TXNAMT = normalizeConnectIpsAmount(amount);
    const TXNDATE = nowTxnDate();
    const REMARKS = fitField("Nityagro order payment", 50);
    const PARTICULARS = fitField("Nityagro checkout", 100);
    const SUCCESS_URL = `${HOSTNAME}/connectips/success`;
    const FAILURE_URL = `${HOSTNAME}/connectips/failure`;

    const signingPayload = {
      MERCHANTID: Number(MERCHANTID),
      APPID,
      APPNAME,
      TXNID,
      TXNDATE,
      TXNCRNCY: CURRENCY,
      TXNAMT,
      REFERENCEID,
      REMARKS,
      PARTICULARS,
      TOKEN: "TOKEN",
    };

    const TOKEN = await generateConnectIPSToken(signingPayload, [
      "MERCHANTID",
      "APPID",
      "APPNAME",
      "TXNID",
      "TXNDATE",
      "TXNCRNCY",
      "TXNAMT",
      "REFERENCEID",
      "REMARKS",
      "PARTICULARS",
      "TOKEN",
    ]);

    await logConnectIPSDebug({
      step: "initiate:payload_ready",
      referenceId: REFERENCEID,
      txnId: TXNID,
      data: {
        gatewayUrl: GATEWAY_URL,
        hostname: HOSTNAME,
        merchantId: MERCHANTID,
        appId: APPID,
        appName: APPNAME,
        txnDate: TXNDATE,
        orderAmount: ORDERAMT,
        gatewayTxnAmount: TXNAMT,
        validationPaisaAmount: TXNAMT,
        fieldLengths: {
          appName: APPNAME.length,
          txnId: TXNID.length,
          referenceId: REFERENCEID.length,
          remarks: REMARKS.length,
          particulars: PARTICULARS.length,
          token: TOKEN.length,
        },
        signingText: [
          `MERCHANTID=${Number(MERCHANTID)}`,
          `APPID=${APPID}`,
          `APPNAME=${APPNAME}`,
          `TXNID=${TXNID}`,
          `TXNDATE=${TXNDATE}`,
          `TXNCRNCY=${CURRENCY}`,
          `TXNAMT=${TXNAMT}`,
          `REFERENCEID=${REFERENCEID}`,
          `REMARKS=${REMARKS}`,
          `PARTICULARS=${PARTICULARS}`,
          "TOKEN=TOKEN",
        ].join(","),
        formFields: "MERCHANTID,APPID,APPNAME,TXNID,TXNDATE,TXNCRNCY,TXNAMT,REFERENCEID,REMARKS,PARTICULARS,TOKEN",
        signatureLength: TOKEN.length,
      },
    });

    return NextResponse.json({
      success: true,
      gatewayUrl: GATEWAY_URL,
      txnId: TXNID,
      referenceId: REFERENCEID,
      orderAmount: ORDERAMT,
      gatewayAmount: TXNAMT,
      validationPaisaAmount: TXNAMT,
      payload: {
        MERCHANTID: Number(MERCHANTID),
        APPID,
        APPNAME,
        TXNID,
        TXNDATE,
        TXNCRNCY: CURRENCY,
        TXNAMT,
        REFERENCEID,
        REMARKS,
        PARTICULARS,
        TOKEN,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to initialize ConnectIPS";
    await logConnectIPSDebug({
      step: "initiate:error",
      data: { message },
    });
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
