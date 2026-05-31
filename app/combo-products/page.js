"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Banner from "@/app/products/Banner";
import { apiGetRequest } from "@/apihelper/apiHelper";

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
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

function ComboCard({ combo }) {
  const image = resolveImageUrl(getMainImage(combo));
  const productCodes = getProductCodes(combo);
  const savedAmount = Math.max(0, Number(combo.productPrices || 0) - Number(combo.comboPrice || 0));
  const outOfStock = isComboOutOfStock(combo);
  const galleryCount = Array.isArray(combo.productImages)
    ? combo.productImages.filter((image) => !image.isMain).length
    : 0;

  return (
    <div className="relative flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
      {savedAmount > 0 ? (
        <div className="absolute top-0 left-0 z-10 text-white font-bold text-center bg-[#00462C] w-13 min-h-14 rounded-br-lg text-[10px] px-1 py-1 leading-tight">
          SAVE<br />{money(savedAmount).replace("NPR ", "Rs ")}
        </div>
      ) : null}

      <div className="absolute top-3 right-0 z-10 text-white text-xs px-2 py-1 bg-[#F5A623] rounded-l">
        {outOfStock ? "Out of Stock" : "Combo"}
      </div>

      <Link href={`/combo-products/${combo.comboProductId}`} className="block relative w-full bg-gray-50 h-44">
        <img src={image} alt={combo.comboName || "Combo pack"} onError={(event) => (event.currentTarget.src = "/no-image.png")} className="w-full h-full object-contain p-3" />
        {outOfStock ? (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
              Out of Stock
            </span>
          </div>
        ) : null}
      </Link>

      <div className="px-3 pt-3 pb-2 flex-1">
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-10">{combo.comboName}</p>
        <p className="text-xs text-gray-500 line-clamp-2 mt-1 min-h-8">{combo.comboDescription || `${productCodes.length} products bundled for better value.`}</p>
        {outOfStock ? <p className="text-xs font-semibold text-red-600 mt-1">One or more combo items are unavailable</p> : null}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {productCodes.slice(0, 3).map((code) => (
            <span key={code} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{code}</span>
          ))}
          {productCodes.length > 3 ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">+{productCodes.length - 3}</span> : null}
        </div>
        {galleryCount > 0 ? <p className="text-[11px] text-gray-400 mt-2">{galleryCount} gallery image{galleryCount !== 1 ? "s" : ""}</p> : null}
        <div className="flex items-center gap-2 mt-2">
          <p className="text-sm font-bold text-gray-900">{money(combo.comboPrice)}</p>
          {savedAmount > 0 ? <p className="text-xs text-gray-400 line-through">{money(combo.productPrices)}</p> : null}
        </div>
      </div>

      <div className="px-3 pb-3">
        <Link href={`/combo-products/${combo.comboProductId}`} className={`w-full py-2 rounded text-white font-semibold flex items-center justify-center gap-1.5 text-sm ${outOfStock ? "bg-gray-500 hover:bg-gray-600" : "bg-[#00462C] hover:bg-[#0b5a3b]"}`}>
          <CartIcon /> View Combo
        </Link>
      </div>
    </div>
  );
}

export default function ComboProductsPage() {
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

  const totalItems = useMemo(() => combos.length, [combos]);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-360 mx-auto px-4 sm:px-6 py-4">
        <Banner image="/banner1.jpg" title="Combo Packs" />

        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[#00462C] font-bold text-xl">Traditional Combo Packs</h1>
            <div className="w-10 h-0.75 bg-[#00462C] mt-1 rounded" />
          </div>
          <p className="text-sm text-gray-600 whitespace-nowrap">{totalItems} combo{totalItems !== 1 ? "s" : ""}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3 mb-5">
          <Link href="/products" className="inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-semibold border text-[#00462C] border-[#00462C]">
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="border border-gray-200 rounded-xl p-10 text-center bg-gray-50 text-gray-500">Loading combo packs...</div>
        ) : combos.length === 0 ? (
          <div className="border border-gray-200 rounded-xl p-10 text-center bg-gray-50">
            <p className="text-gray-500 mb-1">No combo packs available.</p>
            <p className="text-xs text-gray-400 mb-4">Please check back soon for curated value bundles.</p>
            <Link href="/products" className="inline-flex items-center justify-center px-5 py-2 rounded-md text-white font-semibold bg-[#00462C]">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 pb-6">
            {combos.map((combo) => (
              <ComboCard key={combo.comboProductId} combo={combo} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
