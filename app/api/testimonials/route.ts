import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPublicUploadDir } from "@/lib/uploadPaths";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const UPLOAD_DIR = getPublicUploadDir("uploads", "testimonials");
const PUBLIC_DIR = "/uploads/testimonials";

function serialize(item: any) {
  return {
    id: item.testimonialsId.toString(),
    testimonialsId: item.testimonialsId.toString(),
    userId: item.userId?.toString?.() || "",
    name: item.name || "",
    userName: item.name || "",
    title: item.title || "",
    description: item.message || "",
    message: item.message || "",
    destination: item.designation || "",
    designation: item.designation || "",
    image: item.image || "",
    profile_image: item.image || "",
    rating: Number(item.starRating || 0),
    starRating: Number(item.starRating || 0),
    isActive: Boolean(item.testimonialStatus),
    testimonialStatus: Boolean(item.testimonialStatus),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function toRating(value: unknown) {
  const rating = Number(value || 0);
  if (!Number.isFinite(rating)) return BigInt(5);
  return BigInt(Math.max(1, Math.min(5, Math.trunc(rating))));
}

async function saveImage(file: File | null, prefix = "testimonial") {
  if (!file || file.size === 0) return "";
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }
  if (file.size > 4 * 1024 * 1024) {
    throw new Error("Image size must be below 4MB");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const extension = path.extname(file.name) || ".jpg";
  const safeName = `${prefix}-${slugify(file.name.replace(extension, ""))}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, safeName), bytes);
  return `${PUBLIC_DIR}/${safeName}`;
}

async function deleteLocalImage(imageUrl: string | null | undefined) {
  if (!imageUrl || !imageUrl.startsWith(PUBLIC_DIR)) return;
  try {
    await unlink(path.join(getPublicUploadDir(), imageUrl));
  } catch {
    // Missing old files should not block testimonial updates.
  }
}

async function resolveUserId(rawUserId?: FormDataEntryValue | null) {
  const inputId = Number(rawUserId || 0);
  if (Number.isFinite(inputId) && inputId > 0) {
    const user = await prisma.users.findUnique({
      where: { userId: BigInt(inputId) },
      select: { userId: true },
    });
    if (user) return user.userId;
  }

  const firstUser = await prisma.users.findFirst({
    orderBy: { userId: "asc" },
    select: { userId: true },
  });

  if (!firstUser) {
    throw new Error("Please create at least one user before adding testimonials");
  }

  return firstUser.userId;
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const items = await prisma.testimonials.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(
      items.map(serialize),
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to fetch testimonials" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = String(formData.get("title") || "").trim();
    const name = String(formData.get("name") || formData.get("userName") || "").trim();
    const message = String(formData.get("description") || formData.get("message") || "").trim();
    const designation = String(formData.get("destination") || formData.get("designation") || "").trim();
    const isActive = String(formData.get("isActive") ?? "1") !== "0";

    if (name.length < 2) {
      return NextResponse.json(
        { success: false, message: "User name is required" },
        { status: 400, headers: corsHeaders },
      );
    }
    if (message.length < 5) {
      return NextResponse.json(
        { success: false, message: "Description must be at least 5 characters" },
        { status: 400, headers: corsHeaders },
      );
    }

    const image = await saveImage(
      (formData.get("image") || formData.get("profileImage")) as File | null,
      "testimonial",
    );
    const userId = await resolveUserId(formData.get("userId"));

    const created = await prisma.testimonials.create({
      data: {
        userId,
        name,
        title,
        message,
        designation,
        image,
        starRating: toRating(formData.get("rating") || formData.get("starRating")),
        testimonialStatus: isActive,
      },
    });

    return NextResponse.json(
      { success: true, message: "Testimonial created successfully", data: serialize(created) },
      { status: 201, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to create testimonial" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = Number(formData.get("id") || 0);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid testimonial id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const existing = await prisma.testimonials.findUnique({
      where: { testimonialsId: BigInt(id) },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const title = String(formData.get("title") || "").trim();
    const name = String(formData.get("name") || formData.get("userName") || "").trim();
    const message = String(formData.get("description") || formData.get("message") || "").trim();
    const designation = String(formData.get("destination") || formData.get("designation") || "").trim();
    const isActive = String(formData.get("isActive") ?? "1") !== "0";
    const newImage = await saveImage(
      (formData.get("image") || formData.get("profileImage")) as File | null,
      "testimonial",
    );
    const image = newImage || String(formData.get("existingImage") || existing.image || "");
    if (newImage && existing.image) await deleteLocalImage(existing.image);

    const updated = await prisma.testimonials.update({
      where: { testimonialsId: BigInt(id) },
      data: {
        name,
        title,
        message,
        designation,
        image,
        starRating: toRating(formData.get("rating") || formData.get("starRating")),
        testimonialStatus: isActive,
      },
    });

    return NextResponse.json(
      { success: true, message: "Testimonial updated successfully", data: serialize(updated) },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to update testimonial" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id") || 0);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid testimonial id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const existing = await prisma.testimonials.findUnique({
      where: { testimonialsId: BigInt(id) },
    });
    if (existing?.image) await deleteLocalImage(existing.image);
    await prisma.testimonials.delete({ where: { testimonialsId: BigInt(id) } });

    return NextResponse.json(
      { success: true, message: "Testimonial deleted successfully" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to delete testimonial" },
      { status: 500, headers: corsHeaders },
    );
  }
}
