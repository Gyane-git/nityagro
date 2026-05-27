import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getPublicUploadDir } from "@/lib/uploadPaths";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function buildCorsHeaders(req: Request) {
  const origin = req.headers.get("origin");
  return {
    ...corsHeaders,
    "Access-Control-Allow-Origin": origin || "*",
    Vary: "Origin",
  };
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function safeBaseName(fileName: string) {
  const withoutExt = fileName.replace(/\.[^/.]+$/, "");
  return withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function extensionFromFile(file: File) {
  const extByMime: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };

  if (extByMime[file.type]) return extByMime[file.type];
  const parsed = path.extname(file.name || "").toLowerCase();
  return parsed || ".png";
}

async function persistImage(file: File, variant: string) {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Invalid file type. Only jpg, png, webp, gif allowed.");
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File too large. Max 5MB allowed.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base = safeBaseName(file.name || `${variant}-image`) || variant;
  const ext = extensionFromFile(file);
  const uniqueName = `${variant}-${base}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}${ext}`;

  const uploadDir = getPublicUploadDir("categories");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, uniqueName), buffer);

  return `/categories/${uniqueName}`;
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: buildCorsHeaders(req),
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const categoryImage = formData.get("categoryImage");
    const categoryLogo = formData.get("categoryLogo");
    const categoryBanner = formData.get("categoryBanner");

    const payload: {
      categoryImage?: string | null;
      categoryLogo?: string | null;
      categoryBanner?: string | null;
    } = {};

    if (categoryImage instanceof File && categoryImage.size > 0) {
      payload.categoryImage = await persistImage(categoryImage, "image");
    }
    if (categoryLogo instanceof File && categoryLogo.size > 0) {
      payload.categoryLogo = await persistImage(categoryLogo, "logo");
    }
    if (categoryBanner instanceof File && categoryBanner.size > 0) {
      payload.categoryBanner = await persistImage(categoryBanner, "banner");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Category assets uploaded successfully",
        data: payload,
      },
      { status: 200, headers: buildCorsHeaders(req) },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 400, headers: buildCorsHeaders(req) },
    );
  }
}
