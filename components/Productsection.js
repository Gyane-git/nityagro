"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ALL_PRODUCTS } from "@/app/products/productsData";
import useCartStore from "@/store/cartStore";
import useToastStore from "@/store/toastStore";


// ─── Category Icons (inline SVG) ───────────────────────────────────────────
const AllIcon = () => (
  <svg width="38" height="38" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="14" height="14" rx="2"/><rect x="28" y="6" width="14" height="14" rx="2"/>
    <rect x="6" y="28" width="14" height="14" rx="2"/><rect x="28" y="28" width="14" height="14" rx="2"/>
  </svg>
);
const OilIcon = () => (
  <svg width="38" height="38" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h12v6l4 6v16a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V20l4-6V8z"/>
    <line x1="14" y1="26" x2="34" y2="26"/><line x1="22" y1="8" x2="26" y2="8"/>
  </svg>
);
const FlourIcon = () => (
  <svg width="38" height="38" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="24" cy="20" rx="10" ry="14"/><path d="M14 20c0 8 20 8 20 0"/>
    <path d="M20 6c-2-2-4-1-4 2"/><path d="M28 6c2-2 4-1 4 2"/>
  </svg>
);
const SpiceIcon = () => (
  <svg width="38" height="38" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="12" y="16" width="24" height="22" rx="3"/><rect x="16" y="10" width="16" height="8" rx="2"/>
    <line x1="18" y1="24" x2="30" y2="24"/><line x1="18" y1="30" x2="30" y2="30"/>
  </svg>
);
const JaggeryIcon = () => (
  <svg width="38" height="38" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="20" width="32" height="18" rx="3"/><path d="M16 20v-4a8 8 0 0 1 16 0v4"/>
    <line x1="16" y1="29" x2="32" y2="29"/>
  </svg>
);
const DailyaIcon = () => (
  <svg width="38" height="38" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 14c0-2 2-4 4-4h16c2 0 4 2 4 4v22a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V14z"/>
    <path d="M20 10v4"/><path d="M28 10v4"/><ellipse cx="24" cy="24" rx="6" ry="4"/>
  </svg>
);
const SattuIcon = () => (
  <svg width="38" height="38" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="18" width="28" height="20" rx="4"/><path d="M16 18v-4a8 8 0 0 1 16 0v4"/>
    <path d="M10 26h28"/><circle cx="24" cy="22" r="2"/>
  </svg>
);

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#F5A623" : "none"} stroke="#F5A623" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

// ─── Data ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",      label: "All",     image: "/categories/all.png", Icon: AllIcon }, 
  { id: "oils",     label: "Oils",    image: "/categories/oils.png",   Icon: OilIcon },
  { id: "flours",   label: "Flours",  image: "/categories/flours.png", Icon: FlourIcon },
  { id: "spices",   label: "Spices",  image: "/categories/spieces.png", Icon: SpiceIcon },
  { id: "jaggery",  label: "Jaggery", image: "/categories/jaggery.png", Icon: JaggeryIcon },
  { id: "dailya",   label: "Dailya",  image: "/categories/dailya.png", Icon: DailyaIcon },
  { id: "sattu",    label: "Sattu",   image: "/categories/satu.png",  Icon: SattuIcon },
];

const PRODUCTS = [
  { id: 1, name: "Yellow Mustard Oil",    price: 250, rating: 4, reviews: 711, category: "oils",    badge: "Best Seller", discount: "BES\n30%\nOFF", image: "/products/mustard-oil.png" },
  { id: 2, name: "Red Chilli Powder",     price: 250, rating: 4, reviews: 711, category: "spices",  badge: null,          discount: null,            image: "/products/red-chilli.png" },
  { id: 3, name: "Gran (Chickpea) Flour", price: 250, rating: 4, reviews: 711, category: "flours",  badge: null,          discount: "BES\n30%\nOFF", image: "/products/chickpea-flour.png" },
  { id: 4, name: "Jaggery Powder",        price: 250, rating: 4, reviews: 711, category: "jaggery", badge: "Best Seller", discount: null,            image: "/products/jaggery1.png" },
  { id: 5, name: "Red Chilli Powder",     price: 250, rating: 4, reviews: 711, category: "spices",  badge: null,          discount: null,            image: "/products/red-chilli1.png" },
];

// ─── Star Rating ───────────────────────────────────────────────────────────
function StarRating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-1">
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
  const detailProduct =
    ALL_PRODUCTS.find((item) => item.name === product.name) || ALL_PRODUCTS[0];
  const addToCart = useCartStore((state) => state.addToCart);
  const showToast = useToastStore((state) => state.showToast);

  const handleAdd = () => {
    addToCart({
      id: detailProduct.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
      weight: "100 gm",
    });
    showToast(`${product.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="relative flex flex-col border border-gray-200 overflow-hidden"
      style={{
        width: "230.2px",
        height: "360.83px",
        borderRadius: "8px",
      }}
    >
      {/* Discount */}
      {product.discount && (
        <div
          className="absolute top-0 left-0 z-10 text-white font-bold text-center"
          style={{
            background: "#00462C",
            width: "56px",
            minHeight: "60px",
            borderBottomRightRadius: "8px",
            fontSize: "11px",
            padding: "6px 4px",
            whiteSpace: "pre-line",
          }}
        >
          {product.discount}
        </div>
      )}

      {/* Badge */}
      {product.badge && (
        <div
          className="absolute top-3 right-0 z-10 text-white text-xs px-3 py-1.5"
          style={{
            background: "#F5A623",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
          }}
        >
          {product.badge}
        </div>
      )}

      <Link href={`/products/${detailProduct.id}`} className="flex flex-col flex-1 min-h-0">
        {/* Image */}
        <div className="relative w-full h-[220px] bg-gray-50 flex items-center justify-center">
          <Image src={product.image} alt={product.name} fill className="object-contain p-4" />
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 px-3 py-3">
          <div>
            <StarRating rating={product.rating} reviews={product.reviews} />

            <p className="text-sm font-medium text-gray-800 line-clamp-2 mt-1">
              {product.name}
            </p>

            <p className="text-base font-bold text-gray-900 mt-1">
              NPR {product.price}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3">
        <button
          onClick={handleAdd}
          className="w-full py-2.5 rounded text-white font-semibold flex items-center justify-center gap-2"
          style={{ background: added ? "#2d7a4f" : "#00462C" }}
        >
          <CartIcon />
          {added ? "Added!" : "Add"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function ProductSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto" style={{ maxWidth: "1360px" }}>

        {/* ── Welcome Header ── */}
        {/* width:1360 · height:127 · gap:4 · pt:45 */}
        <div
          className="flex flex-col items-center text-center"
          style={{
            width: "100%",
            height: "127px",
            gap: "4px",
            paddingTop: "45px",
          }}
        >
          <h1
            className="font-bold text-[#00462C]"
            style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.75rem)" }}
          >
            Welcome To Nityagro!
          </h1>
          <p
            className="text-[#00462C]"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.1rem, 1.8vw, 1.45rem)",
            }}
          >
            Pure Goodness, Delivered Closer to You
          </p>
        </div>

        {/* ── Category Tabs ── */}
        {/* width:1360 · height:86.56 · minHeight:80 · gap:12 · px:20 · pb:13 */}
        <div
          className="flex items-end justify-center"
          style={{
            width: "100%",
            height: "86.56px",
            minHeight: "80px",
            gap: "12px",
            paddingRight: "20px",
            paddingLeft: "20px",
            paddingBottom: "13px",
          }}
        >
          {CATEGORIES.map(({ id, label, image }) => {
            const isActive = activeCategory === id;
            return (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className="flex flex-col items-center gap-1 relative transition-all"
                style={{ minWidth: "72px" }}
              >
                {/* Icon container: width:72 · height:75.56 · pb:1 */}
                <div
                  className="flex flex-col items-center justify-end"
                  style={{
                    width: "72px",
                    height: "75.56px",
                    paddingBottom: "1px",
                  }}
                >
                  <span
                    style={{
                      color: isActive ? "#00462C" : "#6B7280",
                      transition: "color 0.2s",
                    }}
                  >
                    <Image src={image} alt={label} width={48} height={48} />
                   
                  </span>
                  <span
                    className="text-xs font-medium mt-1"
                    style={{
                      color: isActive ? "#00462C" : "#6B7280",
                      transition: "color 0.2s",
                    }}
                  >
                    {label}
                  </span>
                </div>

                {/* Active underline */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-200"
                  style={{
                    height: "2.5px",
                    width: isActive ? "100%" : "0%",
                    background: "#00462C",
                    borderRadius: "2px",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-gray-200 mx-5" />

        {/* ── All Products Title Row ── */}
        {/* width:1278 · height:36 · gap:16 */}
        <div
          className="flex items-center justify-between mx-auto mt-6 mb-5"
          style={{
            width: "1440px",
            maxWidth: "100%",
            height: "36px",
            gap: "16px",
          }}
        >
          <h2 className="font-bold text-[#00462C]" style={{ fontSize: "22px" }}>
            {activeCategory === "all"
              ? "All Products"
              : CATEGORIES.find((c) => c.id === activeCategory)?.label}
          </h2>
          <Link
            href="/products"
            className="font-semibold text-sm hover:underline transition-colors"
            style={{ color: "#00462C" }}
          >
            View All
          </Link>
        </div>

        {/* ── Product Cards Grid ── */}
        <div
          className="mx-auto flex flex-wrap gap-5 pb-12"
          style={{ maxWidth: "1278px" }}
        >
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-400 text-sm py-10 w-full text-center">
              No products in this category yet.
            </p>
          )}
        </div>

      </div>
    </section>
  );
}