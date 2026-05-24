import { createHmac, timingSafeEqual } from "crypto";

const RESET_SECRET = process.env.JWT_SECRET || "nityagro-local-development-secret";
const RESET_TTL_SECONDS = 10 * 60;

export const PASSWORD_RESET_COOKIE = "password_reset_session";

function base64UrlEncode(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value: string) {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString();
}

function sign(value: string) {
  return createHmac("sha256", RESET_SECRET)
    .update(value)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export function createPasswordResetSession(email: string) {
  const payload = base64UrlEncode(
    JSON.stringify({
      email: String(email || "").trim().toLowerCase(),
      exp: Math.floor(Date.now() / 1000) + RESET_TTL_SECONDS,
    }),
  );

  return `${payload}.${sign(payload)}`;
}

export function verifyPasswordResetSession(token: string | undefined | null, email: string) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as {
      email?: string;
      exp?: number;
    };
    if (!parsed.email || parsed.email !== String(email || "").trim().toLowerCase()) {
      return false;
    }
    if (!parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
