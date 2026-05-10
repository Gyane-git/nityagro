"use client";

import { useState } from "react";

const CATEGORIES = ["Oils", "Flours", "Spices", "Jaggery", "Daliya", "Sattu"];

const StarIcon = ({ filled }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "#F5A623" : "none"}
    stroke="#F5A623"
    strokeWidth="1.5"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

function StarRow({ count, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 accent-[#00462C] cursor-pointer"
      />
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <StarIcon key={s} filled={s <= count} />
        ))}
      </div>
    </label>
  );
}

export default function Sidebar({
  onCategoryChange,
  onRatingChange,
  onPriceChange,
}) {
  const [minPrice, setMinPrice] = useState(500);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  const MIN = 0;
  const MAX = 5000;

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxPrice - 100);
    setMinPrice(val);
    onPriceChange?.({ min: val, max: maxPrice });
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minPrice + 100);
    setMaxPrice(val);
    onPriceChange?.({ min: minPrice, max: val });
  };

  const toggleCategory = (cat) => {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(updated);
    onCategoryChange?.(updated);
  };

  const toggleRating = (rating) => {
    const updated = selectedRatings.includes(rating)
      ? selectedRatings.filter((r) => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(updated);
    onRatingChange?.(updated);
  };

  // slider thumb percent
  const minPct = ((minPrice - MIN) / (MAX - MIN)) * 100;
  const maxPct = ((maxPrice - MIN) / (MAX - MIN)) * 100;

  return (
    <aside className="w-full md:w-[190px]">
      {/* ── Filter by Price ── */}
      <div className="mb-6">
        <h3
          className="font-bold text-gray-800 mb-3"
          style={{ fontSize: "14px" }}
        >
          Filter by Price
        </h3>

        {/* Dual range slider */}
        <div className="relative" style={{ height: "20px" }}>
          {/* Track background */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-full rounded-full"
            style={{ height: "4px", background: "#E5E7EB" }}
          />
          {/* Active track */}
          <div
            className="absolute top-1/2 -translate-y-1/2 rounded-full"
            style={{
              height: "4px",
              left: `${minPct}%`,
              right: `${100 - maxPct}%`,
              background: "#00462C",
            }}
          />
          {/* Min thumb */}
          <input
            type="range"
            min={MIN}
            max={MAX}
            value={minPrice}
            onChange={handleMinChange}
            className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-auto"
            style={{ zIndex: minPrice > MAX - 200 ? 5 : 3 }}
          />
          {/* Max thumb */}
          <input
            type="range"
            min={MIN}
            max={MAX}
            value={maxPrice}
            onChange={handleMaxChange}
            className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-auto"
            style={{ zIndex: 4 }}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-gray-600 font-medium">
          <span>
            Min:{" "}
            <span className="text-gray-800 font-bold">
              NPR {minPrice.toLocaleString()}
            </span>
          </span>
          <span>
            Max:{" "}
            <span className="text-gray-800 font-bold">
              NPR {maxPrice.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-gray-200 mb-5" />

      {/* ── Categories ── */}
      <div className="mb-6">
        <h3
          className="font-bold text-gray-800 mb-3"
          style={{ fontSize: "14px" }}
        >
          Categories
        </h3>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 rounded border-gray-300 accent-[#00462C] cursor-pointer"
              />
              <span className="text-sm text-gray-700">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-gray-200 mb-5" />

      {/* ── Sort by Ratings ── */}
      <div>
        <h3
          className="font-bold text-gray-800 mb-3"
          style={{ fontSize: "14px" }}
        >
          Sort by ratings
        </h3>
        <div className="flex flex-col gap-2.5">
          {[5, 4, 3, 2, 1].map((rating) => (
            <StarRow
              key={rating}
              count={rating}
              checked={selectedRatings.includes(rating)}
              onChange={() => toggleRating(rating)}
            />
          ))}
        </div>
      </div>

      {/* Slider thumb styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00462C;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
          cursor: pointer;
          pointer-events: all;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00462C;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
          cursor: pointer;
        }
      `}</style>
    </aside>
  );
}
