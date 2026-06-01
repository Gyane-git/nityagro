"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ALL_PRODUCTS } from "./productsData";
import useCartStore from "@/store/cartStore";
import useToastStore from "@/store/toastStore";
import useWishlistStore from "@/store/wishlistStore";
import { requireLoginForAction } from "@/utils/clientAuthGuard";
import { addCartToDb, addWishlistToDb, removeWishlistFromDb } from "@/utils/accountListApi";

// ─── Icons ─────────────────────────────────────────────────────────────────
const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "#F5A623" : "none"} stroke="#F5A623" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "#DC2626" : "none"} stroke={filled ? "#DC2626" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PER_PAGE = 8; // 4 cols × 2 rows visible

// ─── Star Rating ───────────────────────────────────────────────────────────
function StarRating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} filled={s <= rating} />
      ))}
      <span className="text-xs text-gray-500 ml-1">({reviews})</span>
    </div>
  );
}

// ─── Single Product Card — exact same as ProductSection ────────────────────
function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const showToast = useToastStore((state) => state.showToast);
  const wishlistItems = useWishlistStore((state) => state.items);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const inWishlist = wishlistItems.some((item) => item.id === product.id);

  const [error, setError] = useState(false);

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
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="relative flex flex-col bg-white border border-gray-200 overflow-hidden w-full h-full rounded-lg">
      <button onClick={handleWishlistToggle} className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/90 border text-gray-500 hover:bg-green-100 border-gray-200 flex items-center justify-center" title={inWishlist ? "Remove from wishlist" : "Add to wishlist"} aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
        <HeartIcon filled={inWishlist} />
      </button>

      {/* Discount badge */}
      {product.discount && (
        <div
          className="absolute top-0 left-0 z-10 flex items-center justify-center text-center text-white font-bold leading-tight bg-[#00462C]
      w-9.5 sm:w-11 md:w-13
      min-h-10.5 sm:min-h-12.5 md:min-h-14.5
      text-[8px] sm:text-[9px] md:text-[10px]
      px-1 sm:px-1.5 md:px-2
      whitespace-pre-line rounded-br-lg"
        >
          {product.discount}
        </div>
      )}

      {/* Best Seller badge */}
      {product.badge && (
        <div
          className="absolute top-2 sm:top-3 right-8 z-10 text-white font-semibold
      text-[10px] sm:text-xs
      px-1 sm:px-3
      py-1 sm:py-1.5
      leading-tight
      whitespace-normal
      max-w-12.5 sm:max-w-none
      text-center"
          style={{
            background: "#F5A623",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
          }}
        >
          {product.badge}
        </div>
      )}

      <Link href={`/products/${product.id}`} className="flex flex-col flex-1 min-h-0">
        {/* Image */}

        <div className="relative w-full aspect-4/3 bg-gray-50 flex items-center justify-center">{!error ? <Image src={product.image} alt={product.name} fill className="object-contain p-4" sizes="259px" onError={() => setError(true)} /> : <div className="text-gray-500 text-sm font-semibold text-center px-2">{product.name}</div>}</div>

        {/* Info */}
        <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3">
          <div className="flex flex-col gap-1">
            <StarRating rating={product.rating} reviews={product.reviews} />
            <p className="text-gray-800 text-sm font-medium leading-snug line-clamp-2">{product.name}</p>
            <p className="text-gray-900 font-bold" style={{ fontSize: "15px" }}>
              NPR {product.price}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3">
        <button
          onClick={handleAdd}
          className="mt-2 w-full flex items-center justify-center gap-2 text-white font-semibold text-sm py-2.5 rounded transition-all duration-200 active:scale-95"
          style={{
            background: added ? "#2d7a4f" : "#00462C",
            borderRadius: "6px",
          }}
        >
          <CartIcon />
          {added ? "Added!" : "Add"}
        </button>
      </div>
    </div>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────
function Pagination({ current, total, onChange }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1 justify-end mt-8">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1} className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:border-[#00462C] hover:text-[#00462C] disabled:opacity-30 transition-colors">
        <ChevronLeft />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className="w-8 h-8 flex items-center justify-center rounded border text-sm font-medium transition-colors"
          style={{
            background: current === p ? "#00462C" : "white",
            color: current === p ? "white" : "#374151",
            borderColor: current === p ? "#00462C" : "#D1D5DB",
          }}
        >
          {p}
        </button>
      ))}
      <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total} className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:border-[#00462C] hover:text-[#00462C] disabled:opacity-30 transition-colors">
        <ChevronRight />
      </button>
    </div>
  );
}

// ─── Main ProductList ───────────────────────────────────────────────────────
export default function ProductList({ products = ALL_PRODUCTS }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const visible = products.slice(start, start + PER_PAGE);

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Items count */}
      <p className="text-sm text-gray-600 mb-4 font-medium">
        Items {start + 1}–{Math.min(start + PER_PAGE, products.length)} of <span className="font-bold text-gray-800">{products.length}</span>
      </p>

      {products.length === 0 ? (
        <div className="rounded-md border border-gray-200 p-6 text-sm text-gray-500">No products found for selected filters.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {products.length > 0 ? <Pagination current={page} total={totalPages} onChange={setPage} /> : null}
    </div>
  );
}
