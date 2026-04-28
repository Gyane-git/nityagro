"use client";

// ─── Icons ────────────────────────────────────────────────────────────────────
const CashIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

const BankIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 22h18M3 10h18M5 10V6M19 10V6M12 10V6M2 6l10-4 10 4" />
    <rect x="5" y="14" width="3" height="6" />
    <rect x="10.5" y="14" width="3" height="6" />
    <rect x="16" y="14" width="3" height="6" />
  </svg>
);

// eSewa logo pill
const ESewaLogo = () => (
  <div className="flex items-center gap-2">
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center"
      style={{ background: "#60BB46" }}
    >
      <span className="text-white font-bold text-xs">e</span>
    </div>
    <span className="text-white font-bold text-lg tracking-wide">Sewa</span>
  </div>
);

const METHODS = [
  { id: "esewa",   label: "eSewa",           Icon: null,     isESewa: true  },
  { id: "cod",     label: "Cash on Delivery", Icon: CashIcon, isESewa: false },
  { id: "bank",    label: "Bank Transfer",    Icon: BankIcon, isESewa: false },
];

export default function PaymentMethodSelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Header */}
      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: "20px" }}>
        Choose Payment Method
      </h2>
      <div
        className="mb-6"
        style={{ height: "2px", background: "#00462C", borderRadius: "2px", width: "200px" }}
      />

      {/* Method cards */}
      <div className="flex items-center gap-4">
        {METHODS.map(({ id, label, Icon, isESewa }) => {
          const active = selected === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className="flex items-center justify-center gap-3 rounded-xl border-2 font-semibold text-sm transition-all"
              style={{
                width: "220px",
                height: "72px",
                borderColor: active ? "#00462C" : "#E5E7EB",
                background:  isESewa && active ? "#00462C"
                           : isESewa          ? "#00462C"
                           : active           ? "#F0FAF4"
                           : "white",
                color:  isESewa ? "white" : active ? "#00462C" : "#374151",
                boxShadow: active && !isESewa ? "0 0 0 1px #00462C22" : "none",
              }}
            >
              {isESewa ? (
                <ESewaLogo />
              ) : (
                <>
                  {Icon && <Icon />}
                  <span>{label}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}