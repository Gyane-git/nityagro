import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { hashPassword } from "@/lib/password";
import { getAuthBaseUrl, getGoogleRedirectUri, makeAuthRedirectUrl } from "@/lib/authUrl";

const STATE_COOKIE = "google_oauth_state";
const NEXT_COOKIE = "google_oauth_next";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 8;
const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN", "SUPERADMIN"]);

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleUserInfo = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
};

function normalizeRole(role: string | null | undefined) {
  return String(role || "customer").trim().toUpperCase();
}

function isAdminRole(role: string | null | undefined) {
  const normalized = normalizeRole(role);
  return ADMIN_ROLES.has(normalized) || normalized.includes("ADMIN");
}

function safeRedirectPath(value: string | undefined | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function redirectWithStatus(req: NextRequest, path: string, key: string) {
  const url = makeAuthRedirectUrl(req, path);
  url.searchParams.set(key, "1");
  return NextResponse.redirect(url);
}

async function exchangeCodeForToken(req: NextRequest, code: string) {
  const redirectUri = getGoogleRedirectUri(req);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const payload = (await response.json()) as GoogleTokenResponse;
  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || payload.error || "Google token exchange failed");
  }

  return payload.access_token;
}

async function fetchGoogleUser(accessToken: string) {
  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const profile = (await response.json()) as GoogleUserInfo;
  if (!response.ok || !profile.email) {
    throw new Error("Failed to fetch Google profile");
  }

  if (profile.email_verified === false) {
    throw new Error("Google email is not verified");
  }

  return profile;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const storedState = req.cookies.get(STATE_COOKIE)?.value;
  const nextPath = safeRedirectPath(req.cookies.get(NEXT_COOKIE)?.value);

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return redirectWithStatus(req, "/?login=1", "google_error");
  }

  if (!code || !state || !storedState || state !== storedState) {
    return redirectWithStatus(req, "/?login=1", "google_error");
  }

  try {
    const accessToken = await exchangeCodeForToken(req, code);
    const profile = await fetchGoogleUser(accessToken);
    const email = String(profile.email || "").trim().toLowerCase();
    const name = String(profile.name || profile.given_name || email.split("@")[0]).trim();

    const user = await prisma.users.upsert({
      where: { email },
      update: {
        name,
      },
      create: {
        email,
        name,
        password: hashPassword(randomBytes(32).toString("hex")),
        role: "customer",
        status: true,
        rolePermission: null,
      },
      select: {
        userId: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user.status) {
      return redirectWithStatus(req, "/?login=1", "google_inactive");
    }

    const admin = isAdminRole(user.role);
    const token = signToken({
      sub: user.userId.toString(),
      role: user.role,
      type: admin ? "ADMIN" : "USER",
    });

    const targetPath = admin ? "/admin/dashboard" : nextPath;
    const url = new URL(targetPath, getAuthBaseUrl(req));
    url.searchParams.set("google_login", "1");

    const response = NextResponse.redirect(url);
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    if (admin) {
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      });
    } else {
      response.cookies.delete("admin_token");
    }

    response.cookies.delete(STATE_COOKIE);
    response.cookies.delete(NEXT_COOKIE);

    return response;
  } catch (error) {
    console.error("Google auth failed:", error);
    return redirectWithStatus(req, "/?login=1", "google_error");
  }
}
