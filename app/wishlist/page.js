"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import useWishlistStore from "@/store/wishlistStore";
import useToastStore from "@/store/toastStore";
import useCartStore from "@/store/cartStore";
import useConfirmModalStore from "@/store/confirmModalStore";
import Banner from "@/app/products/Banner";
import { requireLoginForAction } from "@/utils/clientAuthGuard";
import { addCartToDb, clearWishlistInDb, removeWishlistFromDb } from "@/utils/accountListApi";

const HeartIcon = ({ filled }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "#DC2626" : "none"}
    stroke={filled ? "#DC2626" : "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CartIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addToCart = useCartStore((state) => state.addToCart);
  const showToast = useToastStore((state) => state.showToast);
  const openConfirm = useConfirmModalStore((state) => state.open);

  useEffect(() => {
    if (!requireLoginForAction()) {
      showToast("Please login to view your wishlist");
    }
  }, [showToast]);

  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return "/products/mustard-oil.png";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  };

  const handleRemove = async (item) => {
    removeFromWishlist(item.id);
    await removeWishlistFromDb(item.id).catch(() => null);
    showToast(`${item.name} removed from wishlist`);
  };

  const handleAddToCart = async (item) => {
    if (!requireLoginForAction()) {
      showToast("Please login to add products to cart");
      return;
    }

    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      qty: 1,
      weight: "100 gm",
    };
    addToCart(cartItem);
    await addCartToDb(cartItem).catch(() => null);
    showToast(`${item.name} added to cart`);
  };

  const handleClearWishlist = async () => {
    openConfirm({
      title: "Clear Wishlist",
      message: "Are you sure you want to remove all saved products from your wishlist?",
      onConfirm: async () => {
        clearWishlist();
        await clearWishlistInDb().catch(() => null);
        showToast("Wishlist cleared", 2200, "warning");
      },
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-360 mx-auto px-4 sm:px-6 py-4">
        <Banner image="/banner1.jpg" title="Wishlist" />

        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[#00462C] font-bold text-xl">My Wishlist</h1>
            <div className="w-10 h-0.75 bg-[#00462C] mt-1 rounded" />
          </div>
          <p className="text-sm text-gray-600 whitespace-nowrap">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3 mb-5">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-semibold border"
            style={{ color: "#00462C", borderColor: "#00462C" }}
          >
            Continue Shopping
          </Link>
          {items.length > 0 ? (
            <button
              onClick={handleClearWishlist}
              className="inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50"
            >
              Clear Wishlist
            </button>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="border border-gray-200 rounded-xl p-10 text-center bg-gray-50">
            <p className="text-gray-500 mb-1">Your wishlist is empty.</p>
            <p className="text-xs text-gray-400 mb-4">
              Save products you like and find them quickly here.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-5 py-2 rounded-md text-white font-semibold"
              style={{ background: "#00462C" }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 pb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => handleRemove(item)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center"
                  title="Remove from wishlist"
                  aria-label="Remove from wishlist"
                >
                  <HeartIcon filled />
                </button>

                <Link href={`/products/${item.id}`} className="flex flex-col">
                  <div className="relative w-full bg-gray-50" style={{ height: "160px" }}>
                    <Image
                      src={resolveImageUrl(item.image)}
                      alt={item.name}
                      fill
                      className="object-contain p-3"
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                    />
                  </div>

                  <div className="px-3 pt-2 pb-2">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">
                      {item.name}
                    </p>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      NPR {Number(item.price || 0)}
                    </p>
                  </div>
                </Link>

                <div className="px-3 pb-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-2 rounded text-white font-semibold flex items-center justify-center gap-1.5 text-sm"
                    style={{ background: "#00462C" }}
                  >
                    <CartIcon />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
