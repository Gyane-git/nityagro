import { prisma } from "@/lib/prisma";
import { getPublicUploadDir } from "@/lib/uploadPaths";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function safeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "variant";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const pCode = String(formData.get("pCode") || "").trim();
    const image = formData.get("image");

    if (!pCode || !(image instanceof File) || image.size === 0) {
      return NextResponse.json({ success: false, message: "pCode and image are required" }, { status: 400 });
    }
    if (image.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ success: false, message: "Image must be smaller than 5MB" }, { status: 413 });
    }
    if (!allowedTypes.has(image.type)) {
      return NextResponse.json({ success: false, message: "Invalid image type" }, { status: 400 });
    }

    const ext = path.extname(image.name || "").toLowerCase() || ".png";
    const fileName = `variant-${safeName(pCode)}-${Date.now()}${ext}`;
    const directory = getPublicUploadDir("uploads", "variants");
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, fileName), Buffer.from(await image.arrayBuffer()));

    const imageUrl = `/uploads/variants/${fileName}`;
    const updated = await prisma.productVariant.updateMany({
      where: { pCode },
      data: { imageUrl },
    });

    if (!updated.count) {
      return NextResponse.json({ success: false, message: "Variant not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Variant image upload failed", error);
    return NextResponse.json({ success: false, message: "Unable to save variant image" }, { status: 500 });
  }
}
