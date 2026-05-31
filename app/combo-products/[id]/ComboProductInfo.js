"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";
import useToastStore from "@/store/toastStore";
import { requireLoginForAction } from "@/utils/clientAuthGuard";

const CartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

const money = (value) => `NPR ${Number(value || 0).toFixed(0)}`;

function splitCodes(value) {
  return String(value || "")
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);
}

export default function ComboProductInfo({ combo }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const setCheckoutItem = useCheckoutStore((state) => state.setCheckoutItem);
  const showToast = useToastStore((state) => state.showToast);
  const productCodes = splitCodes(combo.productCodes);
  const comboItems = Array.isArray(combo.comboItems) ? combo.comboItems : [];
  const savedAmount = Math.max(0, Number(combo.productPrices || 0) - Number(combo.comboPrice || 0));
  const comboStockQuantity = Number(
    combo.comboStockQuantity ??
      (comboItems.length
        ? Math.min(...comboItems.map((item) => Number(item.stockQuantity ?? 0)))
        : 0),
  );
  const outOfStock =
    combo.comboOutOfStock === true ||
    comboStockQuantity <= 0 ||
    comboItems.some((item) => Number(item.stockQuantity ?? 0) <= 0);
  const unavailableItems = comboItems.filter(
    (item) => Number(item.stockQuantity ?? 0) <= 0,
  );

  const handleAdd = () => {
    if (!requireLoginForAction()) {
      showToast("Please login to add combo to cart");
      return;
    }
    if (outOfStock) {
      showToast("This combo is out of stock because one or more items are unavailable");
      return;
    }

    addToCart({
      id: `combo-${combo.id}`,
      name: combo.name,
      price: Number(combo.comboPrice || 0),
      image: combo.image,
      qty,
      weight: "Combo Pack",
      type: "combo",
      comboProductId: combo.id,
    });
    showToast(`${combo.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleBuyNow = () => {
    if (!requireLoginForAction()) {
      showToast("Please login to buy this combo");
      return;
    }
    if (outOfStock) {
      showToast("This combo is out of stock because one or more items are unavailable");
      return;
    }

    setBuying(true);
    setCheckoutItem({
      id: Number(combo.id),
      comboProductId: Number(combo.id),
      type: "combo",
      name: combo.name,
      image: combo.image || "/no-image.png",
      weight: "Combo Pack",
      qty,
      unitPrice: Number(combo.comboPrice || 0),
      total: Number(combo.comboPrice || 0) * qty,
    });
    showToast("Combo added to checkout");
    router.push("/Checkout");
  };

  return (
    <div className="product-info-panel flex flex-col gap-5 flex-1 min-w-full lg:min-w-50">
      <div>
        <h1 className="font-bold text-gray-900" style={{ fontSize: "clamp(18px, 3vw, 24px)", lineHeight: 1.2 }}>{combo.name}</h1>
        <p className="text-sm text-gray-500 mt-2">{combo.description || "Curated Nityagro combo pack with authentic goodness."}</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Combo Pack</span>
        <span className="text-xs text-gray-500">{productCodes.length} item{productCodes.length !== 1 ? "s" : ""} included</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${outOfStock ? "bg-red-50 text-red-700 border-red-100" : "bg-green-50 text-green-700 border-green-100"}`}>
          {outOfStock ? "Out of Stock" : `${comboStockQuantity} combo${comboStockQuantity !== 1 ? "s" : ""} available`}
        </span>
      </div>

      <p className="font-bold" style={{ color: "#00462C", fontSize: "clamp(18px, 3vw, 22px)" }}>
        {money(combo.comboPrice)}
        {savedAmount > 0 ? <span className="text-gray-400 line-through text-base ml-2">{money(combo.productPrices)}</span> : null}
      </p>

      {savedAmount > 0 ? <p className="text-sm font-semibold text-orange-500">You save {money(savedAmount)}</p> : null}

      <div className="border-t border-gray-200" />

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-700">Included Products</p>
        <div className="flex flex-wrap gap-2">
          {comboItems.length > 0 ? comboItems.map((item) => (
            <span key={item.code} className={`text-xs font-semibold px-3 py-1 rounded-full border ${Number(item.stockQuantity ?? 0) <= 0 ? "bg-red-50 text-red-700 border-red-100" : "bg-gray-50 text-gray-700 border-gray-200"}`}>
              {item.name}
              <span className="ml-1 font-medium">
                ({Number(item.stockQuantity ?? 0) <= 0 ? "Out of stock" : `${item.stockQuantity} left`})
              </span>
            </span>
          )) : productCodes.length > 0 ? productCodes.map((code) => (
            <span key={code} className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200">{code}</span>
          )) : <span className="text-sm text-gray-400">Combo items configured by admin</span>}
        </div>
        {unavailableItems.length > 0 ? (
          <p className="text-xs text-red-600">
            Unavailable: {unavailableItems.map((item) => item.name).join(", ")}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-700">Quantity</p>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden" style={{ width: "110px", height: "40px" }}>
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex items-center justify-center flex-1 h-full hover:bg-gray-100 transition-colors text-gray-600"><MinusIcon /></button>
          <span className="flex items-center justify-center font-semibold text-sm text-gray-800 border-x border-gray-300 h-full" style={{ width: "36px" }}>{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(comboStockQuantity || 1, q + 1))} disabled={outOfStock || qty >= comboStockQuantity} className="flex items-center justify-center flex-1 h-full hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-40"><PlusIcon /></button>
        </div>
        {outOfStock ? (
          <p className="text-xs font-semibold text-red-600">
            This combo cannot be ordered until all included variations are in stock.
          </p>
        ) : null}
      </div>

      <div className="flex gap-3">
        <button onClick={handleAdd} disabled={outOfStock} className="flex items-center justify-center gap-2 text-white font-semibold text-sm rounded-md transition-all duration-200 hover:scale-105 active:scale-95 flex-1 sm:flex-none disabled:hover:scale-100 disabled:cursor-not-allowed" style={{ background: outOfStock ? "#9CA3AF" : added ? "#2d7a4f" : "#00462C", height: "44px", width: "clamp(140px, 40%, 220px)", boxShadow: "0 3px 14px rgba(0,70,44,0.25)" }}>
          <CartIcon /> {added ? "Added!" : "Add"}
        </button>
        <button onClick={handleBuyNow} disabled={buying || outOfStock} className="flex items-center justify-center font-semibold text-sm rounded-md border-2 transition-all duration-200 hover:bg-gray-50 active:scale-95 flex-1 sm:flex-none disabled:opacity-60 disabled:cursor-not-allowed" style={{ borderColor: outOfStock ? "#9CA3AF" : "#00462C", color: outOfStock ? "#6B7280" : "#00462C", height: "44px", width: "clamp(140px, 40%, 220px)" }}>
          {outOfStock ? "Out of Stock" : buying ? "Placing..." : "Buy Now"}
        </button>
      </div>
    </div>
  );
}
