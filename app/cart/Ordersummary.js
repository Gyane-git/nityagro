"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PromoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const DELIVERY_OPTIONS = [
  "Standard Delivery — NPR 200",
  "Express Delivery — NPR 500",
  "Free Delivery (above NPR 2000)",
];

export default function OrderSummary() {
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [delivery, setDelivery] = useState("");

  const router = useRouter();

  const itemsTotal   = 1250;
  const discount     = 350;
  const deliveryFee  = 200;
  const total        = itemsTotal - discount + deliveryFee;

  const handleApply = () => {
    if (promo.trim()) setPromoApplied(true);
  };

  return (
    <div
      className="flex flex-col border border-gray-200 rounded-xl bg-white p-6 gap-5"
      style={{ width: "340px", flexShrink: 0, alignSelf: "flex-start" }}
    >
      {/* ── Title ── */}
      <div className="flex flex-col gap-1.5">
        <h2 className="font-bold text-gray-900" style={{ fontSize: "20px" }}>
          Order Summary
        </h2>
        {/* Green underline */}
        <div
          style={{ width: "80px", height: "2.5px", background: "#00462C", borderRadius: "2px" }}
        />
      </div>

      {/* ── Promo code row ── */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 flex-1"
          style={{ height: "44px" }}
        >
          <PromoIcon />
          <input
            type="text"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="Enter Promo code"
            className="flex-1 text-sm outline-none text-gray-600 placeholder-gray-400 bg-transparent"
          />
        </div>
        <button
          onClick={handleApply}
          className="text-white font-semibold text-sm rounded-lg transition-all hover:opacity-90 active:scale-95"
          style={{
            background: "#00462C",
            height: "44px",
            width: "72px",
            flexShrink: 0,
          }}
        >
          Apply
        </button>
      </div>
      {promoApplied && (
        <p className="text-xs font-semibold -mt-3" style={{ color: "#00462C" }}>
          ✓ Promo code applied!
        </p>
      )}

      {/* ── Line items ── */}
      <div className="flex flex-col gap-3">
        {/* Items total */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Item(s) total</span>
          <span className="text-sm font-semibold text-gray-800">
            NPR {itemsTotal.toLocaleString()}.00
          </span>
        </div>

        {/* Discount */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Discount</span>
          <span className="text-sm font-semibold" style={{ color: "#EF4444" }}>
            - NPR {discount.toLocaleString()}.00
          </span>
        </div>

        {/* Delivery Charge */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Delivery Charge</span>
          <span className="text-sm font-semibold text-gray-800">
            NRP {deliveryFee.toLocaleString()}.00
          </span>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-gray-200" />

      {/* ── Total Amount ── */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-900" style={{ fontSize: "15px" }}>
          Total Amount
        </span>
        <span className="font-bold" style={{ color: "#00462C", fontSize: "16px" }}>
          NRP {total.toLocaleString()}.00
        </span>
      </div>

      {/* ── Delivery dropdown ── */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-800">Delivery</label>
        <div
          className="relative border border-gray-200 rounded-lg px-3 flex items-center"
          style={{ height: "44px" }}
        >
          <select
            value={delivery}
            onChange={(e) => setDelivery(e.target.value)}
            className="w-full text-sm text-gray-500 bg-transparent outline-none appearance-none cursor-pointer pr-6"
          >
            <option value="" disabled>Choose delivery option</option>
            {DELIVERY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDownIcon />
          </div>
        </div>
      </div>

      {/* ── Proceed to Checkout ── */}
      <button
        className="w-full flex items-center justify-center text-white font-bold text-sm rounded-lg transition-all hover:opacity-90 active:scale-95"
        style={{
          background: "#00462C",
          height: "48px",
          boxShadow: "0 4px 16px rgba(0,70,44,0.25)",
        }}
        onClick={() => router.push("/Checkout")}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}