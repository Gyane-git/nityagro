import { prisma } from "@/lib/prisma";
import { getPublicUploadDir } from "@/lib/uploadPaths";
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
    // Backward-compatible keys
    id: row.bannerId.toString(),
    title: row.bannerName,
    imageUrl: row.bannerImageforWeb || row.bannerImageforMobile || row.cardImage,
    isActive: row.bannerStatus,
  };
}

async function parseId(id: string) {
  try {
    return BigInt(id);
  } catch {
    return null;
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const bannerId = await parseId(id);

    if (!bannerId) {
      return NextResponse.json(
        { success: false, message: "Invalid banner id" },
        { status: 400, headers: corsHeaders },
      );
    }

    const banner = await prisma.banner.findUnique({ where: { bannerId } });
    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      { success: true, data: toResponseBanner(banner) },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const bannerId = await parseId(id);

    if (!bannerId) {
      return NextResponse.json(
        { success: false, message: "Invalid banner id" },
        { status: 400, headers: corsHeaders },
      );
    }

    const existing = await prisma.banner.findUnique({ where: { bannerId } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const contentType = req.headers.get("content-type") || "";
    const data: Record<string, unknown> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const bannerName = toOptionalString(formData.get("bannerName") || formData.get("title"));
      const slug = toOptionalString(formData.get("slug"));
      const bannerDescription = toOptionalString(
        formData.get("bannerDescription") || formData.get("description"),
      );
      const bannerStatus = toOptionalBoolean(
        formData.get("bannerStatus") || formData.get("isActive"),
      );

      if (bannerName !== null) data.bannerName = bannerName;
      if (slug !== null) data.slug = slug;
      if (bannerDescription !== null) data.bannerDescription = bannerDescription;
      if (bannerStatus !== undefined) data.bannerStatus = bannerStatus;

      const webFile = formData.get("bannerImageforWeb") || formData.get("image");
      const mobileFile = formData.get("bannerImageforMobile");
      const cardFile = formData.get("cardImage");

      if (webFile instanceof File && webFile.size > 0) {
        data.bannerImageforWeb = await saveBannerImage(webFile, "web");
      }
      if (mobileFile instanceof File && mobileFile.size > 0) {
        data.bannerImageforMobile = await saveBannerImage(mobileFile, "mobile");
      }
      if (cardFile instanceof File && cardFile.size > 0) {
        data.cardImage = await saveBannerImage(cardFile, "card");
      }
    } else {
      const body = (await req.json()) as Record<string, unknown>;
      const bannerName = toOptionalString(body.bannerName ?? body.title);
      const slug = toOptionalString(body.slug);
      const bannerDescription = toOptionalString(
        body.bannerDescription ?? body.description,
      );
      const bannerImageforWeb = toOptionalString(
        body.bannerImageforWeb ?? body.imageUrl,
      );
      const bannerImageforMobile = toOptionalString(body.bannerImageforMobile);
      const cardImage = toOptionalString(body.cardImage);
      const bannerStatus = toOptionalBoolean(body.bannerStatus ?? body.isActive);

      if (bannerName !== null) data.bannerName = bannerName;
      if (slug !== null) data.slug = slug;
      if (bannerDescription !== null) data.bannerDescription = bannerDescription;
      if (bannerImageforWeb !== null) data.bannerImageforWeb = bannerImageforWeb;
      if (bannerImageforMobile !== null) data.bannerImageforMobile = bannerImageforMobile;
      if (cardImage !== null) data.cardImage = cardImage;
      if (bannerStatus !== undefined) data.bannerStatus = bannerStatus;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: "No update payload provided" },
        { status: 400, headers: corsHeaders },
      );
    }

    const updated = await prisma.banner.update({
      where: { bannerId },
      data,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Banner updated successfully",
        data: toResponseBanner(updated),
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const bannerId = await parseId(id);

    if (!bannerId) {
      return NextResponse.json(
        { success: false, message: "Invalid banner id" },
        { status: 400, headers: corsHeaders },
      );
    }

    const existing = await prisma.banner.findUnique({ where: { bannerId } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    await prisma.banner.delete({ where: { bannerId } });

    return NextResponse.json(
      { success: true, message: "Banner deleted successfully" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}
