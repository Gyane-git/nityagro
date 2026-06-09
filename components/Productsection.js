"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import useCartStore from "@/store/cartStore";
import useToastStore from "@/store/toastStore";
import useWishlistStore from "@/store/wishlistStore";
import { apiGetRequest } from "@/apihelper/apiHelper";
import { requireLoginForAction } from "@/utils/clientAuthGuard";
import { addCartToDb, addWishlistToDb, removeWishlistFromDb } from "@/utils/accountListApi";

// ─── Icons ─────────────────────────────────────────────────────────────────
const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#F5A623" : "none"} stroke="#F5A623" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#DC2626" : "none"} stroke={filled ? "#DC2626" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ─── Data ──────────────────────────────────────────────────────────────────
const DEFAULT_CATEGORIES = [{ id: "all", label: "All", image: "/categories/all.png" }];

// ─── Star Rating ───────────────────────────────────────────────────────────
function StarRating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} filled={s <= rating} />
      ))}
      <span className="text-xs text-gray-500 ml-1">({reviews})</span>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const showToast = useToastStore((state) => state.showToast);
  const wishlistItems = useWishlistStore((state) => state.items);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const inWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleWishlistToggle = async () => {
    if (!requireLoginForAction()) {
      showToast("Please login to use wishlist");
      return;
    }

    if (inWishlist) {
      removeFromWishlist(product.id);
      await removeWishlistFromDb(product.id).catch(() => null);
      showToast(`${product.name} removed from wishlist`);
      return;
    }
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    };
    addToWishlist(item);
    await addWishlistToDb(item).catch(() => null);
    showToast(`${product.name} added to wishlist`);
  };

  const handleAdd = async () => {
    if (!requireLoginForAction()) {
      showToast("Please login to add products to cart");
      return;
    }

    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
      weight: "100 gm",
      availableQuantity: Number(product.availableQuantity ?? product.stockQuantity ?? 0),
      stockQuantity: Number(product.stockQuantity ?? product.availableQuantity ?? 0),
    };
    addToCart(item);
    await addCartToDb(item).catch(() => null);
    showToast(`${product.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="relative flex flex-col border border-gray-200 overflow-hidden rounded-lg w-full">
      <button onClick={handleWishlistToggle} className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-white/90 border text-gray-500 hover:bg-green-100 border-gray-200 flex items-center justify-center" title={inWishlist ? "Remove from wishlist" : "Add to wishlist"} aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
        <HeartIcon filled={inWishlist} />
      </button>

      {/* Discount */}
      {product.discount && (
        <div
          className="absolute top-0 left-0 z-10 text-white font-bold text-center"
          style={{
            background: "#00462C",
            width: "48px",
            minHeight: "54px",
            borderBottomRightRadius: "8px",
            fontSize: "9px",
            padding: "5px 4px",
            whiteSpace: "pre-line",
          }}
        >
          {product.discount}
        </div>
      )}

      {/* Badge */}
      {product.badge && (
        <div
          className="absolute top-2.5 right-8 z-10 text-white px-2 py-1"
          style={{
            background: "#F5A623",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
            fontSize: "10px",
          }}
        >
          {product.badge}
        </div>
      )}

      {/* Wrap image + info in Link — NO flex-1 so height is driven by fixed children */}
      <Link href={`/products/${product.id}`} className="flex flex-col">
        {/* Image — fixed height */}
        <div className="relative w-full bg-gray-50" style={{ height: "160px" }}>
          <Image src={product.image} alt={product.name} fill className="object-contain p-3" sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw" />
        </div>

        {/* Info — fixed height keeps all cards uniform */}
        <div className="px-2.5 pt-2 pb-1 overflow-hidden" style={{ height: "84px" }}>
          <StarRating rating={product.rating} reviews={product.reviews} />
          <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 mt-1 leading-tight">{product.name}</p>
          <p className="text-sm font-bold text-gray-900 mt-1">NPR {product.price}</p>
        </div>
      </Link>

      {/* Add to Cart — always at the bottom */}
      <div className="px-2.5 pb-2.5 pt-1">
        <button onClick={handleAdd} className="w-full py-2 rounded text-white font-semibold flex items-center justify-center gap-1.5 text-sm transition-colors" style={{ background: added ? "#2d7a4f" : "#00462C" }}>
          <CartIcon />
          {added ? "Added!" : "Add"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function ProductSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSectionData = async () => {
      const [categoryResponse, productResponse] = await Promise.all([apiGetRequest("/categories"), apiGetRequest("/products")]);

      const categoryRows = Array.isArray(categoryResponse?.data) ? categoryResponse.data : [];
      const mappedCategories = categoryRows
        .filter((item) => item.categoryStatus !== false && item.categoryStatus !== 0)
        .map((item) => ({
          id: (item.categoryName || "").trim().toLowerCase(),
          label: item.categoryName || "",
          image: item.categoryLogo || "/categories/all.png",
        }));

      const productRows = Array.isArray(productResponse?.data) ? productResponse.data : [];
      const mappedProducts = productRows
        .filter((item) => item.productStatus !== false && item.productStatus !== 0)
        .map((item) => ({
          id: Number(item.productId || item.productCode),
          name: item.subGroupName || item.productName || "Unnamed Product",
          price: Number(item.sellingPrice ?? item.actualPrice ?? 0),
          rating: 4,
          reviews: 0,
          category: String(item.categoryId || "")
            .trim()
            .toLowerCase(),
          badge: item.specialOffer ? "Special Offer" : null,
          discount: Number(item.actualPrice || 0) > Number(item.sellingPrice || 0) ? `SAVE\n${Math.round(((Number(item.actualPrice) - Number(item.sellingPrice)) / Number(item.actualPrice)) * 100)}%` : null,
          image: item.pImage || "/products/mustard-oil.png",
          createdAt: item.createdAt || null,
          stockQuantity: Number(item.stockQuantity ?? item.availableQuantity ?? 0),
          availableQuantity: Number(item.availableQuantity ?? item.stockQuantity ?? 0),
        }));

      setCategories([...DEFAULT_CATEGORIES, ...mappedCategories.filter((c) => c.id)]);
      setProducts(mappedProducts);
    };
    fetchSectionData();
  }, []);

  const filtered = (activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory)).slice().sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
  const activeCategoryLabel = useMemo(() => categories.find((c) => c.id === activeCategory)?.label, [categories, activeCategory]);

  // const newLocal = "mx-auto w-full max-w-319.5";
  const newLocalOld = "mx-auto w-full max-w-340 px-4 sm:px-6 lg:px-8";
  const visibleProducts = filtered.slice(0, 5);

  return (
    <section className="w-full bg-white flex justify-center">
      <div className="w-full max-w-[1380px] min-h-[507px]">
        <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

        <div className={newLocalOld}>
          {/* ── Welcome Header ── */}
          <div className="flex flex-col items-center text-center pt-8 sm:pt-10 lg:pt-11.25 pb-2 gap-1 px-4">
            <h1 className="font-bold text-xl sm:text-2xl lg:text-[32px] leading-9.5 tracking-[0.6px] text-[#235A49]" style={{ fontFamily: "Roboto Slab" }}>
              Welcome To Nityagro!
            </h1>
            <p className="font-normal text-sm sm:text-lg lg:text-[32px] leading-tight tracking-[0.6px] text-[#235A49]" style={{ fontFamily: "Roboto Slab" }}>
              Pure Goodness, Delivered Closer to You
            </p>
          </div>

          {/* ── Category Tabs ── */}
          <div className="w-full max-w-345 h-21.5 flex items-center overflow-x-auto scrollbar-hide gap-1 sm:gap-3 justify-start sm:justify-center pb-3 mt-4 px-4">
            {categories.map(({ id, label, image }) => {
              const isActive = activeCategory === id;
              return (
                <button key={id} onClick={() => setActiveCategory(id)} className="flex flex-col items-center relative transition-all shrink-0" style={{ minWidth: "52px" }}>
                  <div className="flex flex-col items-center justify-center cursor-pointer pb-2">
                    <Image src={image} alt={label} width={50} height={51} className="sm:w-8 sm:h-10 w-6 h-8 " />
                    <span
                      className="text-xs font-medium mt-1 font-figtree"
                      style={{
                        color: isActive ? "#495057" : "#6B7280",
                        lineHeight: "16px",
                        letterSpacing: "0.2px",
                        transition: "color 0.2s",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  {/* Active underline indicator */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-200"
                    style={{
                      height: "2.5px",
                      width: isActive ? "100%" : "0%",
                      background: "#00462C",
                      borderRadius: "2px",
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* ── Title Row ── */}
          <div className="w-full max-w-340 h-102 flex flex-col">
            <div className="flex items-center justify-between mt-4 mb-3 px-4 ">
              <h2 className="font-bold text-lg sm:text-xl lg:text-[22px] text-[#00462C]">{activeCategory === "all" ? "All Products" : activeCategoryLabel}</h2>
              <Link href="/products" className="font-semibold text-sm hover:underline" style={{ color: "#00462C" }}>
                View All
              </Link>
            </div>
            {filtered.length > 0 ? (
              <>
                {/* Mobile & Tablet → horizontal scroll slider */}
                <div className="lg:hidden overflow-x-auto scrollbar pb-6 px-4">
                  <div className="flex gap-3" style={{ width: "max-content" }}>
                    {visibleProducts.map((product) => (
                      <div key={product.id} className="shrink-0" style={{ width: "160px" }}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Large screen -> single row */}
                <div className="hidden lg:grid lg:grid-cols-5 gap-4 px-4 pb-8">
                  {visibleProducts.map((product) => (
                    <div key={product.id} className="w-full h-90">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm py-10 w-full text-center px-4">No products in this category yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
