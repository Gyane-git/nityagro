import { prisma } from "@/lib/prisma";
import { getPublicUploadDir } from "@/lib/uploadPaths";
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function toOptionalString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function toOptionalBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const lowered = value.trim().toLowerCase();
    if (["1", "true", "yes", "active"].includes(lowered)) return true;
    if (["0", "false", "no", "inactive"].includes(lowered)) return false;
  }
  return undefined;
}

function safeName(raw: string) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function fileExt(file: File) {
  const extMap: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  if (extMap[file.type]) return extMap[file.type];
  const parsed = path.extname(file.name || "").toLowerCase();
  return parsed || ".png";
}

async function saveBannerImage(file: File, type: "web" | "mobile" | "card") {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Invalid image type");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = fileExt(file);
  const base = safeName(file.name.replace(/\.[^/.]+$/, "")) || "banner-image";
  const fileName = `${type}-${base}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}${ext}`;
  const uploadDir = getPublicUploadDir("banners");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);

  return `/banners/${fileName}`;
}

function toResponseBanner(row: {
  bannerId: bigint;
  bannerName: string;
  slug: string | null;
  bannerDescription: string | null;
  bannerImageforWeb: string | null;
  bannerImageforMobile: string | null;
  cardImage: string | null;
  bannerStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    bannerId: row.bannerId.toString(),
    bannerName: row.bannerName,
    slug: row.slug,
    bannerDescription: row.bannerDescription,
    bannerImageforWeb: row.bannerImageforWeb,
    bannerImageforMobile: row.bannerImageforMobile,
    cardImage: row.cardImage,
    bannerStatus: row.bannerStatus,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    // Backward-compatible keys for existing admin UI
    id: row.bannerId.toString(),
    title: row.bannerName,
    imageUrl: row.bannerImageforWeb || row.bannerImageforMobile || row.cardImage,
    isActive: row.bannerStatus,
  };
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { updatedAt: "desc" },
    });

    const data = banners.map(toResponseBanner);

    return NextResponse.json(
      { success: true, data: { banners: data } },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let bannerName = "";
    let slug: string | null = null;
    let bannerDescription: string | null = null;
    let bannerImageforWeb: string | null = null;
    let bannerImageforMobile: string | null = null;
    let cardImage: string | null = null;
    let bannerStatus = true;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      bannerName =
        String(formData.get("bannerName") || formData.get("title") || "").trim();
      slug = toOptionalString(formData.get("slug"));
      bannerDescription = toOptionalString(
        formData.get("bannerDescription") || formData.get("description"),
      );
      bannerStatus =
        toOptionalBoolean(formData.get("bannerStatus") || formData.get("isActive")) ??
        true;

      const webFile = formData.get("bannerImageforWeb") || formData.get("image");
      const mobileFile = formData.get("bannerImageforMobile");
      const cardFile = formData.get("cardImage");

      if (webFile instanceof File && webFile.size > 0) {
        bannerImageforWeb = await saveBannerImage(webFile, "web");
      }
      if (mobileFile instanceof File && mobileFile.size > 0) {
        bannerImageforMobile = await saveBannerImage(mobileFile, "mobile");
      }
      if (cardFile instanceof File && cardFile.size > 0) {
        cardImage = await saveBannerImage(cardFile, "card");
      }
    } else {
      const body = (await req.json()) as Record<string, unknown>;
      bannerName = String(body.bannerName ?? body.title ?? "").trim();
      slug = toOptionalString(body.slug);
      bannerDescription = toOptionalString(body.bannerDescription ?? body.description);
      bannerImageforWeb = toOptionalString(body.bannerImageforWeb ?? body.imageUrl);
      bannerImageforMobile = toOptionalString(body.bannerImageforMobile);
      cardImage = toOptionalString(body.cardImage);
      bannerStatus = toOptionalBoolean(body.bannerStatus ?? body.isActive) ?? true;
    }

    if (!bannerName) {
      return NextResponse.json(
        { success: false, message: "bannerName is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const created = await prisma.banner.create({
      data: {
        bannerName,
        slug,
        bannerDescription,
        bannerImageforWeb,
        bannerImageforMobile,
        cardImage,
        bannerStatus,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Banner created successfully",
        data: toResponseBanner(created),
      },
      { status: 201, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}
