import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

type CategoryDTO = {
  categoryName: string;
  slug: string;
  categoryDescription: string;
  categoryImage: string;
  categoryLogo: string;
  categoryBanner: string;
  userId: string;
  categoryStatus?: boolean;
};

const normalizeName = (value: string) => value.trim().toLowerCase();
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

    const incomingUnique = new Map<string, CategoryDTO>();
    for (const row of categories) {
      const name = String(row?.categoryName || "").trim();
      if (!name) continue;
      incomingUnique.set(normalizeName(name), {
        ...row,
        categoryName: name,
      });
    }

    const incomingRows = Array.from(incomingUnique.values());
    if (incomingRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid category names in sync payload" },
        { status: 400, headers: corsHeaders },
      );
    }

    const existingAll = await prisma.categories.findMany({
      select: {
        categoryId: true,
        categoryName: true,
        categoryStatus: true,
        slug: true,
        categoryDescription: true,
        categoryImage: true,
        categoryLogo: true,
        categoryBanner: true,
      },
      orderBy: { categoryId: "asc" },
    });

    const isOmsSyncPayload = incomingRows.every((row) => {
      const slug = String(row.slug || "").trim();
      const description = String(row.categoryDescription || "").trim();
      const image = String(row.categoryImage || "").trim();
      const logo = String(row.categoryLogo || "").trim();
      const banner = String(row.categoryBanner || "").trim();
      return (
        !slug &&
        !description &&
        !image &&
        !logo &&
        !banner &&
        row.categoryStatus === false
      );
    });

    const existingByNormalizedName = new Map(
      existingAll.map((row) => [normalizeName(row.categoryName), row]),
    );

    // Candidate rows that look OMS-synced and can be safely renamed:
    // inactive and without custom metadata/assets.
    const renamePool = existingAll.filter((row) => {
      const hasCustomMeta = Boolean(
        String(row.slug || "").trim() ||
          String(row.categoryDescription || "").trim() ||
          row.categoryImage ||
          row.categoryLogo ||
          row.categoryBanner,
      );
      return row.categoryStatus === false && !hasCustomMeta;
    });

    let insertedCount = 0;
    let renamedCount = 0;
    let matchedCount = 0;

    // OMS strict mode: mirror incoming names for OMS-managed rows.
    if (isOmsSyncPayload) {
      const incomingNameSet = new Set(incomingRows.map((row) => normalizeName(row.categoryName)));
      const managedRows = renamePool;

      const toDeleteIds = managedRows
        .filter((row) => !incomingNameSet.has(normalizeName(row.categoryName)))
        .map((row) => row.categoryId);

      if (toDeleteIds.length > 0) {
        await prisma.categories.deleteMany({
          where: {
            categoryId: { in: toDeleteIds },
          },
        });
      }

      const remainingManaged = managedRows.filter(
        (row) => !toDeleteIds.some((id) => id === row.categoryId),
      );
      const remainingByName = new Set(remainingManaged.map((row) => normalizeName(row.categoryName)));

      const toCreate = incomingRows.filter(
        (row) => !remainingByName.has(normalizeName(row.categoryName)),
      );

      if (toCreate.length > 0) {
        const details = await prisma.categories.createMany({
          data: toCreate.map((row) => ({
            categoryName: row.categoryName,
            slug: null,
            categoryDescription: null,
            categoryImage: null,
            categoryLogo: null,
            categoryBanner: null,
            userId: BigInt(row.userId),
            categoryStatus: false,
          })),
          skipDuplicates: true,
        });
        insertedCount += details.count;
      }

      matchedCount = incomingRows.length - insertedCount;
      return NextResponse.json(
        {
          success: true,
          insertedCount,
          renamedCount: 0,
          matchedCount,
          deletedCount: toDeleteIds.length,
          message: "Category sync completed successfully",
        },
        {
          status: 200,
          headers: corsHeaders,
        },
      );
    }

    for (const row of incomingRows) {
      const normalized = normalizeName(row.categoryName);
      const matched = existingByNormalizedName.get(normalized);
      if (matched) {
        matchedCount += 1;
        continue;
      }

      // No exact-name match -> try rename of an unused OMS row first.
      const renameTarget = renamePool.find(
        (candidate) =>
          !incomingUnique.has(normalizeName(candidate.categoryName)),
      );

      if (renameTarget) {
        await prisma.categories.update({
          where: { categoryId: renameTarget.categoryId },
          data: {
            categoryName: row.categoryName,
          },
        });
        renamedCount += 1;
        incomingUnique.set(normalized, row);
        continue;
      }

      // Fallback create if no rename candidate exists.
      await prisma.categories.create({
        data: {
          categoryName: row.categoryName,
          slug: typeof row.slug === "string" ? row.slug || null : null,
          categoryDescription:
            typeof row.categoryDescription === "string"
              ? row.categoryDescription || null
              : null,
          categoryImage: normalizeCategoryAssetUrl(row.categoryImage),
          categoryLogo: normalizeCategoryAssetUrl(row.categoryLogo),
          categoryBanner: normalizeCategoryAssetUrl(row.categoryBanner),
          userId: BigInt(row.userId),
          categoryStatus:
            typeof row.categoryStatus === "boolean" ? row.categoryStatus : false,
        },
      });
      insertedCount += 1;
    }

    return NextResponse.json(
      {
        success: true,
        insertedCount,
        renamedCount,
        matchedCount,
        message: "Category sync completed successfully",
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
    const body = await req.json();

    const {
      categoryId,
      slug,
      categoryDescription,
      categoryImage,
      categoryLogo,
      categoryBanner,
      categoryStatus,
    } = body;

    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: "categoryId is required" },
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
      return `/categories/${trimmed.replace(/^\/+/, "")}`;
    };

    const category = await prisma.categories.update({
      where: { categoryId: BigInt(categoryId) },
      data: {
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

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully",
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
