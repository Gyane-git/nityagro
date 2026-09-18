"use client";

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

function normalizeImageSrc(src: unknown, fallback = "/no-image.png") {
  if (!src || typeof src !== "string") return fallback;
  if (/^https?:\/\//i.test(src)) return src;
  return src.startsWith("/") ? src : `/${src}`;
}

function normalizeCheckoutDisplay(name: string, weight: string) {
  const rawName = String(name || "").trim();
  const rawWeight = String(weight || "").trim();
  const weightParts = rawWeight.split(/\s+-\s+/);
  const cleanWeight = weightParts.length > 1 ? weightParts.at(-1)?.trim() || rawWeight : rawWeight;
  const fullSuffix = ` - ${rawWeight}`.toLowerCase();
  const cleanName = rawWeight && rawName.toLowerCase().endsWith(fullSuffix)
    ? `${rawName.slice(0, -fullSuffix.length)} - ${cleanWeight}`
    : rawName;

  return { name: cleanName, weight: cleanWeight };
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
  const items: OrderItem[] = sourceItems.map((item: CheckoutSourceItem) => {
    const display = normalizeCheckoutDisplay(
      item.name,
      item.weight ?? (item.type === "combo" ? "Combo Pack" : "100 gm"),
    );
    return {
      id: item.id,
      name: display.name,
      weight: display.weight,
      unitPrice: Number(item.unitPrice ?? 0),
      qty: Number(item.qty ?? 1),
      total: Number(item.total ?? item.unitPrice ?? 0),
      image: normalizeImageSrc(item.image || "/products/mustard-oil.png", "/no-image.png"),
    };
  });

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
            <div className="p-4 sm:p-5">
              <div className="flex w-full items-start gap-3 sm:items-center sm:gap-4">
              {/* Product image */}
              <div className="relative h-[68px] w-[62px] shrink-0 sm:h-[72px] sm:w-[72px]">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>

              {/* Name + weight */}
              <div className="min-w-0 flex-1">
                <span className="block break-words text-sm font-semibold leading-5 text-gray-900 sm:text-base">{item.name}</span>
                <span className="mt-1 block text-xs text-gray-500">Weight: {item.weight}</span>
              </div>

              {/* Spacer */}
              <div className="hidden flex-1 sm:block" />

              {/* Unit price + Qty wrapper: stacked on xs, side-by-side on sm+ */}
              <div className="hidden flex-col sm:flex sm:flex-row sm:items-center sm:gap-4">
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

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 sm:hidden">
                <div className="min-w-0">
                  <span className="block text-[11px] text-gray-500">Price</span>
                  <span className="block truncate text-sm font-medium text-gray-700">{formatNPR(item.unitPrice)}</span>
                </div>
                <div className="text-center">
                  <span className="block text-[11px] text-gray-500">Quantity</span>
                  <span className="block text-sm font-semibold text-gray-700">{item.qty}</span>
                </div>
                <div className="min-w-0 text-right">
                  <span className="block text-[11px] text-gray-500">Total</span>
                  <span className="block truncate text-sm font-bold" style={{ color: "#00462C" }}>{formatNPR(item.total)}</span>
                </div>
              </div>
            </div>

            {/* Divider between items */}
            {idx < items.length - 1 && <div className="border-t border-gray-100 mx-6" />}
          </div>
        ))}
      </div>
    </div>
  );
}
