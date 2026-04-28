"use client";

import { useState } from "react";

const TABS = [
  "Product Details",
  "Nutritional Information",
  "Cooking instructions/ Usage",
  "Storage Instructions",
];

const CONTENT = {
  "Product Details": (
    <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
      <p>
        Our products are crafted with a deep respect for tradition and purity. Each item is
        processed using time-tested methods such as wood pressing and stone grinding, ensuring
        that the natural integrity of the ingredients remains intact. Unlike industrial
        processing, which often involves high heat and chemical refinement, our approach focuses
        on slow, low-temperature extraction. This helps preserve the original nutrients, aroma,
        and texture of the product.
      </p>
      <p>
        We carefully source raw materials from trusted local farmers, ensuring quality from the
        very beginning. Every batch is produced in controlled quantities to maintain freshness,
        consistency, and authenticity. What you receive is not just a product — but a closer
        connection to natural food, made the way it was meant to be.
      </p>
      <div>
        <p className="font-semibold text-gray-800 mb-2">Key Highlights:</p>
        <ul className="flex flex-col gap-1.5 pl-1">
          {[
            "Traditionally processed for maximum purity",
            "No chemicals, preservatives, or artificial enhancers",
            "Maintains original taste, aroma, and texture",
            "Ethically sourced and responsibly produced",
            "Crafted in small batches for better quality control",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-gray-600">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#374151" }} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),

  "Nutritional Information": (
    <div className="flex flex-col gap-4 text-sm text-gray-700">
      <p className="leading-relaxed">
        Nutritional values per 100g serving. These values may vary slightly depending on
        the batch and seasonal variations in raw materials.
      </p>
      <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ maxWidth: "420px" }}>
        {[
          ["Energy",          "884 kcal"],
          ["Total Fat",       "100g"],
          ["Saturated Fat",   "11.6g"],
          ["Monounsaturated", "59.2g"],
          ["Polyunsaturated", "21.2g"],
          ["Omega-3",         "9.1g"],
          ["Omega-6",         "12.1g"],
          ["Protein",         "0g"],
          ["Carbohydrates",   "0g"],
          ["Sodium",          "0mg"],
        ].map(([k, v], i) => (
          <div
            key={k}
            className="flex justify-between px-4 py-2.5 text-xs border-b border-gray-100 last:border-0"
            style={{ background: i % 2 === 0 ? "white" : "#F9FAFB" }}
          >
            <span className="text-gray-600">{k}</span>
            <span className="font-semibold text-gray-800">{v}</span>
          </div>
        ))}
      </div>
    </div>
  ),

  "Cooking instructions/ Usage": (
    <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
      <p>
        Yellow Mustard Oil has a distinctive pungent aroma and a high smoke point of around
        480°F (250°C), making it ideal for high-heat cooking including deep frying, stir
        frying, and sautéing.
      </p>
      <div>
        <p className="font-semibold text-gray-800 mb-2">Recommended Uses:</p>
        <ul className="flex flex-col gap-1.5 pl-1">
          {[
            "Deep frying pakoras, fish, and snacks",
            "Tempering (tadka) for dals and curries",
            "Marinating meats and vegetables",
            "Pickling — the natural preservative properties are ideal",
            "Massage oil for traditional wellness practices",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-gray-600">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#374151" }} />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-gray-500 italic">
        Note: Heat the oil to smoking point once before use to reduce pungency, if preferred.
      </p>
    </div>
  ),

  "Storage Instructions": (
    <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
      <p>
        To preserve the freshness, flavour, and nutritional quality of this product, please
        follow the storage guidelines below.
      </p>
      <ul className="flex flex-col gap-2 pl-1">
        {[
          "Store in a cool, dry place away from direct sunlight",
          "Keep the bottle tightly sealed after each use",
          "Do not store near heat sources or open flames",
          "Best used within 12 months of manufacture date",
          "Refrigeration is not required but may extend shelf life in hot climates",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-gray-600">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#374151" }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  ),
};

export default function ProductTabs() {
  const [active, setActive] = useState("Product Details");

  return (
    <div className="w-full">
      {/* ── Tab row — underline style, full width border ── */}
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className="relative px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors"
              style={{ color: isActive ? "#00462C" : "#6B7280" }}
            >
              {tab}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: "2.5px",
                    background: "#00462C",
                    borderRadius: "2px 2px 0 0",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div className="pt-6 pb-4">{CONTENT[active]}</div>
    </div>
  );
}