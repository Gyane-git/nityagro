"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";
import useToastStore from "@/store/toastStore";

// ─── Icons ──────────────────────────────────────────────────────────────────
const StarIcon = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24"
    fill={filled ? "#F5A623" : "none"} stroke="#F5A623" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function ProductInfo({ product }) {
  const [qty, setQty] = useState(1);
  const [variantsFromApi, setVariantsFromApi] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState(
    Number(product?.id || 0)
  );
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const setCheckoutItem = useCheckoutStore((state) => state.setCheckoutItem);
  const showToast = useToastStore((state) => state.showToast);

  const p = product ?? {
    name: "Yellow Mustard Oil",
    rating: 4.5,
    reviews: 148,
    price: 499,
    variants: [],
  };
  useEffect(() => {
    const fetchVariants = async () => {
      const groupName = (p.subGroupName || p.name || "").trim();
      if (!groupName) return;

      try {
        const response = await fetch(
          `/api/subcategories/${encodeURIComponent(groupName)}`
        );
        const result = await response.json();
        const rows = Array.isArray(result?.data) ? result.data : [];

        const mapped = rows.map((item) => ({
          id: Number(item.variantId),
          productCode: item.pCode || "",
          label: item.variationName || item.pCode || "Variant",
          price: Number(item.salesRate ?? p.price ?? 0),
          actualPrice: Number(item.salesRate ?? p.price ?? 0),
          image: p.image || p.images?.[0] || "/products/mustard-oil.png",
        }));

        setVariantsFromApi(mapped);

        const matched = mapped.find(
          (v) => String(v.productCode) === String(p.productCode)
        );
        if (matched) {
          setSelectedVariantId(Number(matched.id));
        } else if (mapped[0]) {
          setSelectedVariantId(Number(mapped[0].id));
        }
      } catch {
        setVariantsFromApi([]);
      }
    };

    fetchVariants();
  }, [p.subGroupName, p.name, p.productCode, p.image, p.images, p.price]);

  const variants = variantsFromApi.length
    ? variantsFromApi
    : [
      {
        id: p.id,
        productCode: p.productCode || "",
        label: p.label || p.name,
        price: p.price,
        actualPrice: p.actualPrice || p.price,
        image: p.image || p.images?.[0] || "/products/mustard-oil.png",
      },
    ];
  const selectedVariant =
    variants.find((v) => Number(v.id) === Number(selectedVariantId)) ||
    variants[0];
  const currentPrice = Number(selectedVariant?.price ?? p.price ?? 0);
  const currentActualPrice = Number(
    selectedVariant?.actualPrice ?? p.actualPrice ?? currentPrice
  );
  const selectedLabel = selectedVariant?.label || p.label || p.name;
  const displayName = `${p.name} - ${selectedLabel}`;

  const handleAdd = () => {
    addToCart({
      id: selectedVariant?.id || p.id,
      name: displayName,
      price: currentPrice,
      image:
        selectedVariant?.image ||
        p.image ||
        p.images?.[0] ||
        "/products/mustard-oil.png",
      qty,
      weight: selectedLabel,
    });
    showToast(`${displayName} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleBuyNow = () => {
    setCheckoutItem({
      id: selectedVariant?.id || p.id,
      name: displayName,
      image:
        selectedVariant?.image ||
        p.image ||
        p.images?.[0] ||
        "/products/mustard-oil.png",
      weight: selectedLabel,
      qty,
      unitPrice: currentPrice,
      total: currentPrice * qty,
    });
    router.push("/Checkout");
  };

  return (
    <div className="flex flex-col gap-5 flex-1 min-w-0">

      {/* ── Product Name ── */}
      <h1 className="font-bold text-gray-900" style={{ fontSize: "24px", lineHeight: 1.2 }}>
        {p.name}
      </h1>

      {/* ── Stars + review count ── */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon key={s} filled={s <= Math.round(p.rating)} />
          ))}
        </div>
        <span className="text-sm font-semibold" style={{ color: "#F5A623" }}>
          {p.rating}
        </span>
        <span className="text-sm text-gray-500">• {p.reviews} reviews</span>
      </div>

      {/* ── Price ── */}
      <p className="font-bold" style={{ color: "#00462C", fontSize: "22px" }}>
        NPR {currentPrice}
        {currentActualPrice > currentPrice && (
          <span className="text-gray-400 line-through text-base ml-2">
            NPR {currentActualPrice}
          </span>
        )}
      </p>

      {/* ── Divider ── */}
      <div className="border-t border-gray-200" />

      {/* ── Variant selector (subgroup products) ── */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-700">Select Variant :</p>
        <div className="flex gap-2 flex-wrap">
          {variants.map((variant) => {
            const isActive = Number(selectedVariantId) === Number(variant.id);
            return (
              <button
                key={variant.id}
                onClick={() => setSelectedVariantId(Number(variant.id))}
                className="px-4 py-2 text-sm font-medium border rounded-md transition-all duration-150"
                style={{
                  borderColor: isActive ? "#00462C" : "#D1D5DB",
                  background: isActive ? "#00462C" : "white",
                  color: isActive ? "white" : "#374151",
                  minWidth: "78px",
                }}
              >
                {variant.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Quantity ── */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-700">Quantity</p>
        <div
          className="flex items-center border border-gray-300 rounded-md overflow-hidden"
          style={{ width: "110px", height: "40px" }}
        >
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex items-center justify-center flex-1 h-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <MinusIcon />
          </button>
          <span
            className="flex items-center justify-center font-semibold text-sm text-gray-800 border-x border-gray-300 h-full"
            style={{ width: "36px" }}
          >
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="flex items-center justify-center flex-1 h-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <PlusIcon />
          </button>
        </div>
      </div>

      {/* ── Add + Buy Now buttons — exactly like screenshot ── */}
      <div className="flex gap-3">
        {/* Add (filled green) */}
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 text-white font-semibold text-sm rounded-md transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: added ? "#2d7a4f" : "#00462C",
            height: "44px",
            width: "220px",
            boxShadow: "0 3px 14px rgba(0,70,44,0.25)",
          }}
        >
          <CartIcon />
          {added ? "Added!" : "Add"}
        </button>

        {/* Buy Now (outlined) */}
        <button
          className="flex items-center justify-center font-semibold text-sm rounded-md border-2 transition-all duration-200 hover:bg-gray-50 active:scale-95"
          style={{
            borderColor: "#00462C",
            color: "#00462C",
            height: "44px",
            width: "220px",
          }}
          onClick={handleBuyNow}   >
          Buy Now
        </button>
      </div>
    </div>
  );
}
