
import { NextResponse } from 'next/server';
import { generateConnectIPSToken } from "@/lib/connectipsToken";
import { logConnectIPSDebug } from "@/lib/connectipsDebug";
import fs from "fs";
import path from "path";

// import { hostname } from '#/utils/constants';

const PASSWORD = process.env.CONNECTIPS_AUTH_PASSWORD;
const MERCHANTID =
  process.env.CONNECTIPS_MERCHANTID || process.env.NEXT_PUBLIC_CONNECTIPS_MERCHANTID;
const APPID =
  process.env.CONNECTIPS_APPID || process.env.NEXT_PUBLIC_CONNECTIPS_APPID;
const DETAILS_URL = process.env.NEXT_PUBLIC_CONNECTIPS_GETDETAILS_URL;

const normalizeEnvValue = (value?: string | null): string => {
  const raw = String(value || "").trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1).trim();
  }
  return raw;
};

const readRawEnvValue = (key: string): string => {
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) return "";
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      if (!trimmed.startsWith(`${key}=`)) continue;
      const raw = trimmed.slice(key.length + 1).trim();
      const unwrapped = normalizeEnvValue(raw).replace(/\\\$/g, "$");
      return unwrapped;
    }
  } catch {
    // ignore and fall back to process.env
  }
  return "";
};

const resolveAuthPassword = (): string => {
  const fromEnv = normalizeEnvValue(PASSWORD);
  const fromRawEnvFile = readRawEnvValue("CONNECTIPS_AUTH_PASSWORD");
  // Prefer process env when it looks complete; otherwise use raw .env fallback.
  return fromEnv.length >= fromRawEnvFile.length ? fromEnv : fromRawEnvFile;
};

export async function POST(request: Request) {
  try {
    const merchantId = normalizeEnvValue(MERCHANTID);
    const appId = normalizeEnvValue(APPID);
    const authPass = resolveAuthPassword();
    const detailsUrl = normalizeEnvValue(DETAILS_URL);

    if (!merchantId || !appId || !authPass || !detailsUrl) {
      return NextResponse.json(
        { status: "ERROR", statusDesc: "ConnectIPS env is not configured", response: {} },
        { status: 500 }
      );
    }

    const body = await request.json();
    const referenceId = String(body.TXNID || body.REFERENCEID || "").trim();
    const txnAmt = Number(body.TXNAMT || 0);
    if (!referenceId || !Number.isFinite(txnAmt) || txnAmt <= 0) {
      return NextResponse.json(
        { status: "ERROR", statusDesc: "Invalid REFERENCEID or TXNAMT", response: {} },
        { status: 400 }
      );
    }

    const signaturePayload = {
      MERCHANTID: Number(merchantId),
      APPID: appId,
      REFERENCEID: referenceId,
      TXNAMT: txnAmt,
    };

    const TOKEN = await generateConnectIPSToken(signaturePayload, [
      "MERCHANTID",
      "APPID",
      "REFERENCEID",
      "TXNAMT",
    ]);

    const payload = {
      merchantId: Number(merchantId),
      appId: appId,
      referenceId: referenceId,
      txnAmt: txnAmt,
      token: TOKEN,
    };
    const authUser = appId;
    await logConnectIPSDebug({
      step: "get_details:request",
      referenceId,
      data: {
        detailsUrl,
        authUser,
        authPassLength: authPass.length,
        payload,
      },
    });

// console.log('Payload:', payload);
// console.log('Details URL:', DETAILS_URL);
    const credentials = Buffer.from(`${authUser}:${authPass}`).toString("base64");
    const response = await fetch(detailsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(payload),
      cache: "no-cache",
    });
    const data: any = await response.json().catch(() => ({}));

    await logConnectIPSDebug({
      step: "get_details:response",
      referenceId,
      data: {
        authUser,
        statusCode: response.status,
        ok: response.ok,
        body: data,
      },
    });
    if (!response.ok) {
      return NextResponse.json({
        status: 'ERROR',
        statusDesc: data?.statusDesc || 'RESPONSE Error',
        response: data || {}
      }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("CONNECTIPS_GET_DETAILS_ERROR", err);
    await logConnectIPSDebug({
      step: "get_details:error",
      data: { message: err instanceof Error ? err.message : String(err) },
    });
    return NextResponse.json({
      status: 'ERROR',
      statusDesc: 'Internal Error',
    }, { status: 500 });
  }
}
