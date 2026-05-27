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

async function savePopupImage(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Invalid image type");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = fileExt(file);
  const base = safeName(file.name.replace(/\.[^/.]+$/, "")) || "popup-image";
  const fileName = `popup-${base}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}${ext}`;
  const uploadDir = getPublicUploadDir("popup");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);

  return `/popup/${fileName}`;
}

function toResponsePopup(row: {
  popupBannerId: bigint;
  popupName: string | null;
  popupDescription: string | null;
  popupImage: string | null;
  popupStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    popupBannerId: row.popupBannerId.toString(),
    popupName: row.popupName,
    popupDescription: row.popupDescription,
    popupImage: row.popupImage,
    popupStatus: row.popupStatus,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    // Backward-compatible keys for existing admin page
    id: row.popupBannerId.toString(),
    title: row.popupName || "",
    imageUrl: row.popupImage,
    isActive: row.popupStatus,
    colorCode: "#000000",
    position: 0,
    startAt: null,
    endAt: null,
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
    const popupAds = await prisma.popupBanner.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          popupAds: popupAds.map(toResponsePopup),
        },
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

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let popupName: string | null = null;
    let popupDescription: string | null = null;
    let popupImage: string | null = null;
    let popupStatus = true;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      popupName = toOptionalString(formData.get("popupName") || formData.get("title"));
      popupDescription = toOptionalString(
        formData.get("popupDescription") || formData.get("description"),
      );
      popupStatus =
        toOptionalBoolean(formData.get("popupStatus") || formData.get("isActive")) ??
        true;

      const imageFile = formData.get("popupImage") || formData.get("image");
      if (imageFile instanceof File && imageFile.size > 0) {
        popupImage = await savePopupImage(imageFile);
      }
    } else {
      const body = (await req.json()) as Record<string, unknown>;
      popupName = toOptionalString(body.popupName ?? body.title);
      popupDescription = toOptionalString(
        body.popupDescription ?? body.description,
      );
      popupImage = toOptionalString(body.popupImage ?? body.imageUrl);
      popupStatus = toOptionalBoolean(body.popupStatus ?? body.isActive) ?? true;
    }

    if (!popupName) {
      return NextResponse.json(
        { success: false, message: "popupName is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const created = await prisma.popupBanner.create({
      data: {
        popupName,
        popupDescription,
        popupImage,
        popupStatus,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Popup ad created successfully",
        data: toResponsePopup(created),
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
