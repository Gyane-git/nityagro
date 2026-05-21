import Banner from "./Banner";
import ProductImageGallery from "./Productimagegallery";
import ProductInfo from "./ProductInfo";
import DeliveryCard from "./Deliverycard";
import ProductTabs from "./Producttabs";
import FrequentlyBoughtTogether from "./Frequentlyboughttogether";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ─── Breadcrumb ─────────────────────────────────────────────────────────────
function Breadcrumb({ productName }) {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 py-3">
      <Link href="/" className="hover:text-[#00462C] transition-colors">
        Home
      </Link>
      <span className="text-gray-400">›</span>
      <Link href="/products" className="hover:text-[#00462C] transition-colors">
        Products
      </Link>
      <span className="text-gray-400">›</span>
      <span className="font-semibold text-gray-800">{productName}</span>
    </nav>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function ProductDetailPage({ params }) {
  noStore();
  const { id } = await params;
  const isNumericId = /^\d+$/.test(String(id));
  let product = null;

  if (isNumericId) {
    product = await prisma.products.findUnique({
      where: {
        productId: BigInt(id),
      },
      include: { images: true },
    });

    // Backward compatibility for routes that use productCode in URL.
    if (!product) {
      product = await prisma.products.findFirst({
        where: {
          productCode: String(id),
        },
        include: { images: true },
      });
    }
  } else {
    product = await prisma.products.findFirst({
      where: {
        productCode: String(id),
      },
      include: { images: true },
    });
  }

  if (!product) {
    notFound();
  }

  const safeProduct = JSON.parse(
    JSON.stringify(product, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );

  const galleryImages = [
    ...(Array.isArray(safeProduct.images)
      ? safeProduct.images.map((item) => item.imageUrl).filter(Boolean)
      : []),
    ...(safeProduct.pImage ? [safeProduct.pImage] : []),
  ].filter((value, index, arr) => arr.indexOf(value) === index);

  const normalizedProduct = {
    id: Number(safeProduct.productId),
    productCode: safeProduct.productCode || "",
    name: safeProduct.subGroupName || safeProduct.productName || "Unnamed Product",
    label: safeProduct.productName || "",
    image: safeProduct.pImage || "/products/mustard-oil.png",
    images:
      galleryImages.length > 0
        ? galleryImages
        : ["/products/mustard-oil.png"],
    rating: 4,
    reviews: 0,
    price: Number(safeProduct.sellingPrice ?? safeProduct.actualPrice ?? 0),
    actualPrice: Number(safeProduct.actualPrice ?? 0),
    productDescription: safeProduct.productDescription || "",
    nutritionInfo: safeProduct.nutritionInfo || "",
    cookingInstruction: safeProduct.cookingInstruction || "",
    storageInstruction: safeProduct.storageInstruction || "",
    deliveryTargetDays: safeProduct.deliveryTargetDays || "",
    subGroupName: safeProduct.subGroupName || "",
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto px-6 py-6" style={{ maxWidth: "1440px" }}>
        {/* ── Banner ── */}
        <Banner />

        {/* ── Breadcrumb ── */}
        <Breadcrumb productName={normalizedProduct.name} />

        {/* ── Main row: Gallery | Info | Delivery Card ── */}
        <div className="flex gap-6 items-start mt-2 mb-8">
          {/* Left: image gallery (thumbnails + main) */}
          <ProductImageGallery images={normalizedProduct.images} />

          {/* Center: product info */}
          <ProductInfo product={normalizedProduct} />

          {/* Right: delivery + return card */}
          <DeliveryCard deliveryTargetDays={normalizedProduct.deliveryTargetDays} />
        </div>

        {/* ── Tabs ── */}
        <ProductTabs product={normalizedProduct} />

        {/* ── Divider ── */}
        <div className="border-t border-gray-200 my-10" />

        {/* ── Frequently Bought Together ── */}
        <FrequentlyBoughtTogether />

        {/* Bottom spacing */}
        <div className="h-16" />
      </div>
    </main>
  );
}
