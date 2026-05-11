import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

type ProductDTO = {
  productCode: string;
  categoryId: string;
  userId: number;
  productName: string;
  subGroupName?:string;
  slug?: string;
  productVariation?: string;
  productDescription?: string;
  nutritionInfo?: string;
  cookingInstruction?: string;
  storageInstruction?: string;
  pImage?: string;
  productStatus?: boolean;
  actualPrice: number;
  sellingPrice: number;
  deliveryTargetDays?: number;
  stockQuantity?: number;
  availableQuantity?: number;
  flashSale?: boolean;
  specialOffer?: boolean;
};


export async function GET() {
  try {
    const productGroupWise = await prisma.products.findMany();
    // 🔥 Fix BigInt serialization
    const safeData = JSON.parse(
      JSON.stringify(productGroupWise, (_, value) =>
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
    // ✅ Read body once
    const { product }: { product: ProductDTO[] } = await req.json();

    // ✅ Validation
    if (!product || product.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Products are required",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    // ✅ Find existing product names
    const existingProducts = await prisma.products.findMany({
      where: {
        subGroupName: {
          in: product.map((p) => p.subGroupName || ""),
        },
      },
      select: {
        subGroupName: true,
      },
    });

    const existingNames = new Set(existingProducts.map((e) => e.subGroupName));

    // ✅ Remove duplicate names inside request itself
    const addedNames = new Set<string>();
    const newProducts = product.filter((p) => {
      // already exists in DB
      if (existingNames.has(p.subGroupName ?? "")) {
        return false;
      }
      // duplicate inside incoming array
      if (addedNames.has(p.subGroupName ?? "")) {
        return false;
      }
      addedNames.add(p.subGroupName ?? "");
      return true;
    });

    // ✅ Insert only unique products
    let insertedCount = 0;

    if (newProducts.length > 0) {
      const details = await prisma.products.createMany({
        data: newProducts.map((p) => ({
          productCode: p.productCode,
          categoryId: p.categoryId,
          userId: p.userId,
          productName: p.productName,
          subGroupName:p.subGroupName,
          slug: p.slug,
          productVariation: p.productVariation,
          productDescription: p.productDescription,
          nutritionInfo: p.nutritionInfo,
          cookingInstruction: p.cookingInstruction,
          storageInstruction: p.storageInstruction,
          pImage: p.pImage,
          productStatus: p.productStatus,
          actualPrice: p.actualPrice,
          sellingPrice: p.sellingPrice,
          deliveryTargetDays: p.deliveryTargetDays,
          stockQuantity: p.stockQuantity,
          availableQuantity: p.availableQuantity,
          flashSale: p.flashSale,
          specialOffer: p.specialOffer,
        })),

        // ✅ Prisma skip duplicate safeguard
        skipDuplicates: true,
      });

      insertedCount = details.count;
    }

    return NextResponse.json(
      {
        success: true,
        count: insertedCount,
        message: "Products saved successfully",
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


export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    const productCode = formData.get("productCode") as string;

    const productDescription = formData.get("productDescription") as string;

    const nutritionalInformation = formData.get(
      "nutritionalInformation"
    ) as string;

    const cookingDescription = formData.get(
      "cookingDescription"
    ) as string;

    const storageInstruction = formData.get(
      "storageInstruction"
    ) as string;

    const delivaryTargetDays = formData.get(
      "delivaryTargetDays"
    ) as string;

    const productStatus =
      formData.get("productStatus") === "true";

    const productImage = formData.get("productImage") as File | null;

    if (!productCode) {
      return NextResponse.json(
        {
          success: false,
          message: "productCode is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    let imagePath: string | null = null;

    // ✅ save file
    if (productImage && productImage.size > 0) {
      const bytes = await productImage.arrayBuffer();

      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${productImage.name}`;

      const path = `/uploads/products/${fileName}`;

      const fs = require("fs");

      fs.writeFileSync(path, buffer);

      imagePath = `/uploads/products/${fileName}`;
    }

    const product = await prisma.products.update({
      where: {
        productCode,
      },
      data: {
        ...(productDescription !== undefined && {
          productDescription:
            productDescription.trim() || null,
        }),

        ...(nutritionalInformation !== undefined && {
          nutritionInfo:
            nutritionalInformation.trim() || null,
        }),

        ...(cookingDescription !== undefined && {
          cookingInstruction:
            cookingDescription.trim() || null,
        }),

        ...(storageInstruction !== undefined && {
          storageInstruction:
            storageInstruction.trim() || null,
        }),

        ...(delivaryTargetDays !== undefined && {
          deliveryTargetDays: Number(delivaryTargetDays),
        }),

        productStatus,

        ...(imagePath && {
          pImage: imagePath,
        }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        data: product,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
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

// export async function PUT(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       productCode,
//       productDescription	,
//       nutritionalInformation,
//       cookingDescription,
//       storageInstruction,
//       productStatus,
//       delivaryTargetDays,
//       productImage,
    
//     } = body;

//     if (!productCode) {
//       return NextResponse.json(
//         { success: false, message: "productCode is required" },
//         { status: 400, headers: corsHeaders },
//       );
//     }

  

//     const product = await prisma.products.update({
//       where: { productCode: productCode },
//       data: {
//         ...(productDescription	 !== undefined && {
//           productDescription	: typeof productDescription	 === "string" ? productDescription	.trim() || null : null,
//         }),
//         ...(nutritionalInformation !== undefined && {
//           nutritionInfo: typeof nutritionalInformation === "string" ? nutritionalInformation.trim() || null : null,
//         }),
//         ...(cookingDescription !== undefined && {
//           cookingInstruction:
//             typeof cookingDescription === "string"
//               ? cookingDescription.trim() || null
//               : null,
//         }),
//          ...(storageInstruction !== undefined && {
//           storageInstruction:
//             typeof storageInstruction === "string"
//               ? storageInstruction.trim() || null
//               : null,
//         }),
//          ...(productStatus !== undefined && {
//           productStatus: Boolean(productStatus),
//         }),
//         ...(delivaryTargetDays !== undefined && {
//           deliveryTargetDays: delivaryTargetDays,
//         }),
//         ...(productImage !== undefined && {
//           pImage: productImage,
//         }),
       
       
//       },
//     });

//     const safeData = JSON.parse(
//       JSON.stringify(product, (_, value) =>
//         typeof value === "bigint" ? value.toString() : value,
//       ),
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         message: `product updated successfully`,
//         data: safeData,
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