// components/OrderItemsList.tsx
import Image from "next/image";

interface OrderItem {
  id: number;
  name: string;
  weight: string;
  unitPrice: number;
  qty: number;
  total: number;
  image: string; // path to product image
}

const items: OrderItem[] = [
  {
    id: 1,
    name: "Yellow Mustard Oil",
    weight: "100 gm",
    unitPrice: 125.00,
    qty: 1,
    total: 1250.00,
    image: "/products/mustard-oil.png",
  },
  {
    id: 2,
    name: "Jaggery Powder",
    weight: "100 gm",
    unitPrice: 125.00,
    qty: 1,
    total: 1250.00,
    image: "/products/jaggery1.png",
  },
];

function formatNPR(amount: number) {
  return `NPR ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

export default function OrderItemsList() {
  return (
    <div className="flex flex-col flex-1 min-w-0 mt-8">
      {/* Header */}
      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: "20px" }}>
        Order
      </h2>
      <div
        className="mb-4"
        style={{ height: "2px", background: "#00462C", borderRadius: "2px", width: "60px" }}
      />

      {/* Items card */}
      <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
        {items.map((item, idx) => (
          <div key={item.id}>
            <div className="flex items-center gap-4 px-6 py-5">
              {/* Product image */}
              <div className="relative w-[72px] h-[72px] shrink-0">
                {/*
                 * Replace <img> with Next.js <Image> once you have product images:
                 * <Image src={item.image} alt={item.name} fill className="object-contain" />
                 */}
                <Image
                  width={170}
                  height={170}
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Name + weight */}
              <div className="flex flex-col gap-0.5 min-w-[160px]">
                <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                <span className="text-xs text-gray-500">Weight: {item.weight}</span>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Unit price */}
              <span className="text-sm text-gray-500 w-[110px] text-right">
                {formatNPR(item.unitPrice)}
              </span>

              {/* Qty */}
              <span className="text-sm text-gray-700 w-[70px] text-center">
                Qty:&nbsp;<span className="font-semibold">{item.qty}</span>
              </span>

              {/* Total */}
              <span
                className="text-sm font-bold w-[110px] text-right"
                style={{ color: "#00462C" }}
              >
                {formatNPR(item.total)}
              </span>
            </div>

            {/* Divider between items */}
            {idx < items.length - 1 && (
              <div className="border-t border-gray-100 mx-6" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}