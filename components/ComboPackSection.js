"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ALL_PRODUCTS } from "@/app/products/productsData";
import useCartStore from "@/store/cartStore";
import useToastStore from "@/store/toastStore";

// ─── Icons ─────────────────────────────────────────────────────────────────
const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#F5A623" : "none"} stroke="#F5A623" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ─── Data ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "All", image: "/categories/all.png" },
  { id: "oils", label: "Oils", image: "/categories/oils.png" },
  { id: "flours", label: "Flours", image: "/categories/flours.png" },
  { id: "spices", label: "Spices", image: "/categories/spieces.png" },
  { id: "jaggery", label: "Jaggery", image: "/categories/jaggery.png" },
  { id: "dailya", label: "Dailya", image: "/categories/dailya.png" },
  { id: "sattu", label: "Sattu", image: "/categories/satu.png" },
];

const PRODUCTS = [
  { id: 1, name: "Yellow Mustard Oil", price: 250, rating: 4, reviews: 711, category: "oils", badge: "Best Seller", discount: "BES\n30%\nOFF", image: "/products/mustard-oil.png" },
  { id: 2, name: "Red Chilli Powder", price: 600, rating: 4, reviews: 711, category: "spices", badge: null, discount: null, image: "/products/red-chilli.png" },
  { id: 3, name: "Gran (Chickpea) Flour", price: 250, rating: 4, reviews: 711, category: "flours", badge: null, discount: "BES\n30%\nOFF", image: "/products/chickpea-flour.png" },
  { id: 4, name: "Jaggery Powder", price: 250, rating: 4, reviews: 711, category: "jaggery", badge: "Best Seller", discount: null, image: "/products/jaggery1.png" },
  { id: 5, name: "Red Chilli Powder", price: 250, rating: 4, reviews: 711, category: "spices", badge: null, discount: null, image: "/products/red-chilli1.png" },
];

// ─── Star Rating ───────────────────────────────────────────────────────────
function StarRating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} filled={s <= rating} />
      ))}
      <span className="text-xs text-gray-500 ml-1">({reviews})</span>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const detailProduct = ALL_PRODUCTS.find((item) => item.name === product.name) || ALL_PRODUCTS[0];
  const addToCart = useCartStore((state) => state.addToCart);
  const showToast = useToastStore((state) => state.showToast);

  const handleAdd = () => {
    addToCart({ id: detailProduct.id, name: product.name, price: product.price, image: product.image, qty: 1, weight: "100 gm" });
    showToast(`${product.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="relative flex flex-col w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Discount badge */}
      {product.discount && (
        <div className="absolute top-0 left-0 z-10 text-white font-bold text-center" style={{ background: "#00462C", width: "52px", minHeight: "56px", borderBottomRightRadius: "8px", fontSize: "10px", padding: "5px 4px", whiteSpace: "pre-line", lineHeight: "1.3" }}>
          {product.discount}
        </div>
      )}

      {/* Best Seller badge */}
      {product.badge && (
        <div className="absolute top-3 right-0 z-10 text-white text-xs px-2 py-1" style={{ background: "#F5A623", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }}>
          {product.badge}
        </div>
      )}

      <Link href={`/products/${detailProduct.id}`} className="flex flex-col">
        {/* Image — fixed height */}
        <div className="relative w-full bg-gray-50" style={{ height: "160px" }}>
          <Image src={product.image} alt={product.name} fill className="object-contain p-3" sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw" />
        </div>

        {/* Info — fixed height so ALL cards are the same height */}
        <div className="px-3 pt-2 pb-1 overflow-hidden" style={{ height: "84px" }}>
          <StarRating rating={product.rating} reviews={product.reviews} />
          <p className="text-sm font-medium text-gray-800 line-clamp-2 mt-1 leading-snug">{product.name}</p>
          <p className="text-sm font-bold text-gray-900 mt-1">NPR {product.price}</p>
        </div>
      </Link>

      {/* Add to cart */}
      <div className="px-3 pb-3 pt-1">
        <button
          onClick={handleAdd}
          className="w-full py-2 rounded text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          style={{ background: added ? "#2d7a4f" : "#00462C" }}
        >
          <CartIcon />
          {added ? "Added!" : "Add"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────
export default function ComboPackSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section className="w-full bg-white">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="mx-auto w-full max-w-340 px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center pt-8 sm:pt-10 lg:pt-11.25 pb-4 gap-1">
          <h1 className="font-bold text-xl sm:text-2xl lg:text-[32px] leading-tight tracking-[0.6px] text-[#235A49]" style={{ fontFamily: "Roboto Slab" }}>
            Traditional Combo Packs
          </h1>
          <p className="font-normal text-lg sm:text-xl lg:text-[32px] leading-tight tracking-[0.6px] text-[#235A49]" style={{ fontFamily: "Roboto Slab" }}>
            Authentic Goodness in Every Bundle
          </p>
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex items-end overflow-x-auto scrollbar-hide gap-1 sm:gap-3 sm:justify-center pb-3 mt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map(({ id, label, image }) => {
            const isActive = activeCategory === id;
            return (
              <button key={id} onClick={() => setActiveCategory(id)} className="flex flex-col items-center relative transition-all shrink-0" style={{ minWidth: "52px" }}>
                <div className="flex flex-col items-center justify-end cursor-pointer pb-2">
                  <Image src={image} alt={label} width={36} height={36} className="sm:w-12 sm:h-12" />
                  <span className="text-xs font-medium mt-1" style={{ color: isActive ? "#00462C" : "#6B7280", lineHeight: "16px", letterSpacing: "0.2px", transition: "color 0.2s" }}>
                    {label}
                  </span>
                </div>
                {/* Active underline */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-200" style={{ height: "2.5px", width: isActive ? "100%" : "0%", background: "#00462C", borderRadius: "2px" }} />
              </button>
            );
          })}
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-gray-200" />

        {/* ── Title Row ── */}
        <div className="flex items-center gap-3 mt-4 mb-4 sm:mt-6 sm:mb-5">
          <h2 className="font-bold text-[#00462C] text-base sm:text-lg lg:text-[22px] whitespace-nowrap">
            {activeCategory === "all" ? "Traditional Combo Packs" : CATEGORIES.find((c) => c.id === activeCategory)?.label}
          </h2>
          <div className="flex-1 border-t-2 border-gray-200" />
          <Link href="/products" className="font-semibold text-sm whitespace-nowrap hover:underline transition-colors" style={{ color: "#00462C" }}>
            View All
          </Link>
        </div>

        {/* ── Products: horizontal scroll slider on ALL screen sizes ── */}
        {filtered.length > 0 ? (
          <div className="overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="flex gap-3">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="shrink-0"
                  style={{
                    // ~2.3 cards visible on mobile, scales up naturally on larger screens
                    width: "clamp(140px, calc((100vw - 48px) / 2.3), 230px)",
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm py-10 w-full text-center">
            No products in this category yet.
          </p>
        )}

      </div>
    </section>
  );
}