import Banner from "./Banner";
import ProductImageGallery from "./Productimagegallery";
import ProductInfo from "./ProductInfo";
import DeliveryCard from "./Deliverycard";
import ProductTabs from "./Producttabs";
import FrequentlyBoughtTogether from "./Frequentlyboughttogether";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
  const { id } = await params;
  const products = await prisma.products.findMany({
    where: { productStatus: true },
    include: { images: true },
    orderBy: { productId: "asc" },
  });

  const safeProducts = JSON.parse(
    JSON.stringify(products, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  const product =
    safeProducts.find((item) => String(item.productId) === String(id)) ||
    safeProducts.find((item) => String(item.productCode) === String(id));

  if (!product) {
    notFound();
  }

  const galleryImages = [
    ...(Array.isArray(product.images)
      ? product.images.map((item) => item.imageUrl).filter(Boolean)
      : []),
    ...(product.pImage ? [product.pImage] : []),
  ].filter((value, index, arr) => arr.indexOf(value) === index);

  const normalizedProduct = {
    id: Number(product.productId),
    productCode: product.productCode || "",
    name: product.subGroupName || product.productName || "Unnamed Product",
    label: product.productName || "",
    image: product.pImage || "/products/mustard-oil.png",
    images:
      galleryImages.length > 0
        ? galleryImages
        : ["/products/mustard-oil.png"],
    rating: 4,
    reviews: 0,
    price: Number(product.sellingPrice ?? product.actualPrice ?? 0),
    actualPrice: Number(product.actualPrice ?? 0),
    productDescription: product.productDescription || "",
    nutritionInfo: product.nutritionInfo || "",
    cookingInstruction: product.cookingInstruction || "",
    storageInstruction: product.storageInstruction || "",
    deliveryTargetDays: product.deliveryTargetDays || "",
    subGroupName: product.subGroupName || "",
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
          <DeliveryCard />
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
