"use client";

// ─── Icons ────────────────────────────────────────────────────────────────────
const CashIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

const ConnectIpsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7h18" />
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M7 12h10M7 15h5" />
  </svg>
);

const METHODS = [
  { id: "cod", label: "Cash on Delivery", Icon: CashIcon, isESewa: false },
  { id: "connectips", label: "ConnectIPS", Icon: ConnectIpsIcon, isESewa: false },
];

export default function PaymentMethodSelector({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Header */}
      <h2 className="font-bold text-gray-900 mb-1 text-lg sm:text-xl">Choose Payment Method</h2>

      <div
        className="mb-6"
        style={{
          height: "2px",
          background: "#00462C",
          borderRadius: "2px",
          width: "200px",
        }}
      />

      {/* Method cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {METHODS.map(({ id, label, Icon }) => {
          const active = selected === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className="flex items-center justify-center gap-3 rounded-xl border-2 font-semibold text-sm transition-all w-full h-[72px]"
              style={{
                borderColor: active ? "#00462C" : "#E5E7EB",
                background: active ? "#F0FAF4" : "white",
                color: active ? "#00462C" : "#374151",
                boxShadow: active ? "0 0 0 1px #00462C22" : "none",
              }}
            >
              {Icon && <Icon />}
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
