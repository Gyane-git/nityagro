"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Banner from "./Banner";
import Sidebar from "./Sidebar";
import ProductList from "./ProductList";
import { apiGetRequest } from "@/apihelper/apiHelper";
import { X } from "lucide-react";

// ─── Filter Icon ───────────────────────────────────
const FilterIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 5h18M6 10h12M10 15h4" />
  </svg>
);

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productResponse, categoryResponse] = await Promise.all([apiGetRequest("/products"), apiGetRequest("/categories")]);

        const productRows = Array.isArray(productResponse?.data) ? productResponse.data : [];
        const categoryRows = Array.isArray(categoryResponse?.data) ? categoryResponse.data : [];

        const activeCategories = categoryRows.filter((category) => category.categoryStatus !== false);

        const mapped = productRows
          .filter((item) => item.productStatus !== false)
          .map((item) => ({
            id: Number(item.productId),
            name: item.subGroupName || item.productName || "Unnamed Product",
            category: item.categoryId || "",
            price: Number(item.sellingPrice ?? item.actualPrice ?? 0),
            image: item.pImage || "/products/mustard-oil.png",
            rating: 4,
            reviews: 0,
            badge: item.specialOffer ? "Special Offer" : null,
            discount: item.actualPrice > item.sellingPrice ? `SAVE\n${Math.round(((item.actualPrice - item.sellingPrice) / item.actualPrice) * 100)}%` : null,
            stockQuantity: Number(item.stockQuantity ?? item.availableQuantity ?? 0),
            availableQuantity: Number(item.availableQuantity ?? item.stockQuantity ?? 0),
          }));

        setProducts(mapped);
        setCategories(activeCategories);
        const queryFromUrl = String(searchParams.get("query") || "").trim().toLowerCase();
        const categoryFromQuery = searchParams.get("category");
        if (queryFromUrl) {
          setFilteredProducts(
            mapped.filter((product) =>
              [
                product.name,
                product.category,
                String(product.id || ""),
              ]
                .join(" ")
                .toLowerCase()
                .includes(queryFromUrl),
            ),
          );
        } else if (categoryFromQuery) {
          const selected = [categoryFromQuery];
          setSelectedCategories(selected);
          const preFiltered = mapped.filter((p) => selected.includes(p.category));
          setFilteredProducts(preFiltered);
        } else {
          setFilteredProducts(mapped);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const totalItems = useMemo(() => filteredProducts.length, [filteredProducts]);

  const applyFilters = ({ categories = selectedCategories, ratings = selectedRatings, price = priceRange }) => {
    let result = products;

    if (categories.length) {
      result = result.filter((p) => categories.includes(p.category));
    }

    if (ratings.length) {
      result = result.filter((p) => ratings.includes(p.rating));
    }

    result = result.filter((p) => p.price >= price.min && p.price <= price.max);

    setFilteredProducts(result);
  };

  const selectedCategoryDetail = useMemo(() => {
    if (selectedCategories.length !== 1) {
      return null;
    }
    return categories.find((category) => category.categoryName === selectedCategories[0]) || null;
  }, [categories, selectedCategories]);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-360 mx-auto px-4 sm:px-6 py-4">
        {/* Banner */}
        <Banner image={selectedCategoryDetail?.categoryBanner || "/banner1.jpg"} title={selectedCategoryDetail?.categoryName || "All Products"} />

        {/* Title row (mobile like screenshot) */}
        <div className="mt-5 flex items-center justify-between">
          <div>
            <h1 className="text-[#00462C] font-bold text-xl">Products</h1>
            <div className="w-4/5 h-0.75 bg-[#00462C] mt-1 rounded" />
          </div>

          {/* FILTER BUTTON (mobile only) */}
          <button onClick={() => setFilterOpen(true)} className="lg:hidden flex items-center justify-center gap-2 border px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-sm text-[#00462C] border-[#00462C]">
            <FilterIcon />
            <span className="hidden md:block">Filter</span>
          </button>
        </div>

        {/* Items count */}
        <p className="hidden lg:block text-sm text-gray-600 mt-3 mb-4">
          Items 1 - {totalItems} of <span className="font-bold">{totalItems}</span>
        </p>

        {/* Layout */}
        <div className="flex gap-6">
          {/* DESKTOP SIDEBAR */}
          <div className="hidden lg:block w-55">
            <Sidebar
              categories={categories}
              selectedCategories={selectedCategories}
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
          <div className="flex-1">{loading ? <p className="text-sm text-gray-500">Loading products...</p> : <ProductList products={filteredProducts} />}</div>
        </div>
      </div>

      {/* ───────── MOBILE FILTER DRAWER ───────── */}
      <div className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${filterOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        {/* overlay */}
        <div className="absolute inset-0" onClick={() => setFilterOpen(false)} />

        {/* drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-[85%] sm:w-[400px] bg-white rounded shadow-xl flex flex-col
    transform transition-transform duration-300 ease-in-out
    ${filterOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="font-bold text-[#00462C] text-lg">Filters</h2>

            <button onClick={() => setFilterOpen(false)} className="text-gray-600 hover:text-black text-xl bg-red-400 rounded">
              <X size={20} />
            </button>
          </div>

          {/* content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <Sidebar
              categories={categories}
              selectedCategories={selectedCategories}
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white">
          <div className="max-w-360 mx-auto px-4 sm:px-6 py-4">
            <div className="animate-pulse">
              {/* Header */}
              <div className="h-8 w-48 bg-gray-200 rounded mb-6" />

              {/* Product grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-square bg-gray-200 rounded-lg" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
