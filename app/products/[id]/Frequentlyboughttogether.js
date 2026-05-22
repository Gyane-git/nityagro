"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import useCartStore from "@/store/cartStore";
import useToastStore from "@/store/toastStore";
import { apiGetRequest } from "@/apihelper/apiHelper";
import { requireLoginForAction } from "@/utils/clientAuthGuard";
import { addCartToDb } from "@/utils/accountListApi";

const CartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const showToast = useToastStore((state) => state.showToast);

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
    };
    addToCart(item);
    await addCartToDb(item).catch(() => null);
    showToast(`${product.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      className="relative flex flex-col bg-white border border-gray-200 overflow-hidden flex-shrink-0"
      style={{
        width: "190px",
        borderRadius: "8px",
        borderWidth: "1px",
      }}
    >
      {/* Discount badge */}
      {product.discount && (
        <div
          className="absolute top-0 left-0 z-10 flex items-center justify-center text-center text-white font-bold leading-tight"
          style={{
            background: "#00462C",
            width: "44px",
            minHeight: "52px",
            borderBottomRightRadius: "8px",
            fontSize: "9px",
            padding: "5px 3px",
            whiteSpace: "pre-line",
          }}
        >
          {product.discount}
        </div>
      )}

      {/* Best Seller badge */}
      {product.badge && (
        <div
          className="absolute top-2 right-0 z-10 text-white font-semibold px-2 py-1"
          style={{
            background: "#F5A623",
            fontSize: "10px",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
          }}
        >
          {product.badge}
        </div>
      )}

      <Link href={`/products/${product.id}`} className="flex flex-col">
        {/* Image */}
        <div className="relative w-full bg-gray-50" style={{ height: "160px", flexShrink: 0 }}>
          <Image src={product.image} alt={product.name} fill className="object-contain p-3" sizes="190px" />
        </div>

        {/* Info */}
        <div className="flex flex-col px-3 pt-2 gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon key={s} filled={s <= product.rating} />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
          </div>
          <p className="text-gray-800 font-medium leading-snug" style={{ fontSize: "13px" }}>
            {product.name}
          </p>
          <p className="font-bold text-gray-900" style={{ fontSize: "14px" }}>
            NPR {product.price}
          </p>
        </div>
      </Link>

      <div className="px-3 pb-3">
        <button
          onClick={handleAdd}
          className="mt-1 w-full flex items-center justify-center gap-1.5 text-white font-semibold py-2 rounded transition-all duration-200 active:scale-95"
          style={{
            background: added ? "#2d7a4f" : "#00462C",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        >
          <CartIcon />
          {added ? "Added!" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default function FrequentlyBoughtTogether() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiGetRequest("/products");
        const rows = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
        const mapped = rows
          .filter((item) => item.productStatus !== false && item.productStatus !== 0)
          .map((item) => {
            const actualPrice = Number(item.actualPrice ?? 0);
            const sellingPrice = Number(item.sellingPrice ?? actualPrice ?? 0);
            return {
              id: Number(item.productId || item.productCode),
              name: item.subGroupName || item.productName || "Unnamed Product",
              price: sellingPrice,
              rating: 4,
              reviews: 0,
              badge: item.specialOffer ? "Best Seller" : null,
              discount: actualPrice > sellingPrice && actualPrice > 0 ? `SAVE\n${Math.round(((actualPrice - sellingPrice) / actualPrice) * 100)}%` : null,
              image: item.pImage || "/products/mustard-oil.png",
              specialOffer: Boolean(item.specialOffer),
              stockQuantity: Number(item.stockQuantity ?? item.availableQuantity ?? 0),
              createdAt: item.createdAt || null,
            };
          });

        setProducts(mapped);
      } catch (error) {
        console.error("Failed to load frequently bought products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const recommendedProducts = useMemo(() => {
    const newestSpecialOffers = products
      .filter((item) => item.specialOffer)
      .slice()
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 4);

    const selectedIds = new Set(newestSpecialOffers.map((item) => item.id));
    const highestStock = products
      .filter((item) => !selectedIds.has(item.id))
      .slice()
      .sort((a, b) => b.stockQuantity - a.stockQuantity)
      .slice(0, 3);

    return [...newestSpecialOffers, ...highestStock].slice(0, 7);
  }, [products]);

  return (
    // <div className="flex flex-col gap-5 w-full">
    //   {/* Header */}
    //   <div className="flex items-center justify-between">
    //     <h2 className="font-bold" style={{ color: "#00462C", fontSize: "20px" }}>
    //       Frequently Bought Together
    //     </h2>
    //     <Link href="/products" className="text-sm font-semibold" style={{ color: "#00462C" }}>
    //       View All
    //     </Link>
    //   </div>

    //   {/* Cards — horizontal scroll */}
    //   <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
    //     {recommendedProducts.map((p) => (
    //       <ProductCard key={p.id} product={p} />
    //     ))}
    //   </div>
    // </div>

    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold" style={{ color: "#00462C", fontSize: "clamp(16px, 3vw, 20px)" }}>
          Frequently Bought Together
        </h2>
        <Link href="/products" className="text-sm font-semibold" style={{ color: "#00462C" }}>
          View All
        </Link>
      </div>

      {/* Cards — horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {recommendedProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
