import { prisma } from "@/lib/prisma";
import { getCategoryImageDir } from "@/utils/imageUpload";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type CategoryDTO = {
  categoryName: string;
  slug: string;
  categoryDescription: string;
  categoryImage: string;
  categoryLogo: string;
  categoryBanner: string;
  userId: string;
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
    // ✅ Read body only once
    const { categories }: { categories: CategoryDTO[] } = await req.json();

    // ✅ Validation
    if (!categories || categories.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Categories are required",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    // ✅ Normalize image path
    const normalizeCategoryAssetUrl = (value: unknown) => {
      if (value === null || value === undefined || value === "") {
        return null;
      }

      if (typeof value !== "string") {
        return null;
      }

      const trimmed = value.trim();

      if (!trimmed) {
        return null;
      }

      if (trimmed.startsWith("/categories/")) {
        return trimmed;
      }

      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
      }

      const cleanName = trimmed.replace(/^\/+/, "");

      return `/categories/${cleanName}`;
    };

    // ✅ Find existing category names in DB
    const existingCategories = await prisma.categories.findMany({
      where: {
        categoryName: {
          in: categories.map((c) => c.categoryName),
        },
      },
      select: {
        categoryName: true,
      },
    });

    const existingNames = new Set(
      existingCategories.map((e) => e.categoryName),
    );

    // ✅ Remove duplicates from incoming request also
    const addedNames = new Set<string>();

    const newCategories = categories.filter((c) => {
      // already exists in DB
      if (existingNames.has(c.categoryName)) {
        return false;
      }

      // duplicate inside request array
      if (addedNames.has(c.categoryName)) {
        return false;
      }

      addedNames.add(c.categoryName);

      return true;
    });

    // ✅ Insert only unique categories
    let insertedCount = 0;

    if (newCategories.length > 0) {
      const details = await prisma.categories.createMany({
        data: newCategories.map((p) => ({
          categoryName: p.categoryName,

          slug: typeof p.slug === "string" ? p.slug || null : null,

          categoryDescription:
            typeof p.categoryDescription === "string"
              ? p.categoryDescription || null
              : null,

          categoryImage: normalizeCategoryAssetUrl(p.categoryImage),

          categoryLogo: normalizeCategoryAssetUrl(p.categoryLogo),

          categoryBanner: normalizeCategoryAssetUrl(p.categoryBanner),

          userId: BigInt(p.userId),
        })),

        // ✅ Prisma duplicate protection
        skipDuplicates: true,
      });

      insertedCount = details.count;
    }

    return NextResponse.json(
      {
        success: true,
        count: insertedCount,
        message: "Category saved successfully",
      },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: String(error),
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}

// export async function POST(req: Request) {
//   try {
//     // ✅ read ONLY ONCE
//     const { categories }: { categories: CategoryDTO[] } = await req.json();

//     if (!categories || categories.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "categories are required" },
//         { status: 400 },
//       );
//     }
//     const normalizeCategoryAssetUrl = (value: unknown) => {
//       if (value === null || value === undefined || value === "") return null;
//       if (typeof value !== "string") return null;
//       const trimmed = value.trim();

//       if (!trimmed) return null;
//       if (trimmed.startsWith("/categories/")) return trimmed;
//       if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
//         return trimmed;
//       }

//       const cleanName = trimmed.replace(/^\/+/, "");
//       return `/categories/${cleanName}`;
//     };

//     // ✅ 1. Find existing category names
//     const existing = await prisma.categories.findMany({
//       where: {
//         categoryName: {
//           in: categories.map((c) => c.categoryName),
//         },
//       },
//       select: { categoryName: true },
//     });

//     const existingNames = new Set(existing.map((e) => e.categoryName));

//     // ✅ 2. Split data
//     const newCategories = categories.filter(
//       (c) => !existingNames.has(c.categoryName),
//     );
//     // ✅ 3. Insert only new
//     let insertedCount = 0;

//     if (newCategories.length > 0) {
//       const details = await prisma.categories.createMany({
//         data: categories.map((p) => ({
//           categoryName: p.categoryName,
//           slug: p.slug === "string" ? p.slug || null : null,
//           categoryDescription:
//             typeof p.categoryDescription === "string"
//               ? p.categoryDescription || null
//               : null,
//           categoryImage: normalizeCategoryAssetUrl(p.categoryImage),
//           categoryLogo: normalizeCategoryAssetUrl(p.categoryImage),
//           categoryBanner: normalizeCategoryAssetUrl(p.categoryImage),
//           userId: BigInt(p.userId),
//         })),
//       });
//       insertedCount = details.count;
//     }
//     return NextResponse.json(
//       {
//         success: true,
//         count: insertedCount,
//         message: "Category saved successfully",
//       },
//       { status: 200, headers: corsHeaders },
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: String(error) },
//       { status: 500, headers: corsHeaders },
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       categoryName,
//       slug,
//       categoryDescription,
//       categoryImage,
//       categoryLogo,
//       categoryBanner,
//       userId,
//     } = body;

//     if (!categoryName) {
//       return NextResponse.json(
//         { success: false, message: "Category name is required" },
//         { status: 400, headers: corsHeaders },
//       );
//     }

//     if (!userId) {
//       return NextResponse.json(
//         { success: false, message: "User id is required" },
//         { status: 400, headers: corsHeaders },
//       );
//     }

//     const normalizeCategoryAssetUrl = (value: unknown) => {
//       if (value === null || value === undefined || value === "") return null;
//       if (typeof value !== "string") return null;
//       const trimmed = value.trim();

//       if (!trimmed) return null;
//       if (trimmed.startsWith("/categories/")) return trimmed;
//       if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
//         return trimmed;
//       }

//       const cleanName = trimmed.replace(/^\/+/, "");
//       return `/categories/${cleanName}`;
//     };

//     const createdCategory = await prisma.categories.create({
//       data: {
//         categoryName: categoryName.trim(),
//         slug: typeof slug === "string" ? slug.trim() || null : null,
//         categoryDescription:
//           typeof categoryDescription === "string"
//             ? categoryDescription.trim() || null
//             : null,
//         categoryImage: normalizeCategoryAssetUrl(categoryImage),
//         categoryLogo: normalizeCategoryAssetUrl(categoryLogo),
//         categoryBanner: normalizeCategoryAssetUrl(categoryBanner),
//         userId: BigInt(userId),
//       },
//     });

//     // 🔥 Fix BigInt serialization
//     const safeData = JSON.parse(
//       JSON.stringify(createdCategory, (_, value) =>
//         typeof value === "bigint" ? value.toString() : value,
//       ),
//     );

//     return NextResponse.json(
//       { success: true, data: safeData, message: "Category save successful" },
//       { status: 200, headers: corsHeaders },

//     );
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: String(error) },
//       { status: 500, headers: corsHeaders },
//     );
//   }
// }




export async function PUT(req: Request) {
  try {
    // ✅ Read form data
    const formData = await req.formData();

    const categoryId = formData.get("categoryId")?.toString();

    const categoryName = formData.get("categoryName")?.toString();

    const slug = formData.get("slug")?.toString();

    const categoryDescription = formData
      .get("categoryDescription")
      ?.toString();

    const categoryStatus = formData.get("categoryStatus");

    // ✅ File
    const file = formData.get("categoryImage") as File | null;

    if (!categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "categoryId is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    let imagePath: string | undefined;

    // ✅ Upload image
    if (file && file.size > 0) {
      const uploadDir = getCategoryImageDir();

      fs.mkdirSync(uploadDir, { recursive: true });

      const bytes = await file.arrayBuffer();

      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "")}`;

      const fullPath = path.join(uploadDir, fileName);

      fs.writeFileSync(fullPath, buffer);

      imagePath = `/uploads/categories/${fileName}`;
    }

    // ✅ Update DB
    const category = await prisma.categories.update({
      where: {
        categoryId: BigInt(categoryId),
      },

      data: {
        ...(categoryName !== undefined && {
          categoryName: categoryName.trim(),
        }),

        ...(slug !== undefined && {
          slug: slug.trim() || null,
        }),

        ...(categoryDescription !== undefined && {
          categoryDescription:
            categoryDescription.trim() || null,
        }),

        ...(imagePath && {
          categoryImage: imagePath,
          categoryLogo: imagePath,
          categoryBanner: imagePath,
        }),

        // ...(categoryStatus !== null && {
        //   categoryStatus:
        //     categoryStatus === "true",
        // }),
      },
    });

    // ✅ Convert bigint
    const safeData = JSON.parse(
      JSON.stringify(category, (_, value) =>
        typeof value === "bigint"
          ? value.toString()
          : value
      )
    );

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully",
        data: safeData,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: String(error),
      },
      {
        status: 500,
        headers: corsHeaders,
      }
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
