"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/ApisafeCalls";

interface Product {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  price: number;
  actualPrice: number;
  image: string;
  brandName: string;
  available: boolean;
  availableQuantity: number;
  flashSale: boolean;
  todayDeals: boolean;
}

interface Category {
  id: string;
  category: string;
  image: string;
}

function resolveImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return "/yumei_logo.png";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
}

export default function AllProductPage() {
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productsResult = await apiRequest("/products", false);
        const apiProducts = productsResult?.products || [];

        const mappedProducts: Product[] = apiProducts.map((p: any) => ({
          id: p.id,
          title: p.name || "Unnamed Product",
          category: p.categoryName || "Uncategorized",
          categoryId: p.categoryId || "",
          price: Number(p.sellPrice) || 0,
          actualPrice: Number(p.actualPrice) || 0,
          image: p.mainImage || p.images?.[0]?.mainImage || "/yumei_logo.png",
          brandName: p.brandName || "",
          available: Number(p.availableQuantity) > 0,
          availableQuantity: Number(p.availableQuantity) || 0,
          flashSale: p.flashSaleProduct || false,
          todayDeals: p.todayDeals || false,
        }));

        setProducts(mappedProducts);

        // Fetch categories
        const categoriesResult = await apiRequest("/categories", false);
        const apiCategories = categoriesResult?.data?.categories || [];

        const mappedCategories: Category[] = apiCategories.map((c: any) => ({
          id: c.id,
          category: c.category,
          image: c.image || "/yumei_logo.png",
        }));

        setCategories(mappedCategories);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      data = data.filter((p) => p.categoryId === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.brandName.toLowerCase().includes(query)
      );
    }

    // Availability filter
    if (availability === "in") {
      data = data.filter((p) => p.available);
    } else if (availability === "out") {
      data = data.filter((p) => !p.available);
    }

    // Price range filter
    if (priceRange === "low") {
      data = data.filter((p) => p.price <= 5000);
    } else if (priceRange === "mid") {
      data = data.filter((p) => p.price > 5000 && p.price <= 20000);
    } else if (priceRange === "high") {
      data = data.filter((p) => p.price > 20000);
    }

    // Sorting
    if (sortBy === "az") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "za") {
      data.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "priceLow") {
      data.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHigh") {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  }, [products, selectedCategory, searchQuery, availability, priceRange, sortBy]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("featured");
    setPriceRange("all");
    setAvailability("all");
  };

  const activeFilterCount = [
    selectedCategory !== "all",
    priceRange !== "all",
    availability !== "all",
    searchQuery.trim() !== "",
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Skeleton */}
        <div className="h-72 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter bar skeleton */}
          <div className="mb-8 space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex gap-4 overflow-x-auto">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
              ))}
            </div>
          </div>

          {/* Products grid skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-72 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Discover Our Collection
          </h1>
          <p className="text-white/90 text-lg sm:text-xl max-w-2xl">
            Browse through {products.length} amazing products across {categories.length} categories
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products by name, brand, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition text-lg"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        {categories.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Shop by Category
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === "all"
                    ? "bg-orange-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category.id
                      ? "bg-orange-600 text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                  }`}
                >
                  {category.category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter & Sort Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            {/* Desktop Filters */}
            <div className={`${showMobileFilters ? 'flex' : 'hidden lg:flex'} flex-wrap gap-4 flex-1`}>
              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="az">Name: A to Z</option>
                <option value="za">Name: Z to A</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>

              {/* Price Range */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="low">Under Rs. 5,000</option>
                <option value="mid">Rs. 5,000 - Rs. 20,000</option>
                <option value="high">Above Rs. 20,000</option>
              </select>

              {/* Availability */}
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none cursor-pointer"
              >
                <option value="all">All Products</option>
                <option value="in">In Stock Only</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center gap-2 border-2 border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition ${
                  viewMode === "grid" ? "bg-orange-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition ${
                  viewMode === "list" ? "bg-orange-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Results Count & Clear */}
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-sm text-gray-600 font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700 font-semibold underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const discount = product.actualPrice > product.price
                ? Math.round(((product.actualPrice - product.price) / product.actualPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/all-product/${product.id}`)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image
                      src={resolveImageUrl(product.image)}
                      alt={product.title}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {discount > 0 && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-md shadow">
                          {discount}% OFF
                        </span>
                      )}
                      {product.flashSale && (
                        <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-md shadow">
                          ⚡ Flash
                        </span>
                      )}
                      {product.todayDeals && (
                        <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-md shadow">
                          Today
                        </span>
                      )}
                      {!product.available && (
                        <span className="px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded-md shadow">
                          Out
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {product.brandName && (
                      <p className="text-xs font-semibold text-orange-600 mb-1 uppercase tracking-wide">
                        {product.brandName}
                      </p>
                    )}
                    
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors min-h-[40px]">
                      {product.title}
                    </h3>

                    <p className="text-xs text-gray-500 mb-2">{product.category}</p>

                    {/* Pricing */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      {discount > 0 && (
                        <span className="text-xs text-gray-500 line-through">
                          Rs. {product.actualPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Stock Info */}
                    {product.available && product.availableQuantity <= 10 && (
                      <p className="text-xs text-orange-600 font-medium mt-2">
                        Only {product.availableQuantity} left
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const discount = product.actualPrice > product.price
                ? Math.round(((product.actualPrice - product.price) / product.actualPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/all-product/${product.id}`)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex gap-6 p-6">
                    {/* Image */}
                    <div className="relative w-48 h-48 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                      <Image
                        src={resolveImageUrl(product.image)}
                        alt={product.title}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {discount > 0 && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-md shadow">
                            {discount}% OFF
                          </span>
                        )}
                        {product.flashSale && (
                          <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-md shadow">
                            ⚡ Flash Sale
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {product.brandName && (
                          <p className="text-sm font-semibold text-orange-600 mb-2 uppercase tracking-wide">
                            {product.brandName}
                          </p>
                        )}
                        
                        <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                          {product.title}
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">{product.category}</p>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 mb-4">
                          {product.available ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-green-700 font-medium">
                                {product.availableQuantity <= 10 
                                  ? `Only ${product.availableQuantity} left in stock`
                                  : "In Stock"}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-sm text-red-700 font-medium">Out of Stock</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Pricing */}
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-gray-900">
                            Rs. {product.price.toLocaleString()}
                          </span>
                          {discount > 0 && (
                            <>
                              <span className="text-lg text-gray-500 line-through">
                                Rs. {product.actualPrice.toLocaleString()}
                              </span>
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                                Save Rs. {(product.actualPrice - product.price).toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>

                        {/* View Button */}
                        <button className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
