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
    const popupBannerId = await parseId(id);
    if (!popupBannerId) {
      return NextResponse.json(
        { success: false, message: "Invalid popup banner id" },
        { status: 400, headers: corsHeaders },
      );
    }

    const popup = await prisma.popupBanner.findUnique({
      where: { popupBannerId },
    });
    if (!popup) {
      return NextResponse.json(
        { success: false, message: "Popup banner not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      { success: true, data: toResponsePopup(popup) },
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
    const popupBannerId = await parseId(id);
    if (!popupBannerId) {
      return NextResponse.json(
        { success: false, message: "Invalid popup banner id" },
        { status: 400, headers: corsHeaders },
      );
    }

    const existing = await prisma.popupBanner.findUnique({
      where: { popupBannerId },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Popup banner not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const contentType = req.headers.get("content-type") || "";
    const data: Record<string, unknown> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const popupName = toOptionalString(formData.get("popupName") || formData.get("title"));
      const popupDescription = toOptionalString(
        formData.get("popupDescription") || formData.get("description"),
      );
      const popupStatus = toOptionalBoolean(
        formData.get("popupStatus") || formData.get("isActive"),
      );

      if (popupName !== null) data.popupName = popupName;
      if (popupDescription !== null) data.popupDescription = popupDescription;
      if (popupStatus !== undefined) data.popupStatus = popupStatus;

      const imageFile = formData.get("popupImage") || formData.get("image");
      if (imageFile instanceof File && imageFile.size > 0) {
        data.popupImage = await savePopupImage(imageFile);
      }
    } else {
      const body = (await req.json()) as Record<string, unknown>;
      const popupName = toOptionalString(body.popupName ?? body.title);
      const popupDescription = toOptionalString(
        body.popupDescription ?? body.description,
      );
      const popupImage = toOptionalString(body.popupImage ?? body.imageUrl);
      const popupStatus = toOptionalBoolean(body.popupStatus ?? body.isActive);

      if (popupName !== null) data.popupName = popupName;
      if (popupDescription !== null) data.popupDescription = popupDescription;
      if (popupImage !== null) data.popupImage = popupImage;
      if (popupStatus !== undefined) data.popupStatus = popupStatus;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: "No update payload provided" },
        { status: 400, headers: corsHeaders },
      );
    }

    const updated = await prisma.popupBanner.update({
      where: { popupBannerId },
      data,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Popup banner updated successfully",
        data: toResponsePopup(updated),
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
    const popupBannerId = await parseId(id);
    if (!popupBannerId) {
      return NextResponse.json(
        { success: false, message: "Invalid popup banner id" },
        { status: 400, headers: corsHeaders },
      );
    }

    const existing = await prisma.popupBanner.findUnique({
      where: { popupBannerId },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Popup banner not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    await prisma.popupBanner.delete({ where: { popupBannerId } });

    return NextResponse.json(
      { success: true, message: "Popup banner deleted successfully" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}
