import { NextResponse } from 'next/server';

import { generateConnectIPSToken } from "@/lib/connectipsToken";
import { logConnectIPSDebug } from "@/lib/connectipsDebug";
const SIGNING_KEYS = [
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
] as const;
const VALIDATE_SIGNING_KEYS = [
  "MERCHANTID",
  "APPID",
  "REFERENCEID",
  "TXNAMT",
] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // For validation/get-details API, ConnectIPS requires:
    // MERCHANTID,APPID,REFERENCEID,TXNAMT (exact order).
    const isValidationShape =
      body?.REFERENCEID !== undefined &&
      body?.TXNAMT !== undefined &&
      body?.TXNID === undefined;

    const keys = isValidationShape ? VALIDATE_SIGNING_KEYS : SIGNING_KEYS;
    const sanitized = keys.reduce<Record<string, unknown>>((acc, key) => {
      if (body?.[key] !== undefined && body?.[key] !== null) {
        acc[key] = body[key];
      }
      return acc;
    }, {});
    const signature = await generateConnectIPSToken(sanitized, keys);
    await logConnectIPSDebug({
      step: "get_token:success",
      referenceId: String(body?.REFERENCEID || body?.TXNID || ""),
      txnId: String(body?.TXNID || ""),
      data: {
        keys: keys.join(","),
        payload: sanitized,
        tokenLength: signature?.length || 0,
      },
    });

    return NextResponse.json({ TOKEN: signature });
  } catch (error) {
    console.error('CONNECTIPS_GET_TOKEN_ERROR', error);
    const msg = error instanceof Error ? error.message : "Unknown token error";
    await logConnectIPSDebug({
      step: "get_token:error",
      data: { message: msg },
    });
    const isPasswordError =
      /invalid password|mac verify error|pkcs12/i.test(msg);
    return NextResponse.json(
      {
        success: false,
        message: isPasswordError
          ? "PKCS12 certificate password is invalid (CREATOR.pfx)"
          : "Unable to generate ConnectIPS token",
      },
      { status: 500 }
    );
  }
}
