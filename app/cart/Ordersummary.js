"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCheckoutStore from "@/store/checkoutStore";
import useCartStore from "@/store/cartStore";
import { requireLoginForAction } from "@/utils/clientAuthGuard";
import useToastStore from "@/store/toastStore";

const PromoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const DELIVERY_OPTIONS = [
  "Standard Delivery",
  "Express/Same-Day Delivery",
  "Click & Collect",
];

export default function OrderSummary({
  checkedIds = [],
  selectedAddress = null,
}) {
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [delivery, setDelivery] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [loadingDelivery, setLoadingDelivery] = useState(false);

  const router = useRouter();

  const showToast = useToastStore((state) => state.showToast);

  const setCheckoutItems = useCheckoutStore(
    (state) => state.setCheckoutItems
  );

  const cartItems = useCartStore((state) => state.items);

  const selectedItems = cartItems.filter((item) => {
    const inSelection = checkedIds.includes(item.id);

    const inStock =
      Number(item.availableQuantity ?? item.stockQuantity ?? 0) > 0;

    return inSelection && inStock;
  });

  const itemsTotal = selectedItems.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.qty || 1),
    0
  );

  const discount = 0;

  const totalQty = selectedItems.reduce(
    (sum, item) => sum + Number(item.qty || 1),
    0
  );

  const checkoutPayload = selectedItems.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    weight: item.weight ?? "100 gm",
    qty: Number(item.qty || 1),
    unitPrice: Number(item.price || 0),
    total:
      Number(item.price || 0) * Number(item.qty || 1),
  }));

  // =========================
  // DELIVERY CHARGE API
  // =========================

  const chargeKey = JSON.stringify(selectedAddress);

  useEffect(() => {
    if (
      !itemsTotal ||
      !selectedAddress ||
      delivery !== "Standard Delivery"
    ) {
      setDeliveryCharge(
        delivery === "Express/Same-Day Delivery"
          ? 300
          : delivery === "Click & Collect"
          ? 0
          : 0
      );

      return;
    }

    let ignore = false;

    setLoadingDelivery(true);

    fetch("/api/shipping-charge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: selectedAddress,
      }),
    })
      .then((res) => res.json())
      .then((payload) => {
        if (ignore) return;

        setDeliveryCharge(
          payload?.data?.deliveryCharge || 0
        );
      })
      .catch(() => {
        if (!ignore) {
          setDeliveryCharge(0);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoadingDelivery(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [
    chargeKey,
    itemsTotal,
    selectedAddress,
    delivery,
  ]);

  const total =
    itemsTotal - discount + deliveryCharge;

  const moveToCheckout = (path) => {
    if (
      !requireLoginForAction(
        "Please login to continue checkout"
      )
    ) {
      showToast("Please login to continue checkout");
      return;
    }

    if (selectedItems.length === 0) {
      showToast(
        "Please select an in-stock product to checkout"
      );
      return;
    }

    setCheckoutItems(checkoutPayload);

    router.push(path);
  };

  const handleApply = () => {
    if (promo.trim()) {
      setPromoApplied(true);
    }
  };

  return (
    <div className="flex flex-col border border-gray-200 rounded-xl bg-white p-4 sm:p-6 gap-5 w-full">
      {/* ── Title ── */}
      <div className="flex flex-col gap-1.5">
        <h2 className="font-bold text-gray-900 text-lg sm:text-[20px]">
          Order Summary
        </h2>

        <div
          style={{
            width: "80px",
            height: "2.5px",
            background: "#00462C",
            borderRadius: "2px",
          }}
        />
      </div>

      {/* ── Promo code ── */}
      <div className="flex items-center gap-2 w-full min-w-0">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 sm:px-3 md:px-4 flex-1 min-w-0 h-10 sm:h-11 md:h-12">
          <PromoIcon />

          <input
            type="text"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="Enter Promo code"
            className="flex-1 min-w-0 text-xs sm:text-sm md:text-base outline-none text-gray-600 placeholder-gray-400 bg-transparent"
          />
        </div>

        <button
          onClick={handleApply}
          className="flex-shrink-0 text-white font-semibold rounded-lg transition-all hover:opacity-90 active:scale-95 h-10 sm:h-11 md:h-12 w-16 sm:w-20 md:w-[72px] text-xs sm:text-sm"
          style={{ background: "#00462C" }}
        >
          Apply
        </button>
      </div>

      {promoApplied && (
        <p
          className="text-xs font-semibold -mt-3"
          style={{ color: "#00462C" }}
        >
          ✓ Promo code applied!
        </p>
      )}

      {/* ── Summary ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Item(s) total ({totalQty})
          </span>

          <span className="text-sm font-semibold text-gray-800">
            NPR {itemsTotal.toLocaleString()}.00
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Discount
          </span>

          <span
            className="text-sm font-semibold"
            style={{ color: "#EF4444" }}
          >
            - NPR {discount.toLocaleString()}.00
          </span>
        </div>

        {/* <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Delivery Charge
          </span>

          <span className="text-sm font-semibold text-gray-800">
            {loadingDelivery
              ? "Calculating..."
              : `NPR ${deliveryCharge.toLocaleString()}.00`}
          </span>
        </div> */}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-900 text-sm sm:text-[15px]">
          Total Amount
        </span>

        <span
          className="font-bold text-[15px] sm:text-[16px]"
          style={{ color: "#00462C" }}
        >
          NPR {total.toLocaleString()}.00
        </span>
      </div>

      {/* Delivery */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-800">
          Delivery
        </label>

        <div
          className="relative border border-gray-200 rounded-lg px-3 flex items-center"
          style={{ height: "44px" }}
        >
          <select
            value={delivery}
            onChange={(e) => {
              const value = e.target.value;

              setDelivery(value);

              if (value === "Standard Delivery") {
                if (checkoutPayload.length > 0) {
                  moveToCheckout(
                    "/profile?tab=address&next=/Checkout"
                  );
                }
              }
            }}
            className="w-full text-sm text-gray-500 bg-transparent outline-none appearance-none cursor-pointer pr-6"
          >
            <option value="" disabled>
              Choose delivery option
            </option>

            {DELIVERY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDownIcon />
          </div>
        </div>
      </div>

      {/* Checkout */}
      <button
        disabled={itemsTotal === 0}
        className="w-full flex items-center justify-center text-white font-bold text-sm rounded-lg transition-all hover:opacity-90 active:scale-95"
        style={{
          background: "#00462C",
          height: "48px",
          boxShadow:
            "0 4px 16px rgba(0,70,44,0.25)",
          opacity: itemsTotal === 0 ? 0.6 : 1,
          cursor:
            itemsTotal === 0
              ? "not-allowed"
              : "pointer",
        }}
        onClick={() => moveToCheckout("/Checkout")}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}