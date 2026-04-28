"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const CartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 24 24"
    fill={filled ? "#F5A623" : "none"} stroke="#F5A623" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const PRODUCTS = [
  { id: 1, name: "Yellow Mustard Oil",    price: 250, rating: 4, reviews: 711, badge: "Best Seller", discount: "BES\n30%\nOFF", image: "/products/mustard-oil.png" },
  { id: 2, name: "Red Chilli Powder",     price: 250, rating: 4, reviews: 711, badge: null,          discount: null,            image: "/products/red-chilli.png" },
  { id: 3, name: "Gran (Chickpea) Flour", price: 250, rating: 3, reviews: 711, badge: null,          discount: "BES\n30%\nOFF", image: "/products/chickpea-flour.png" },
  { id: 4, name: "Jaggery Powder",        price: 250, rating: 3, reviews: 711, badge: "Best Seller", discount: null,            image: "/products/jaggery.png" },
  { id: 5, name: "Red Chilli Powder",     price: 250, rating: 3, reviews: 711, badge: null,          discount: null,            image: "/products/red-chilli-2.png" },
];

function ProductCard({ product }) {
  const [added, setAdded] = useState(false);

  return (
    <div
      className="relative flex flex-col bg-white border border-gray-200 overflow-hidden flex-shrink-0"
      style={{
        width: "190px",
        borderRadius: "8px",
        borderWidth: "1px",
      }}
    >
      {/* Discount badge */}
      {product.discount && (
        <div
          className="absolute top-0 left-0 z-10 flex items-center justify-center text-center text-white font-bold leading-tight"
          style={{
            background: "#00462C",
            width: "44px",
            minHeight: "52px",
            borderBottomRightRadius: "8px",
            fontSize: "9px",
            padding: "5px 3px",
            whiteSpace: "pre-line",
          }}
        >
          {product.discount}
        </div>
      )}

      {/* Best Seller badge */}
      {product.badge && (
        <div
          className="absolute top-2 right-0 z-10 text-white font-semibold px-2 py-1"
          style={{
            background: "#F5A623",
            fontSize: "10px",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
          }}
        >
          {product.badge}
        </div>
      )}

      <Link href={`/products/${product.id}`} className="flex flex-col">
        {/* Image */}
        <div
          className="relative w-full bg-gray-50"
          style={{ height: "160px", flexShrink: 0 }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-3"
            sizes="190px"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col px-3 pt-2 gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon key={s} filled={s <= product.rating} />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
          </div>
          <p
            className="text-gray-800 font-medium leading-snug"
            style={{ fontSize: "13px" }}
          >
            {product.name}
          </p>
          <p className="font-bold text-gray-900" style={{ fontSize: "14px" }}>
            NPR {product.price}
          </p>
        </div>
      </Link>

      <div className="px-3 pb-3">
        <button
          onClick={() => {
            setAdded(true);
            setTimeout(() => setAdded(false), 1400);
          }}
          className="mt-1 w-full flex items-center justify-center gap-1.5 text-white font-semibold py-2 rounded transition-all duration-200 active:scale-95"
          style={{
            background: added ? "#2d7a4f" : "#00462C",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        >
          <CartIcon />
          {added ? "Added!" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default function FrequentlyBoughtTogether() {
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold" style={{ color: "#00462C", fontSize: "20px" }}>
          Frequently Bought Together
        </h2>
        <Link href="/products" className="text-sm font-semibold" style={{ color: "#00462C" }}>
          View All
        </Link>
      </div>

      {/* Cards — horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}