import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const STATE_COOKIE = "google_oauth_state";
const NEXT_COOKIE = "google_oauth_next";

function getBaseUrl(req: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_HOSTNAME ||
    req.nextUrl.origin
  ).replace(/\/$/, "");
}

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/?login=1&google_error=missing_config", req.nextUrl.origin),
    );
  }

  const state = randomBytes(24).toString("hex");
  const next = req.nextUrl.searchParams.get("next") || "/";
  const baseUrl = getBaseUrl(req);
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    `${baseUrl}/api/auth/google/callback`;

  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(authUrl);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
  response.cookies.set(NEXT_COOKIE, next, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
