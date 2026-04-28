"use client";

import Image from "next/image";
import { useState } from "react";

// ─── Icons ─────────────────────────────────────────────────────────────────
const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "#F5A623" : "none"} stroke="#F5A623" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
);

// ─── Mock product data (35 products) ───────────────────────────────────────
const generateProducts = () => {
  const base = [
    { name: "Red Chilli Powder",     category: "Spices",  image: "/products/red-chilli.png",      badge: "Best Seller", discount: "BES\n30%\nOFF" },
    { name: "Gran (Chickpea) Flour", category: "Flours",  image: "/products/chickpea-flour.png",   badge: null,          discount: "BES\n30%\nOFF" },
    { name: "Jaggery Powder",        category: "Jaggery", image: "/products/jaggery1.png",          badge: "Best Seller", discount: null },
    { name: "Red Chilli Powder",     category: "Spices",  image: "/products/red-chilli1.png",     badge: null,          discount: null },
    { name: "Yellow Mustard Oil",    category: "Oils",    image: "/products/mustard-oil.png",     badge: null,          discount: null },
    { name: "Sattu Flour",           category: "Sattu",   image: "/products/sattu-flour.png",      badge: null,          discount: "BES\n30%\nOFF" },
    { name: "Daliya Flour",          category: "Daliya",  image: "/products/daliya-flour.png",     badge: null,          discount: "BES\n30%\nOFF" },
    { name: "Jaggery Powder",        category: "Jaggery", image: "/products/jaggery.png",          badge: "Best Seller", discount: null },
    { name: "Red Chilli Powder",     category: "Spices",  image: "/products/red-chilli-2.png",     badge: null,          discount: null },
    { name: "Yellow Mustard Oil",    category: "Oils",    image: "/products/mustard-oil-2.png",    badge: null,          discount: null },
  ];
  return Array.from({ length: 35 }, (_, i) => ({
    id: i + 1,
    ...base[i % base.length],
    price: 250,
    rating: [4, 4, 3, 4][i % 4],
    reviews: 711,
  }));
};

const ALL_PRODUCTS = generateProducts();
const PER_PAGE = 8; // 4 cols × 2 rows visible

// ─── Star Rating ───────────────────────────────────────────────────────────
function StarRating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={s <= rating} />)}
      <span className="text-xs text-gray-500 ml-1">({reviews})</span>
    </div>
  );
}

// ─── Single Product Card — exact same as ProductSection ────────────────────
function ProductCard({ product }) {
  const [added, setAdded] = useState(false);

  return (
    <div
      className="relative flex flex-col bg-white border border-gray-200 overflow-hidden"
      style={{
        width: "259.2px",
        height: "360.83px",
        borderRadius: "8px",
        borderWidth: "1px",
        flexShrink: 0,
      }}
    >
      {/* Discount badge */}
      {product.discount && (
        <div
          className="absolute top-0 left-0 z-10 flex items-center justify-center text-center text-white font-bold leading-tight"
          style={{
            background: "#00462C",
            width: "52px",
            minHeight: "58px",
            borderBottomRightRadius: "8px",
            fontSize: "10px",
            padding: "6px 4px",
            whiteSpace: "pre-line",
          }}
        >
          {product.discount}
        </div>
      )}

      {/* Best Seller badge */}
      {product.badge && (
        <div
          className="absolute top-3 right-0 z-10 text-white font-semibold text-xs px-3 py-1.5"
          style={{
            background: "#F5A623",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
          }}
        >
          {product.badge}
        </div>
      )}

      {/* Image */}
      <div
        className="relative w-full bg-gray-50 flex items-center justify-center"
        style={{ height: "210px", flexShrink: 0 }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4"
          sizes="259px"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3 justify-between">
        <div className="flex flex-col gap-1">
          <StarRating rating={product.rating} reviews={product.reviews} />
          <p className="text-gray-800 text-sm font-medium leading-snug line-clamp-2">
            {product.name}
          </p>
          <p className="text-gray-900 font-bold" style={{ fontSize: "15px" }}>
            NPR {product.price}
          </p>
        </div>

        <button
          onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1400); }}
          className="mt-2 w-full flex items-center justify-center gap-2 text-white font-semibold text-sm py-2.5 rounded transition-all duration-200 active:scale-95"
          style={{ background: added ? "#2d7a4f" : "#00462C", borderRadius: "6px" }}
        >
          <CartIcon />
          {added ? "Added!" : "Add"}
        </button>
      </div>
    </div>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────
function Pagination({ current, total, onChange }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1 justify-end mt-8">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:border-[#00462C] hover:text-[#00462C] disabled:opacity-30 transition-colors"
      >
        <ChevronLeft />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className="w-8 h-8 flex items-center justify-center rounded border text-sm font-medium transition-colors"
          style={{
            background: current === p ? "#00462C" : "white",
            color: current === p ? "white" : "#374151",
            borderColor: current === p ? "#00462C" : "#D1D5DB",
          }}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:border-[#00462C] hover:text-[#00462C] disabled:opacity-30 transition-colors"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

// ─── Main ProductList ───────────────────────────────────────────────────────
export default function ProductList({ products = ALL_PRODUCTS }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(products.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const visible = products.slice(start, start + PER_PAGE);

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Items count */}
      <p className="text-sm text-gray-600 mb-4 font-medium">
        Items {start + 1}–{Math.min(start + PER_PAGE, products.length)} of{" "}
        <span className="font-bold text-gray-800">{products.length}</span>
      </p>

      {/* 4-column grid */}
      <div
        className="grid gap-6 "
        style={{ gridTemplateColumns: "repeat(4, 259.2px)"}}
      >
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination current={page} total={totalPages} onChange={setPage} />
    </div>
  );
}