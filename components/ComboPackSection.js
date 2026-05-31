"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiGetRequest } from "@/apihelper/apiHelper";

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

const money = (value) => `NPR ${Number(value || 0).toFixed(0)}`;

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "/no-image.png";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
}

function getMainImage(combo) {
  const images = Array.isArray(combo.productImages) ? combo.productImages : [];
  return images.find((image) => image.isMain)?.imageUrl || images[0]?.imageUrl || "";
}

function getProductCodes(combo) {
  return String(combo.productCodes || "")
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);
}

function getComboStock(combo) {
  if (combo.comboStockQuantity !== undefined && combo.comboStockQuantity !== null) {
    return Number(combo.comboStockQuantity || 0);
  }

  const items = Array.isArray(combo.comboItems) ? combo.comboItems : [];
  if (!items.length) return 0;
  return Math.min(...items.map((item) => Number(item.stockQuantity ?? 0)));
}

function isComboOutOfStock(combo) {
  return combo.comboOutOfStock === true || getComboStock(combo) <= 0;
}

function StarRating({ rating = 4, reviews = 0 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={star <= rating} />
      ))}
      <span className="text-xs text-gray-500 ml-1">({reviews})</span>
    </div>
  );
}

function ComboCard({ combo }) {
  const image = resolveImageUrl(getMainImage(combo));
  const productCodes = getProductCodes(combo);
  const savedAmount = Math.max(0, Number(combo.productPrices || 0) - Number(combo.comboPrice || 0));
  const outOfStock = isComboOutOfStock(combo);

  return (
    <div className="relative flex flex-col w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
      {savedAmount > 0 ? (
        <div className="absolute top-0 left-0 z-10 text-white font-bold text-center bg-[#00462C] w-13 min-h-14 rounded-br-lg text-[10px] px-1 py-1 leading-tight">
          SAVE<br />{money(savedAmount).replace("NPR ", "Rs ")}
        </div>
      ) : null}

      <div className="absolute top-3 right-0 z-10 text-white text-xs px-2 py-1 bg-[#F5A623] rounded-l">
        {outOfStock ? "Out of Stock" : "Combo"}
      </div>

      <Link href={`/combo-products/${combo.comboProductId}`} className="flex flex-col">
        <div className="relative w-full bg-gray-50 h-40">
          <img src={image} alt={combo.comboName || "Combo pack"} onError={(event) => (event.currentTarget.src = "/no-image.png")} className="w-full h-full object-contain p-3" />
          {outOfStock ? (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                Out of Stock
              </span>
            </div>
          ) : null}
        </div>

        <div className="px-3 pt-2 pb-1 overflow-hidden h-25">
          <StarRating rating={4} reviews={productCodes.length} />
          <p className="text-sm font-medium text-gray-800 line-clamp-2 mt-1 leading-snug">{combo.comboName}</p>
          <p className="text-xs text-gray-500 line-clamp-1 mt-1">{productCodes.length} item{productCodes.length !== 1 ? "s" : ""} included</p>
          {outOfStock ? <p className="text-xs font-semibold text-red-600 mt-1">One or more combo items are unavailable</p> : null}
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm font-bold text-gray-900">{money(combo.comboPrice)}</p>
            {savedAmount > 0 ? <p className="text-xs text-gray-400 line-through">{money(combo.productPrices)}</p> : null}
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3 pt-1">
        <Link href={`/combo-products/${combo.comboProductId}`} className={`w-full py-2 rounded text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${outOfStock ? "bg-gray-500 hover:bg-gray-600" : "bg-[#00462C] hover:bg-[#0b5a3b]"}`}>
          <CartIcon /> View Combo
        </Link>
      </div>
    </div>
  );
}

export default function ComboPackSection() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      setLoading(true);
      try {
        const response = await apiGetRequest("/combo-products");
        const rows = response.success && Array.isArray(response.data) ? response.data : [];
        setCombos(rows.filter((combo) => combo.comboStatus !== false));
      } catch (error) {
        console.error(error);
        setCombos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

  const visibleCombos = useMemo(() => combos.slice(0, 5), [combos]);
  const wrapperClass = "mx-auto w-full max-w-340 px-4 sm:px-6 lg:px-8";

  return (
    <section className="w-full bg-white">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className={wrapperClass}>
        <div className="flex flex-col items-center text-center pt-8 sm:pt-10 lg:pt-11.25 pb-4 gap-1">
          <h1 className="font-bold text-xl sm:text-2xl lg:text-[32px] leading-tight tracking-[0.6px] text-[#235A49]" style={{ fontFamily: "Roboto Slab" }}>
            Traditional Combo Packs
          </h1>
          <p className="font-normal text-lg sm:text-xl lg:text-[32px] leading-tight tracking-[0.6px] text-[#235A49]" style={{ fontFamily: "Roboto Slab" }}>
            Authentic Goodness in Every Bundle
          </p>
        </div>

        <div className="w-full max-w-340 flex flex-col">
          <div className="flex items-center justify-between mt-4 mb-3 px-4">
            <h2 className="font-bold text-lg sm:text-xl lg:text-[22px] text-[#00462C]">Traditional Combo Packs</h2>
            <div className="flex-1 border-t-2 border-gray-300 mx-5" />
            <Link href="/combo-products" className="font-semibold text-sm hover:underline text-[#00462C]">
              View All
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-400 text-sm py-10 w-full text-center px-4">Loading combo packs...</p>
          ) : visibleCombos.length > 0 ? (
            <>
              <div className="lg:hidden overflow-x-auto scrollbar-hide pb-6 px-4">
                <div className="flex gap-3" style={{ width: "max-content" }}>
                  {visibleCombos.map((combo) => (
                    <div key={combo.comboProductId} className="shrink-0 w-40">
                      <ComboCard combo={combo} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:grid lg:grid-cols-5 gap-4 px-4 pb-8">
                {visibleCombos.map((combo) => (
                  <div key={combo.comboProductId} className="w-full h-90">
                    <ComboCard combo={combo} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-sm py-10 w-full text-center px-4">No combo packs available yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
