"use client";

import { useRouter } from "next/navigation";
import useCheckoutStore from "@/store/checkoutStore";

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.4 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export default function ShippingAddressCard() {
  const router = useRouter();
  const selectedAddress = useCheckoutStore((state) => state.getSelectedAddress());

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Header row */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-bold text-gray-900" style={{ fontSize: "20px" }}>
          Shipping Address
        </h2>
        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors" onClick={() => router.push("/profile?tab=address&next=/Checkout")}>
          <EditIcon />
          Edit
        </button>
      </div>

      {/* underline */}
      <div className="mb-4 w-[120px] sm:w-[160px]" style={{ height: "2px", background: "#00462C", borderRadius: "2px" }} />

      {/* Address card */}
      {!selectedAddress ? (
        <div className="border border-amber-200 rounded-xl bg-amber-50 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-amber-800">Shipping address required</p>
            <p className="text-xs text-amber-700 mt-1">Please add/select your shipping address before placing an order.</p>
          </div>
          <button onClick={() => router.push("/profile?tab=address&next=/Checkout")} className="rounded-md bg-[#00462C] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            Add Address
          </button>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl bg-white px-6 py-5 flex flex-col gap-4">
          {/* Row 1: name, phone, email, location */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-x-6 gap-y-3">
            <span className="flex items-center gap-2 text-sm text-gray-700">
              <UserIcon />
              {selectedAddress?.fullName || "N/A"}
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-700">
              <PhoneIcon />
              {selectedAddress?.phone || "N/A"}
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-700">
              <MailIcon />
              {selectedAddress?.email || "N/A"}
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-700">
              <MapPinIcon />
              {[selectedAddress?.city, selectedAddress?.region].filter(Boolean).join(", ") || "N/A"}
            </span>
          </div>

          {/* Row 2: full address + label badge */}
          <div className="flex items-center gap-3">
            <MapPinIcon />
            <span className="text-sm text-gray-700">{[selectedAddress?.building, selectedAddress?.area, selectedAddress?.colony, selectedAddress?.address].filter(Boolean).join(", ") || "N/A"}</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white ml-1" style={{ background: "#00462C" }}>
              {selectedAddress?.label || "Home"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
