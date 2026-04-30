import Banner from "./Banner";
import ProductImageGallery from "./Productimagegallery";
import ProductInfo from "./ProductInfo";
import DeliveryCard from "./Deliverycard";
import ProductTabs from "./Producttabs";
import FrequentlyBoughtTogether from "./Frequentlyboughttogether";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_PRODUCTS } from "../productsData";

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
  const productId = Number(id);
  const product = ALL_PRODUCTS.find((item) => item.id === productId);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto px-6 py-6" style={{ maxWidth: "1440px" }}>
        {/* ── Banner ── */}
        <Banner />

        {/* ── Breadcrumb ── */}
        <Breadcrumb productName={product.name} />

        {/* ── Main row: Gallery | Info | Delivery Card ── */}
        <div className="flex gap-6 items-start mt-2 mb-8">
          {/* Left: image gallery (thumbnails + main) */}
          <ProductImageGallery images={product.images} />

          {/* Center: product info */}
          <ProductInfo product={product} />

          {/* Right: delivery + return card */}
          <DeliveryCard />
        </div>

        {/* ── Tabs ── */}
        <ProductTabs />

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