// components/OrderSummary.tsx

export default function OrderSummary() {
  const items = [
    { label: "Item(s) total",   value: "NPR 1250.00",  color: "text-gray-800" },
    { label: "Discount",        value: "- NPR 350.00", color: "text-gray-800" },
    { label: "Delivery Charge", value: "NPR 200.00",   color: "text-gray-800" },
  ];

  return (
    <div
      className="flex flex-col border border-gray-200 rounded-xl bg-white px-6 py-6"
      style={{ width: "280px", flexShrink: 0, alignSelf: "flex-start" }}
    >
      {/* Header */}
      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: "20px" }}>
        Order Summary
      </h2>
      <div
        className="mb-5"
        style={{ height: "2px", background: "#00462C", borderRadius: "2px", width: "100%" }}
      />

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
          NPR 1150.00
        </span>
      </div>

      {/* Proceed to Pay */}
      <button
        className="w-full flex items-center justify-center text-white font-bold text-sm rounded-lg transition-all hover:opacity-90 active:scale-[0.99]"
        style={{
          background: "#00462C",
          height: "48px",
          boxShadow: "0 4px 16px rgba(0,70,44,0.20)",
        }}
      >
        Proceed to Pay
      </button>
    </div>
  );
}