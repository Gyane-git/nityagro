"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useCheckoutStore from "@/store/checkoutStore";
import toast from "react-hot-toast";

type OrderSummaryProps = {
  onProceed?: () => void | Promise<void>;
  processing?: boolean;
};

type SummaryItem = {
  qty?: number;
  price?: number;
  unitPrice?: number;
  total?: number;
};

const getLineTotal = (item: SummaryItem) => {
  const qty = Math.max(1, Number(item.qty ?? 1));
  const explicitTotal = Number(item.total ?? 0);
  if (Number.isFinite(explicitTotal) && explicitTotal > 0) return explicitTotal;

  const unitPrice = Number(item.unitPrice ?? item.price ?? 0);
  return Number.isFinite(unitPrice) ? unitPrice * qty : 0;
};

export default function OrderSummary({ onProceed, processing = false }: OrderSummaryProps) {
  const router = useRouter();
  const checkoutItems = useCheckoutStore((state) => state.checkoutItems);
  const checkoutItem = useCheckoutStore((state) => state.checkoutItem);
  const selectedAddress = useCheckoutStore((state) => state.getSelectedAddress());
  const deliveryCharge = useCheckoutStore((state) => state.deliveryCharge || 0);
  const setDeliveryCharge = useCheckoutStore((state) => state.setDeliveryCharge);
  const [loadingDelivery, setLoadingDelivery] = useState(false);
  const sourceItems = checkoutItems.length > 0 ? checkoutItems : checkoutItem ? [checkoutItem] : [];
  const itemTotal = sourceItems.reduce((sum: number, item: SummaryItem) => sum + getLineTotal(item), 0);
  const discount = 0;
  const totalAmount = itemTotal - discount + deliveryCharge;
  const chargeKey = useMemo(
    () => `${selectedAddress?.city || ""}|${selectedAddress?.district || ""}|${selectedAddress?.region || ""}|${itemTotal}`,
    [selectedAddress, itemTotal],
  );

  useEffect(() => {
    if (!itemTotal || !selectedAddress) {
      setDeliveryCharge(0);
      return;
    }

    let ignore = false;
    setLoadingDelivery(true);
    fetch("/api/shipping-charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: selectedAddress }),
    })
      .then((res) => res.json())
      .then((payload) => {
        if (ignore) return;
        setDeliveryCharge(payload?.data?.deliveryCharge || 0);
      })
      .catch(() => {
        if (!ignore) setDeliveryCharge(0);
      })
      .finally(() => {
        if (!ignore) setLoadingDelivery(false);
      });

    return () => {
      ignore = true;
    };
  }, [chargeKey, itemTotal, selectedAddress, setDeliveryCharge]);

  const items = [
    {
      label: "Item(s) total",
      value: `NPR ${itemTotal.toFixed(2)}`,
      color: "text-gray-800",
    },
    {
      label: "Discount",
      value: `- NPR ${discount.toFixed(2)}`,
      color: "text-gray-800",
    },
    {
      label: "Delivery Charge",
      value: loadingDelivery ? "Calculating..." : `NPR ${deliveryCharge.toFixed(2)}`,
      color: "text-gray-800",
    },
  ];

  const handleProceed = () => {
    if (!selectedAddress) {
      toast.error("Please set shipping address before placing order");
      router.push("/profile?tab=address&next=/Checkout");
      return;
    }

    if (onProceed) {
      onProceed();
      return;
    }

    router.push("/Checkout/payment");
  };

  return (
    <div className="flex flex-col border border-gray-200 rounded-xl bg-white px-6 py-6 w-full lg:w-[280px]">
      {/* Header */}
      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: "20px" }}>
        Order Summary
      </h2>
      <div className="mb-5" style={{ height: "2px", background: "#00462C", borderRadius: "2px", width: "100%" }} />

      {/* Line items */}
      <div className="flex flex-col gap-3 mb-5">
        {items.map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{label}</span>
            <span className={`text-sm font-medium ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-4" />

      {/* Total */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-base font-bold text-gray-900">Total Amount</span>
        <span className="text-base font-bold" style={{ color: "#00462C" }}>
          NPR {totalAmount.toFixed(2)}
        </span>
      </div>

      {/* Proceed to Pay */}
      <button
        className="w-full flex items-center justify-center text-white font-bold text-sm rounded-lg transition-all hover:opacity-90 active:scale-[0.99] mt-4"
        style={{
          background: "#00462C",
          height: "48px",
          boxShadow: "0 4px 16px rgba(0,70,44,0.20)",
          opacity: processing || sourceItems.length === 0 ? 0.65 : 1,
          cursor: processing || sourceItems.length === 0 ? "not-allowed" : "pointer",
        }}
        disabled={processing || sourceItems.length === 0}
        onClick={handleProceed}
      >
        {processing ? "Placing Order..." : "Proceed to Pay"}
      </button>
    </div>
  );
}
