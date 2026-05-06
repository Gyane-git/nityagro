import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ✅ Preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const categories = await prisma.categories.findMany();
    // 🔥 Fix BigInt serialization
    const safeData = JSON.parse(
      JSON.stringify(categories, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
    return Response.json(
      {
        success: true,
        data: safeData,
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
    const body = await req.json();

    const {
      categoryName,
      slug,
      categoryDescription,
      categoryImage,
      categoryLogo,
      categoryBanner,
      userId,
    } = body;

    if (!categoryName) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User id is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const normalizeCategoryAssetUrl = (value: unknown) => {
      if (value === null || value === undefined || value === "") return null;
      if (typeof value !== "string") return null;
      const trimmed = value.trim();

      if (!trimmed) return null;
      if (trimmed.startsWith("/categories/")) return trimmed;
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
      }

      const cleanName = trimmed.replace(/^\/+/, "");
      return `/categories/${cleanName}`;
    };

    const createdCategory = await prisma.categories.create({
      data: {
        categoryName: categoryName.trim(),
        slug: typeof slug === "string" ? slug.trim() || null : null,
        categoryDescription:
          typeof categoryDescription === "string"
            ? categoryDescription.trim() || null
            : null,
        categoryImage: normalizeCategoryAssetUrl(categoryImage),
        categoryLogo: normalizeCategoryAssetUrl(categoryLogo),
        categoryBanner: normalizeCategoryAssetUrl(categoryBanner),
        userId: BigInt(userId),
      },
    });

    // 🔥 Fix BigInt serialization
    const safeData = JSON.parse(
      JSON.stringify(createdCategory, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    return NextResponse.json(
      { success: true, data: safeData, message: "Category save successful" },
      { headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PUT(req: Request) {
  const body = await req.json();

  const {
    categoryId,
    categoryName,
    slug,
    categoryDescription,
    categoryImage,
    categoryLogo,
    categoryBanner,
    categoryStatus,
  } = body;

  if (!categoryId) {
    return NextResponse.json(
      { success: false, message: "categoryId  is required" },
      { status: 400, headers: corsHeaders },
    );
  }

  const normalizeCategoryAssetUrl = (value: unknown) => {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value !== "string") return null;
    const trimmed = value.trim();

    if (!trimmed) return null;
    if (trimmed.startsWith("/categories/")) return trimmed;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }

    const cleanName = trimmed.replace(/^\/+/, "");
    return `/categories/${cleanName}`;
  };

  try {
    const category = await prisma.categories.update({
      where: { categoryId: BigInt(categoryId) },
      data: {
        ...(categoryName !== undefined && {
          categoryName:
            typeof categoryName === "string" ? categoryName.trim() : categoryName,
        }),
        ...(slug !== undefined && {
          slug: typeof slug === "string" ? slug.trim() || null : null,
        }),
        ...(categoryDescription !== undefined && {
          categoryDescription:
            typeof categoryDescription === "string"
              ? categoryDescription.trim() || null
              : null,
        }),
        ...(categoryImage !== undefined && {
          categoryImage: normalizeCategoryAssetUrl(categoryImage),
        }),
        ...(categoryLogo !== undefined && {
          categoryLogo: normalizeCategoryAssetUrl(categoryLogo),
        }),
        ...(categoryBanner !== undefined && {
          categoryBanner: normalizeCategoryAssetUrl(categoryBanner),
        }),
        ...(categoryStatus !== undefined && {
          categoryStatus: Boolean(categoryStatus),
        }),
      },
    });

    const safeData = JSON.parse(
      JSON.stringify(category, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: safeData,
    }, { status: 200, headers: corsHeaders },);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
       { status: 500, headers: corsHeaders },
    );
  }
}

export async function DELETE(req: Request) {
  /* ---------- DELETE DB ---------- */
  const body = await req.json();
  const { categoryId } = body;
  if (!categoryId) {
    return NextResponse.json(
      { success: false, message: "categoryId is required" },
      { status: 400, headers: corsHeaders },
    );
  }
  try {
    await prisma.categories.delete({
      where: { categoryId: BigInt(categoryId) },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("CATEGORY_DELETE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
     { status: 500, headers: corsHeaders },
    );
  }
}