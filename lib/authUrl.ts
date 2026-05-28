import type { NextRequest } from "next/server";

function cleanUrl(value?: string | null) {
  return String(value || "").trim().replace(/\/$/, "");
}

function isLocalhostUrl(value?: string | null) {
  const raw = cleanUrl(value);
  if (!raw) return false;
  try {
    const url = new URL(raw);
    return ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return raw.includes("localhost") || raw.includes("127.0.0.1");
  }
}

export function getRequestBaseUrl(req: NextRequest) {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const host = forwardedHost || req.headers.get("host") || req.nextUrl.host;
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const proto = forwardedProto || req.nextUrl.protocol.replace(":", "") || "https";
  return `${proto}://${host}`.replace(/\/$/, "");
}

export function getAuthBaseUrl(req: NextRequest) {
  const requestBaseUrl = getRequestBaseUrl(req);
  const configured = cleanUrl(
    process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_HOSTNAME,
  );

  if (!configured) return requestBaseUrl;

  // Localhost env is fine during local development, but dangerous on live behind nginx/pm2.
  if (isLocalhostUrl(configured) && !isLocalhostUrl(requestBaseUrl)) {
    return requestBaseUrl;
  }

  return configured;
}

export function getGoogleRedirectUri(req: NextRequest) {
  const baseUrl = getAuthBaseUrl(req);
  const configured = cleanUrl(process.env.GOOGLE_REDIRECT_URI);

  if (!configured) return `${baseUrl}/api/auth/google/callback`;

  if (isLocalhostUrl(configured) && !isLocalhostUrl(baseUrl)) {
    return `${baseUrl}/api/auth/google/callback`;
  }

  return configured;
}

export function makeAuthRedirectUrl(req: NextRequest, path: string) {
  return new URL(path, getAuthBaseUrl(req));
}
