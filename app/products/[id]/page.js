"use client";

import Banner from "./Banner";
import ProductImageGallery from "./Productimagegallery";
import ProductInfo from "./ProductInfo";
import DeliveryCard from "./Deliverycard";
import ProductTabs from "./Producttabs";
import FrequentlyBoughtTogether from "./Frequentlyboughttogether";

// ─── Breadcrumb ─────────────────────────────────────────────────────────────
function Breadcrumb({ productName }) {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 py-3">
      <a href="/" className="hover:text-[#00462C] transition-colors">
        Home
      </a>
      <span className="text-gray-400">›</span>
      <a href="/products" className="hover:text-[#00462C] transition-colors">
        Products
      </a>
      <span className="text-gray-400">›</span>
      <span className="font-semibold text-gray-800">{productName}</span>
    </nav>
  );
}

// ─── Product data ────────────────────────────────────────────────────────────
const PRODUCT = {
  name: "Yellow Mustard Oil",
  rating: 4.5,
  reviews: 148,
  price: 499,
  images: [
    "/products/mustard-oil.png",
    "/products/red-chilli.png",
    "/products/chickpea-flour.png",
    "/products/jaggery.png",
    "/products/red-chilli-2.png",
  ],
};

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  return (
    <main className="min-h-screen bg-white">
        <div className="mx-auto px-6 py-6"
        style={{ maxWidth: "1440px" }}> 
      {/* ── Banner — full width, no max-width ── */}
      <Banner />

      <div className="mx-auto px-6" style={{ maxWidth: "1020px" }}>
        {/* ── Breadcrumb ── */}
        <Breadcrumb productName={PRODUCT.name} />

        {/* ── Main row: Gallery | Info | Delivery Card ── */}
        <div className="flex gap-6 items-start mt-2 mb-8">
          {/* Left: image gallery (thumbnails + main) */}
          <ProductImageGallery images={PRODUCT.images} />

          {/* Center: product info */}
          <ProductInfo product={PRODUCT} />

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
      </div>
    </main>
  );
}