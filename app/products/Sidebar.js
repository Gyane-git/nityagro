"use client";

import { useState } from "react";

const StarIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#F5A623" : "none"} stroke="#F5A623" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

function StarRow({ count, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4 accent-[#00462C]" />
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <StarIcon key={s} filled={s <= count} />
        ))}
      </div>
    </label>
  );
}

export default function Sidebar({ categories = [], selectedCategories = [], onCategoryChange, onRatingChange, onPriceChange }) {
  const MIN = 0;
  const MAX = 5000;

  const [minPrice, setMinPrice] = useState(500);
  const [maxPrice, setMaxPrice] = useState(2500);

  const [selectedRatings, setSelectedRatings] = useState([]);
  const [localCategories, setLocalCategories] = useState([]);

  const GAP = 500;

  const handleMinChange = (e) => {
    const value = Number(e.target.value);

    const newMin = Math.min(value, maxPrice - GAP);
    setMinPrice(newMin);

    onPriceChange?.({ min: newMin, max: maxPrice });
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);

    const newMax = Math.max(value, minPrice + GAP);
    setMaxPrice(newMax);

    onPriceChange?.({ min: minPrice, max: newMax });
  };

  const toggleRating = (rating) => {
    const updated = selectedRatings.includes(rating) ? selectedRatings.filter((r) => r !== rating) : [...selectedRatings, rating];

    setSelectedRatings(updated);
    onRatingChange?.(updated);
  };

  const toggleCategory = (cat) => {
    const source = selectedCategories.length ? selectedCategories : localCategories;

    const updated = source.includes(cat) ? source.filter((c) => c !== cat) : [...source, cat];

    setLocalCategories(updated);
    onCategoryChange?.(updated);
  };

  const minPct = ((minPrice - MIN) / (MAX - MIN)) * 100;
  const maxPct = ((maxPrice - MIN) / (MAX - MIN)) * 100;

  return (
    <aside className="w-full md:w-[190px]">
      {/* PRICE FILTER */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 mb-3 text-[14px]">Filter by Price</h3>

        <div className="relative h-[20px]">
          {/* track */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-[4px] bg-gray-200 rounded-full" />

          {/* active track */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-[4px] bg-[#00462C] rounded-full"
            style={{
              left: `${minPct}%`,
              right: `${100 - maxPct}%`,
            }}
          />

          {/* MIN SLIDER */}
          <input type="range" min={MIN} max={MAX} step={10} value={minPrice} onChange={handleMinChange} className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent z-30" />

          {/* MAX SLIDER */}
          <input type="range" min={MIN} max={MAX} step={10} value={maxPrice} onChange={handleMaxChange} className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent z-20" />
        </div>

        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>
            Min: <b className="text-gray-900">NPR {minPrice.toLocaleString()}</b>
          </span>
          <span>
            Max: <b className="text-gray-900">NPR {maxPrice.toLocaleString()}</b>
          </span>
        </div>
      </div>

      <div className="border-t mb-5" />

      {/* CATEGORIES */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 mb-3 text-[14px]">Categories</h3>

        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => {
            const value = cat.categoryName;

            return (
              <label key={value} className="flex items-center gap-2">
                <input type="checkbox" checked={(selectedCategories.length ? selectedCategories : localCategories).includes(value)} onChange={() => toggleCategory(value)} className="accent-[#00462C]" />
                <span className="text-sm text-gray-700">{value}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="border-t mb-5" />

      {/* RATINGS */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 text-[14px]">Sort by ratings</h3>

        <div className="flex flex-col gap-2.5 mb-50">
          {[5, 4, 3, 2, 1].map((r) => (
            <StarRow key={r} count={r} checked={selectedRatings.includes(r)} onChange={() => toggleRating(r)} />
          ))}
        </div>
      </div>

      {/* THUMB STYLES */}
      <style>{`
        input[type="range"] {
          pointer-events: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          pointer-events: all;
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00462C;
          border: 2px solid white;
          cursor: pointer;
        }

        input[type="range"]::-moz-range-thumb {
          pointer-events: all;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00462C;
          border: 2px solid white;
          cursor: pointer;
        }
      `}</style>
    </aside>
  );
}
