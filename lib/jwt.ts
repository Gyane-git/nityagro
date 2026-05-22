import { createHmac, timingSafeEqual } from "crypto";

export type AppJwtPayload = {
  sub: string;
  role?: string;
  type: "USER" | "ADMIN";
};

const JWT_SECRET = process.env.JWT_SECRET;

export const signToken = (
  payload: AppJwtPayload,
  expiresInSeconds: number = 60 * 60 * 24 * 8 // 8 days
): string => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedBody = base64UrlEncode(JSON.stringify(body));
  const signature = sign(`${encodedHeader}.${encodedBody}`);

  return `${encodedHeader}.${encodedBody}.${signature}`;
};

export const verifyToken = (token: string): AppJwtPayload => {
  const [encodedHeader, encodedBody, signature] = token.split(".");
  if (!encodedHeader || !encodedBody || !signature) {
    throw new Error("Invalid token");
  }

  const expectedSignature = sign(`${encodedHeader}.${encodedBody}`);
  if (!safeEqual(signature, expectedSignature)) {
    throw new Error("Invalid token signature");
  }

  const parsed = JSON.parse(base64UrlDecode(encodedBody)) as AppJwtPayload & {
    exp?: number;
  };

  if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return {
    sub: parsed.sub,
    role: parsed.role,
    type: parsed.type,
  };
};

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
  return createHmac("sha256", getJwtSecret())
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

function getJwtSecret(): string {
  if (JWT_SECRET) {
    return JWT_SECRET;
  }

  if (process.env.NODE_ENV !== "production") {
    return "nityagro-local-development-secret";
  }

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return JWT_SECRET;
}
