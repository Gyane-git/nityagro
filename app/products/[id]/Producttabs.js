"use client";

import { useState } from "react";

const TABS = ["Product Details", "Nutritional Information", "Cooking instructions/ Usage", "Storage Instructions"];

const getTabContent = (product) => ({
  "Product Details": product?.productDescription?.trim() || "No product details available.",
  "Nutritional Information": product?.nutritionInfo?.trim() || "No nutritional information available.",
  "Cooking instructions/ Usage": product?.cookingInstruction?.trim() || "No cooking instruction available.",
  "Storage Instructions": product?.storageInstruction?.trim() || "No storage instruction available.",
});

export default function ProductTabs({ product }) {
  const [active, setActive] = useState("Product Details");
  const content = getTabContent(product);

  return (
    <div className="w-full">
      {/* ── Tab row ── */}
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => {
          const isActive = active === tab;
          return (
            <button key={tab} onClick={() => setActive(tab)} className="relative px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors" style={{ color: isActive ? "#00462C" : "#6B7280" }}>
              {tab}
              {isActive && <div className="absolute bottom-0 left-0 right-0" style={{ height: "2.5px", background: "#00462C", borderRadius: "2px 2px 0 0" }} />}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div className="pt-4 sm:pt-6 pb-4">
        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">{content[active]}</div>
      </div>

      <style jsx global>{`
        .tab-scrollbar::-webkit-scrollbar {
          height: 2px;
        }
        .tab-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .tab-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}