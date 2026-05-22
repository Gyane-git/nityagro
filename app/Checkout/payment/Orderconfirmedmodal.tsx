"use client";

// ─── Check icon ───────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="24" stroke="#00462C" strokeWidth="3" />
    <polyline points="14,27 22,35 38,18" stroke="#00462C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface OrderConfirmedModalProps {
  orderId: string;
  placedAt: string;
  onContinue: () => void;
}

export default function OrderConfirmedModal({ orderId, placedAt, onContinue }: OrderConfirmedModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.25)" }}>
      {/* Modal card */}
      <div className="bg-white rounded-2xl flex flex-col items-center px-5 sm:px-8 py-8 sm:py-10 shadow-2xl w-full max-w-[420px]">
        {/* Check circle */}
        <div className="mb-5">
          <CheckIcon />
        </div>

        {/* Title */}
        <h2 className="font-bold mb-2 text-center text-xl sm:text-2xl" style={{ color: "#00462C" }}>
          Order Confirmed!
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 text-center mb-6">
          Thank you for your order from{" "}
          <span className="font-semibold" style={{ color: "#E07B2A" }}>
            Nityagro
          </span>
        </p>

        {/* Order info */}
        <div
          className="w-full rounded-xl px-4 sm:px-6 py-4 mb-6 text-center"
          style={{
            background: "#F0FAF4",
            border: "1px solid #C6E8D4",
          }}
        >
          <p className="text-sm font-bold mb-1" style={{ color: "#00462C" }}>
            Order ID : #{orderId}
          </p>

          <p className="text-sm text-gray-500 break-words">Placed on {placedAt}</p>
        </div>

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="w-full flex items-center justify-center text-white font-bold text-sm rounded-xl transition-all hover:opacity-90 active:scale-[0.99] h-12"
          style={{
            background: "#00462C",
            boxShadow: "0 4px 16px rgba(0,70,44,0.20)",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
