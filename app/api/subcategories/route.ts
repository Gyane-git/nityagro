import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type SubCategoryDTO = {
  pCode: string;
  subGroupName: string;
  variationName: string;
  MRP: number;

  stockQuantity?: number;
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
    const { productsubGroup }: { productsubGroup: SubCategoryDTO[] } =
      await req.json();

    // ✅ Validation
    if (!productsubGroup || productsubGroup.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Sub Categories are required",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    // Normalize + dedupe by pCode (latest row wins).
    const incomingByCode = new Map<string, SubCategoryDTO>();
    for (const row of productsubGroup) {
      const key = String(row?.pCode || "").trim();
      if (!key) continue;
      incomingByCode.set(key, {
        pCode: key,
        subGroupName: String(row?.subGroupName || "").trim(),
        variationName: String(row?.variationName || "").trim(),
        MRP: Number(row?.MRP ?? 0),
        stockQuantity:
          row?.stockQuantity === undefined || row?.stockQuantity === null
            ? undefined
            : Number(row.stockQuantity),
      });
    }

    const payloadRows = Array.from(incomingByCode.values());
    if (payloadRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid sub category rows found" },
        { status: 400, headers: corsHeaders },
      );
    }

    const existingSubCategories = await prisma.productVariant.findMany({
      where: {
        pCode: {
          in: payloadRows.map((c) => c.pCode),
        },
      },
      select: {
        pCode: true,
      },
    });

    const existingCodes = new Set(existingSubCategories.map((e) => e.pCode));
    const rowsToCreate = payloadRows.filter((row) => !existingCodes.has(row.pCode));
    const rowsToUpdate = payloadRows.filter((row) => existingCodes.has(row.pCode));

    let insertedCount = 0;
    let updatedCount = 0;

    if (rowsToCreate.length > 0) {
      const details = await prisma.productVariant.createMany({
        data: rowsToCreate.map((p) => ({
          pCode: p.pCode,
          subGroupName: p.subGroupName,
          variationName: p.variationName,
          salesRate: p.MRP,
          stockQuantity: BigInt(Number(p.stockQuantity ?? 0)),
        })),
        skipDuplicates: true,
      });
      insertedCount = details.count;
    }

    for (const row of rowsToUpdate) {
      const updated = await prisma.productVariant.updateMany({
        where: { pCode: row.pCode },
        data: {
          subGroupName: row.subGroupName,
          variationName: row.variationName,
          salesRate: row.MRP,
          ...(row.stockQuantity === undefined
            ? {}
            : { stockQuantity: BigInt(Number(row.stockQuantity ?? 0)) }),
        },
      });
      updatedCount += updated.count;
    }

    return NextResponse.json(
      {
        success: true,
        insertedCount,
        updatedCount,
        message: "Sub categories synced successfully",
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
