"use client";

const LocationIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const TruckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function DeliveryCard() {
  return (
    <div
      className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white"
      style={{ width: "220px", flexShrink: 0 }}
    >
      {/* ── Delivery Options ── */}
      <div className="p-4 flex flex-col gap-3 border-b border-gray-200">
        <h4 className="font-bold text-gray-800" style={{ fontSize: "14px" }}>
          Delivery Options
        </h4>

        {/* Location row */}
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex-shrink-0">
            <LocationIcon />
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs text-gray-600 leading-snug">
              Bagmati, Kathmandu, Metro
            </p>
            <p className="text-xs text-gray-600 leading-snug">
              22 - Newroad Area, Newroad
            </p>
            <button
              className="text-xs font-semibold mt-0.5 text-left"
              style={{ color: "#00462C" }}
            >
              Change
            </button>
          </div>
        </div>

        {/* Standard Delivery */}
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex-shrink-0">
            <TruckIcon />
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-semibold text-gray-700">
              Standard Delivery
            </p>
            <p className="text-xs text-gray-500">Get by 22-23 April</p>
          </div>
        </div>
      </div>

      {/* ── Return & Warranty ── */}
      <div className="p-4 flex flex-col gap-3">
        <h4 className="font-bold text-gray-800" style={{ fontSize: "14px" }}>
          Return &amp; Warranty
        </h4>

        {/* 7 Days Free Return */}
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex-shrink-0">
            <ShieldIcon />
          </span>
          <p className="text-xs text-gray-600">7 Days Free Return</p>
        </div>

        {/* Warranty not available */}
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex-shrink-0">
            <ShieldIcon />
          </span>
          <p className="text-xs text-gray-500">Warranty not available</p>
        </div>
      </div>
    </div>
  );
}