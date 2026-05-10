"use client";

import Link from "next/link";
import { useState } from "react";
import Banner from "./Banner";
import Sidebar from "./Sidebar";
import ProductList from "./ProductList";
import { ALL_PRODUCTS } from "./productsData";

// ─── Breadcrumb ─────────────────────────────────────
function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4">
      <Link href="/">Home</Link>
      <span>›</span>
      <span className="font-semibold text-gray-700">Products</span>
    </nav>
  );
}

// ─── Filter Icon ───────────────────────────────────
const FilterIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 5h18M6 10h12M10 15h4" />
  </svg>
);

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(ALL_PRODUCTS);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });

  const [filterOpen, setFilterOpen] = useState(false);

  const applyFilters = ({
    categories = selectedCategories,
    ratings = selectedRatings,
    price = priceRange,
  }) => {
    let result = ALL_PRODUCTS;

    if (categories.length) {
      result = result.filter((p) => categories.includes(p.category));
    }

    if (ratings.length) {
      result = result.filter((p) => ratings.includes(p.rating));
    }

    result = result.filter((p) => p.price >= price.min && p.price <= price.max);

    setFilteredProducts(result);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-360 mx-auto px-4 sm:px-6 py-4">
        {/* Banner */}
        <Banner />

        {/* Title row (mobile like screenshot) */}
        <div className="mt-5 flex items-center justify-between">
          <div>
            <h1 className="text-[#00462C] font-bold text-xl">Products</h1>
            <div className="w-10 h-0.75 bg-[#00462C] mt-1 rounded" />
          </div>

          {/* FILTER BUTTON (mobile only) */}
          <button
            onClick={() => setFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 border px-3 py-2 rounded-md text-sm text-[#00462C] border-[#00462C]"
          >
            <FilterIcon />
            Filter
          </button>
        </div>

        {/* Items count */}
        <p className="hidden lg:block text-sm text-gray-600 mt-3 mb-4">
          Items 1 - {filteredProducts.length} of{" "}
          <span className="font-bold">{filteredProducts.length}</span>
        </p>

        {/* Layout */}
        <div className="flex gap-6">
          {/* DESKTOP SIDEBAR */}
          <div className="hidden lg:block w-55">
            <Sidebar
              onCategoryChange={(c) => {
                setSelectedCategories(c);
                applyFilters({ categories: c });
              }}
              onRatingChange={(r) => {
                setSelectedRatings(r);
                applyFilters({ ratings: r });
              }}
              onPriceChange={(p) => {
                setPriceRange(p);
                applyFilters({ price: p });
              }}
            />
          </div>

          {/* PRODUCTS */}
          <div className="flex-1">
            <ProductList products={filteredProducts} />
          </div>
        </div>
      </div>

      {/* ───────── MOBILE FILTER DRAWER ───────── */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          filterOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* overlay */}
        <div
          className="absolute inset-0"
          onClick={() => setFilterOpen(false)}
        />

        {/* drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-[85%] sm:w-[400px] bg-white shadow-xl flex flex-col
    transform transition-transform duration-300 ease-in-out
    ${filterOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="font-bold text-[#00462C] text-lg">Filters</h2>

            <button
              onClick={() => setFilterOpen(false)}
              className="text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>

          {/* content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <Sidebar
              onCategoryChange={(c) => {
                setSelectedCategories(c);
                applyFilters({ categories: c });
              }}
              onRatingChange={(r) => {
                setSelectedRatings(r);
                applyFilters({ ratings: r });
              }}
              onPriceChange={(p) => {
                setPriceRange(p);
                applyFilters({ price: p });
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
