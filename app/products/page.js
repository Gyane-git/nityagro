"use client";

import { useState } from "react";
import Banner from "./Banner";
import Sidebar from "./Sidebar";
import ProductList from "./ProductList";

// ─── Breadcrumb ────────────────────────────────────────────────────────────
function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 mb-5">
      <a href="/" className="hover:text-[#00462C] transition-colors">
        Home
      </a>
      <span className="text-gray-400">›</span>
      <span className="font-semibold text-gray-700">Products</span>
    </nav>
  );
}

// ─── All mock products (same as ProductList internal data) ─────────────────
const BASE = [
  { name: "Red Chilli Powder",     category: "Spices",  image: "/products/red-chilli.png",     badge: "Best Seller", discount: "BES\n30%\nOFF", price: 250, rating: 4, reviews: 711 },
  { name: "Gran (Chickpea) Flour", category: "Flours",  image: "/products/chickpea-flour.png", badge: null,          discount: "BES\n30%\nOFF", price: 250, rating: 4, reviews: 711 },
  { name: "Jaggery Powder",        category: "Jaggery", image: "/products/jaggery.png",        badge: "Best Seller", discount: null,            price: 250, rating: 3, reviews: 711 },
  { name: "Red Chilli Powder",     category: "Spices",  image: "/products/red-chilli-2.png",   badge: null,          discount: null,            price: 250, rating: 4, reviews: 711 },
];

const ALL_PRODUCTS = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  ...BASE[i % BASE.length],
}));

// ─── Page ──────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(ALL_PRODUCTS);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });

  const applyFilters = ({
    categories = selectedCategories,
    ratings = selectedRatings,
    price = priceRange,
  }) => {
    let result = ALL_PRODUCTS;

    if (categories.length > 0) {
      result = result.filter((p) => categories.includes(p.category));
    }
    if (ratings.length > 0) {
      result = result.filter((p) => ratings.includes(p.rating));
    }
    result = result.filter(
      (p) => p.price >= price.min && p.price <= price.max
    );

    setFilteredProducts(result);
  };

  const handleCategoryChange = (cats) => {
    setSelectedCategories(cats);
    applyFilters({ categories: cats });
  };

  const handleRatingChange = (ratings) => {
    setSelectedRatings(ratings);
    applyFilters({ ratings });
  };

  const handlePriceChange = (price) => {
    setPriceRange(price);
    applyFilters({ price });
  };

  return (
    <main className="min-h-screen bg-white">
      <div
        className="mx-auto px-6 py-6"
        style={{ maxWidth: "1440px" }}
      >
        {/* ── Banner ── */}
        <Banner />

        {/* ── Page Title ── */}
        <div className="mt-7 mb-1">
          <h1
            className="font-bold"
            style={{ color: "#00462C", fontSize: "22px" }}
          >
            Products
          </h1>
          {/* Green underline */}
          <div
            className="mt-1"
            style={{
              width: "48px",
              height: "3px",
              background: "#00462C",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* ── Breadcrumb ── */}
        <div className="mt-4">
          <Breadcrumb />
        </div>

        {/* ── Sidebar + Product Grid ── */}
        <div className="flex gap-8 items-start">
          {/* Sidebar */}
          <Sidebar
            onCategoryChange={handleCategoryChange}
            onRatingChange={handleRatingChange}
            onPriceChange={handlePriceChange}
          />

          {/* Vertical divider */}
          <div
            className="flex-shrink-0 self-stretch"
            style={{ width: "1px", background: "#E5E7EB" }}
          />

          {/* Product list */}
          <ProductList products={filteredProducts} />
        </div>
      </div>
    </main>
  );
}