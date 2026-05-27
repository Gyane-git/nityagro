"use client";

import Image from "next/image";
import useCheckoutStore from "@/store/checkoutStore";

interface OrderItem {
  id: number;
  name: string;
  weight: string;
  unitPrice: number;
  qty: number;
  total: number;
  image: string; // path to product image
}

function formatNPR(amount: number) {
  return `NPR ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

export default function OrderItemsList() {
  const checkoutItems = useCheckoutStore((state) => state.checkoutItems);
  const checkoutItem = useCheckoutStore((state) => state.checkoutItem);
  type CheckoutSourceItem = {
    id: number;
    type?: string;
    name: string;
    weight?: string;
    unitPrice?: number;
    qty?: number;
    total?: number;
    image?: string;
  };
  const sourceItems = checkoutItems.length > 0 ? checkoutItems : checkoutItem ? [checkoutItem] : [];
  const items: OrderItem[] = sourceItems.map((item: CheckoutSourceItem) => ({
    id: item.id,
    name: item.name,
    weight: item.weight ?? (item.type === "combo" ? "Combo Pack" : "100 gm"),
    unitPrice: Number(item.unitPrice ?? 0),
    qty: Number(item.qty ?? 1),
    total: Number(item.total ?? item.unitPrice ?? 0),
    image: item.image || "/products/mustard-oil.png",
  }));

  return (
    <div className="flex flex-col flex-1 min-w-0 mt-8">
      {/* Header */}
      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: "20px" }}>
        Order
      </h2>
      <div className="mb-4" style={{ height: "2px", background: "#00462C", borderRadius: "2px", width: "60px" }} />

      {/* Items card */}
      <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
        {items.length === 0 && <div className="px-6 py-10 text-sm text-gray-500">No product selected. Please go back to cart/product page and choose items.</div>}
        {items.map((item, idx) => (
          <div key={item.id}>
            <div className="flex items-center gap-4 w-full sm:w-auto pe-2">
              {/* Product image */}
              <div className="relative w-[72px] h-[72px] shrink-0">
                <Image width={170} height={170} src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>

              {/* Name + weight */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                <span className="text-xs text-gray-500">Weight: {item.weight}</span>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Unit price + Qty wrapper: stacked on xs, side-by-side on sm+ */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <span className="text-sm text-gray-500 sm:w-[110px] text-right">{formatNPR(item.unitPrice)}</span>
                <span className="text-sm text-gray-700 sm:w-[70px] sm:text-center text-right">
                  Qty:&nbsp;<span className="font-semibold">{item.qty}</span>
                </span>
              </div>

              {/* Total */}
              <span className="text-sm font-bold w-[110px] sm:w-[110px] text-right shrink-0 -ml-6 sm:ml-0" style={{ color: "#00462C" }}>
                {formatNPR(item.total)}
              </span>
            </div>

            {/* Divider between items */}
            {idx < items.length - 1 && <div className="border-t border-gray-100 mx-6" />}
          </div>
        ))}
      </div>
    </div>
  );
}
