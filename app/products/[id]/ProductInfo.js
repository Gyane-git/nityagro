"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";
import useToastStore from "@/store/toastStore";
import { requireLoginForAction } from "@/utils/clientAuthGuard";
import { addCartToDb } from "@/utils/accountListApi";

// ─── Icons ──────────────────────────────────────────────────────────────────
const StarIcon = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "#F5A623" : "none"} stroke="#F5A623" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
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
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ShareIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

function getVariantButtonLabel(label) {
  const text = String(label || "").trim();
  return text.split(/\s+/)[0] || text;
}

function firstValidPrice(...values) {
  for (const value of values) {
    if (value === undefined || value === null || value === "") continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return 0;
}

export default function ProductInfo({ product }) {
  const [qty, setQty] = useState(1);
  const [variantsFromApi, setVariantsFromApi] = useState([]);
  const [selectedProductCode, setSelectedProductCode] = useState(
    String(product?.productCode || ""),
  );
  const [liveAvailableQtyByCode, setLiveAvailableQtyByCode] = useState({});
  const [liveStockStatusByCode, setLiveStockStatusByCode] = useState({});
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
        const response = await fetch(`/api/subcategories/${encodeURIComponent(groupName)}`);
        const result = await response.json();
        const rows = Array.isArray(result?.data) ? result.data : [];

        const mapped = rows.map((item) => {
          const variantSellingPrice = firstValidPrice(
            item.productSellingPrice,
            item.salesRate,
            item.MRP,
            item.mrp,
            item.price,
            p.price,
          );
          const variantActualPrice = firstValidPrice(
            item.productActualPrice,
            item.actualPrice,
            variantSellingPrice,
            p.actualPrice,
            p.price,
          );

          return {
            id: Number(item.productId || p.id),
            variantId: Number(item.variantId),
            productCode: item.pCode || "",
            label: item.variationName || item.pCode || "Variant",
            price: variantSellingPrice,
            actualPrice: variantActualPrice,
            image: item.productImage || p.image || p.images?.[0] || "/products/mustard-oil.png",
            omsAvailableQty: Number(item.omsAvailableQty ?? item.productAvailableQuantity ?? item.stockQuantity ?? 0),
            stockQuantity: Number(item.omsAvailableQty ?? item.productStockQuantity ?? item.stockQuantity ?? 0),
            availableQuantity: Number(
              item.omsAvailableQty ?? item.productAvailableQuantity ?? item.stockQuantity ?? 0,
            ),
          };
        });

        setVariantsFromApi(mapped);

        const matched = mapped.find((v) => String(v.productCode) === String(p.productCode));
        if (matched) {
          setSelectedProductCode(String(matched.productCode || ""));
        } else if (mapped[0]) {
          setSelectedProductCode(String(mapped[0].productCode || ""));
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
          omsAvailableQty: Number(p.omsAvailableQty ?? p.availableQuantity ?? 0),
          stockQuantity: Number(p.stockQuantity ?? p.availableQuantity ?? 0),
          availableQuantity: Number(p.availableQuantity ?? p.stockQuantity ?? 0),
        },
      ];
  const selectedVariant =
    variants.find((v) => String(v.productCode || "") === String(selectedProductCode)) ||
    variants[0];
  const activeProductCode = String(
    selectedVariant?.productCode || selectedProductCode || p.productCode || "",
  ).trim();

  useEffect(() => {
    if (!activeProductCode) return;

    let cancelled = false;

    const fetchLiveAvailableQty = async () => {
      setLiveStockStatusByCode((prev) => ({
        ...prev,
        [activeProductCode]: "loading",
      }));

      try {
        await fetch("/api/oms/auth", { cache: "no-store" }).catch(() => null);
        const response = await fetch(
          `/api/oms/stock?sku=${encodeURIComponent(activeProductCode)}`,
          { cache: "no-store" },
        );
        if (!response.ok) {
          throw new Error("Stock API failed");
        }

        const result = await response.json();
        if (!result?.success) {
          throw new Error(result?.message || "Stock API failed");
        }

        const rows = Array.isArray(result?.data) ? result.data : [];
        const row =
          rows.find(
            (item) =>
              String(item?.sku || item?.pCode || item?.PCode || item?.barCode || "")
                .trim() === activeProductCode,
          ) || rows[0];

        if (!row) {
          throw new Error("Selected SKU stock not found");
        }

        const liveQty = Number(
          row?.availableQty ??
            row?.availableQuantity ??
            row?.stockQuantity ??
            row?.StockQty ??
            NaN,
        );

        if (!cancelled && Number.isFinite(liveQty)) {
          setLiveAvailableQtyByCode((prev) => ({
            ...prev,
            [activeProductCode]: liveQty,
          }));
          setLiveStockStatusByCode((prev) => ({
            ...prev,
            [activeProductCode]: "success",
          }));
        }
      } catch {
        if (!cancelled) {
          setLiveStockStatusByCode((prev) => ({
            ...prev,
            [activeProductCode]: "error",
          }));
        }
      }
    };

    fetchLiveAvailableQty();

    return () => {
      cancelled = true;
    };
  }, [activeProductCode]);

  const currentPrice = Number(selectedVariant?.price ?? p.price ?? 0);
  const currentActualPrice = Number(selectedVariant?.actualPrice ?? p.actualPrice ?? currentPrice);
  const hasLiveAvailableQty = Object.prototype.hasOwnProperty.call(
    liveAvailableQtyByCode,
    activeProductCode,
  );
  const stockStatus = liveStockStatusByCode[activeProductCode] || "loading";
  const currentAvailableQty = hasLiveAvailableQty
    ? Number(liveAvailableQtyByCode[activeProductCode])
    : 0;
  const isOutOfStock = currentAvailableQty <= 0;
  const isStockLoading = stockStatus === "loading" && !hasLiveAvailableQty;
  const isStockUnavailable = stockStatus === "error" && !hasLiveAvailableQty;
  const selectedLabel = selectedVariant?.label || p.label || p.name;
  const displayName = `${p.name} - ${selectedLabel}`;

  const handleAdd = async () => {
    if (!requireLoginForAction()) {
      showToast("Please login to add products to cart");
      return;
    }

    const item = {
      id: selectedVariant?.id || p.id,
      productId: selectedVariant?.id || p.id,
      productCode: selectedVariant?.productCode || p.productCode || "",
      name: displayName,
      price: currentPrice,
      image: selectedVariant?.image || p.image || p.images?.[0] || "/products/mustard-oil.png",
      qty,
      weight: selectedLabel,
      availableQuantity: currentAvailableQty,
      stockQuantity: currentAvailableQty,
    };
    addToCart(item);
    await addCartToDb(item).catch(() => null);
    showToast(`${displayName} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleBuyNow = () => {
    if (!requireLoginForAction()) {
      showToast("Please login to buy this product");
      return;
    }
    if (isOutOfStock) {
      showToast("This product is out of stock");
      return;
    }
    if (isStockLoading || isStockUnavailable) {
      showToast("Please wait until available quantity is synced");
      return;
    }

    setCheckoutItem({
      id: selectedVariant?.id || p.id,
      productId: selectedVariant?.id || p.id,
      productCode: selectedVariant?.productCode || p.productCode || "",
      name: displayName,
      image: selectedVariant?.image || p.image || p.images?.[0] || "/products/mustard-oil.png",
      weight: selectedLabel,
      qty,
      unitPrice: currentPrice,
      total: currentPrice * qty,
      availableQuantity: currentAvailableQty,
    });
    router.push("/Checkout");
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareUrl = window.location.href;
    const shareTitle = p.name || "Product";
    const shareText = `${shareTitle} - NPR ${currentPrice}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      showToast("Product link copied");
    } catch {
      // user cancelled share popup or clipboard denied
    }
  };

  return (
    <div className="product-info-panel flex flex-col gap-5 flex-1 min-w-full lg:min-w-50">
      {/* ── Product Name ── */}
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-bold text-gray-900" style={{ fontSize: "clamp(18px, 3vw, 24px)", lineHeight: 1.2 }}>
          {p.name}
        </h1>
        <button
          onClick={handleShare}
          aria-label="Share product"
          title="Share product"
          className="flex items-center justify-center rounded-md border transition-all duration-200 hover:bg-gray-50 active:scale-95 flex-shrink-0"
          style={{
            borderColor: "#D1D5DB",
            color: "#374151",
            height: "36px",
            width: "36px",
          }}
        >
          <ShareIcon />
        </button>
      </div>

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
      <p className="font-bold" style={{ color: "#00462C", fontSize: "clamp(18px, 3vw, 22px)" }}>
        NPR {currentPrice}
        {currentActualPrice > currentPrice && <span className="text-gray-400 line-through text-base ml-2">NPR {currentActualPrice}</span>}
      </p>

      {/* ── Divider ── */}
      <div className="border-t border-gray-200" />

      {/* ── Variant selector (subgroup products) ── */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-700">Select Variant :</p>
        <div className="flex gap-2 flex-wrap">
          {variants.map((variant) => {
            const variantCode = String(variant.productCode || "");
            const isActive = variantCode === activeProductCode;
            return (
              <button
                key={variantCode || variant.id}
                onClick={() => {
                  setSelectedProductCode(variantCode);
                  setQty(1);
                }}
                className="px-4 py-2 text-sm font-medium border rounded-md transition-all duration-150"
                style={{
                  borderColor: isActive ? "#00462C" : "#D1D5DB",
                  background: isActive ? "#00462C" : "white",
                  color: isActive ? "white" : "#374151",
                  minWidth: "78px",
                }}
              >
                {getVariantButtonLabel(variant.label)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Quantity ── */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-700">Quantity</p>
        {isStockLoading ? (
          <p className="text-xs font-semibold text-gray-500">Checking available qty...</p>
        ) : isStockUnavailable ? (
          <p className="text-xs font-semibold text-red-600">Unable to sync available qty. Please refresh.</p>
        ) : isOutOfStock ? (
          <p className="text-xs font-semibold text-red-600">Out of stock. You can add it to cart, but checkout is disabled until stock is available.</p>
        ) : (
          <p className="text-xs text-gray-500">Available Qty: {currentAvailableQty}</p>
        )}
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden" style={{ width: "110px", height: "40px" }}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex items-center justify-center flex-1 h-full hover:bg-gray-100 transition-colors text-gray-600">
            <MinusIcon />
          </button>
          <span className="flex items-center justify-center font-semibold text-sm text-gray-800 border-x border-gray-300 h-full" style={{ width: "36px" }}>
            {qty}
          </span>
          <button onClick={() => setQty((q) => (isOutOfStock || isStockLoading || isStockUnavailable ? q : Math.min(currentAvailableQty, q + 1)))} className="flex items-center justify-center flex-1 h-full hover:bg-gray-100 transition-colors text-gray-600">
            <PlusIcon />
          </button>
        </div>
      </div>

      {/* ── Add + Buy Now ── */}
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 text-white font-semibold text-sm rounded-md transition-all duration-200 hover:scale-105 active:scale-95 flex-1 sm:flex-none"
          style={{
            background: added ? "#2d7a4f" : "#00462C",
            height: "44px",
            width: "clamp(140px, 40%, 220px)",
            boxShadow: "0 3px 14px rgba(0,70,44,0.25)",
          }}
        >
          <CartIcon />
          {added ? "Added!" : "Add"}
        </button>

        <button
          className="flex items-center justify-center font-semibold text-sm rounded-md border-2 transition-all duration-200 hover:bg-gray-50 active:scale-95 flex-1 sm:flex-none"
          style={{
            borderColor: "#00462C",
            color: "#00462C",
            height: "44px",
            width: "clamp(140px, 40%, 220px)",
            opacity: isOutOfStock ? 0.5 : 1,
            cursor: isOutOfStock || isStockLoading || isStockUnavailable ? "not-allowed" : "pointer",
          }}
          disabled={isOutOfStock || isStockLoading || isStockUnavailable}
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
