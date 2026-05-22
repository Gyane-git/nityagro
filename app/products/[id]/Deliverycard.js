"use client";
import { useEffect, useMemo, useState } from "react";
import { apiGetRequest } from "@/apihelper/apiHelper";

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

function formatDeliveryRange(daysValue) {
  const parsedDays = Number(daysValue);
  if (!Number.isFinite(parsedDays) || parsedDays <= 0) {
    return "Estimated delivery date unavailable";
  }

  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  start.setDate(now.getDate() + parsedDays);
  end.setDate(now.getDate() + parsedDays + 1);

  const fmt = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
  });
  return `Get by ${fmt.format(start)} - ${fmt.format(end)}`;
}

export default function DeliveryCard({ deliveryTargetDays }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const ADD_NEW_VALUE = "__add_new_address__";

  useEffect(() => {
    const run = async () => {
      const localUserId = typeof window !== "undefined" ? window.localStorage.getItem("userId") : null;
      const userId = localUserId || "1";
      const response = await apiGetRequest(`/account/addresses?userId=${userId}`, false);
      if (!response?.success) return;
      const rows = Array.isArray(response?.data) ? response.data : [];
      setAddresses(rows);
      if (rows[0]?.id) {
        setSelectedId(String(rows[0].id));
      }
    };
    run();
  }, []);

  const selectedAddress = useMemo(() => {
    if (!addresses.length) return null;
    const byId = addresses.find((item) => String(item.id) === String(selectedId));
    return byId || addresses[0];
  }, [addresses, selectedId]);

  const addressLine1 = selectedAddress ? [selectedAddress.region, selectedAddress.district, selectedAddress.city].filter(Boolean).join(", ") : "No saved address";
  const addressLine2 = selectedAddress ? [selectedAddress.colony, selectedAddress.area].filter(Boolean).join(", ") : "Add address from Profile";
  const deliveryText = formatDeliveryRange(deliveryTargetDays);

  return (
    // <div
    //   className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white"
    //   style={{ width: "220px", flexShrink: 0 }}
    // >
    //   {/* ── Delivery Options ── */}
    //   <div className="p-4 flex flex-col gap-3 border-b border-gray-200">
    //     <h4 className="font-bold text-gray-800" style={{ fontSize: "14px" }}>
    //       Delivery Options
    //     </h4>

    //     {/* Location row */}
    //     <div className="flex items-start gap-2">
    //       <span className="mt-0.5 flex-shrink-0">
    //         <LocationIcon />
    //       </span>
    //       <div className="flex flex-col gap-0.5">
    //         <p className="text-xs text-gray-600 leading-snug">
    //           {addressLine1}
    //         </p>
    //         <p className="text-xs text-gray-600 leading-snug">
    //           {addressLine2 || "N/A"}
    //         </p>
    //         {addresses.length > 0 ? (
    //           <div className="mt-1 flex items-center justify-between gap-1.5 w-full">
    //             <select
    //               className="text-xs border border-gray-300 rounded px-1.5 py-1 text-gray-700 flex-1 min-w-0"
    //               value={selectedId}
    //               onChange={(e) => {
    //                 const value = e.target.value;
    //                 if (value === ADD_NEW_VALUE) {
    //                   window.location.href = "/profile?tab=address";
    //                   return;
    //                 }
    //                 setSelectedId(value);
    //               }}
    //             >
    //               <option value={ADD_NEW_VALUE}>+ Add New Address</option>
    //               {addresses.map((address) => (
    //                 <option key={address.id} value={String(address.id)}>
    //                   {address.fullName} - {address.city}
    //                 </option>
    //               ))}
    //             </select>
    //           </div>
    //         ) : (
    //           <a
    //             href="/profile?tab=address"
    //             className="text-xs font-semibold mt-0.5 text-left"
    //             style={{ color: "#00462C" }}
    //           >
    //             Add Address
    //           </a>
    //         )}
    //       </div>
    //     </div>

    //     {/* Standard Delivery */}
    //     <div className="flex items-start gap-2">
    //       <span className="mt-0.5 flex-shrink-0">
    //         <TruckIcon />
    //       </span>
    //       <div className="flex flex-col gap-0.5">
    //         <p className="text-xs font-semibold text-gray-700">
    //           Standard Delivery
    //         </p>
    //         <p className="text-xs text-gray-500">{deliveryText}</p>
    //       </div>
    //     </div>
    //   </div>

    //   {/* ── Return & Warranty ── */}
    //   <div className="p-4 flex flex-col gap-3">
    //     <h4 className="font-bold text-gray-800" style={{ fontSize: "14px" }}>
    //       Return &amp; Warranty
    //     </h4>

    //     {/* 7 Days Free Return */}
    //     <div className="flex items-start gap-2">
    //       <span className="mt-0.5 flex-shrink-0">
    //         <ShieldIcon />
    //       </span>
    //       <p className="text-xs text-gray-600">7 Days Free Return</p>
    //     </div>

    //     {/* Warranty not available */}
    //     <div className="flex items-start gap-2">
    //       <span className="mt-0.5 flex-shrink-0">
    //         <ShieldIcon />
    //       </span>
    //       <p className="text-xs text-gray-500">Warranty not available</p>
    //     </div>
    //   </div>
    // </div>

    <>
      {/* ── DeliveryCard ── */}
      <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white w-full lg:w-[220px] lg:flex-shrink-0">
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
              <p className="text-xs text-gray-600 leading-snug">{addressLine1}</p>
              <p className="text-xs text-gray-600 leading-snug">{addressLine2 || "N/A"}</p>
              {addresses.length > 0 ? (
                <div className="mt-1 flex items-center justify-between gap-1.5 w-full">
                  <select
                    className="text-xs border border-gray-300 rounded px-1.5 py-1 text-gray-700 flex-1 min-w-0"
                    value={selectedId}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === ADD_NEW_VALUE) {
                        window.location.href = "/profile?tab=address";
                        return;
                      }
                      setSelectedId(value);
                    }}
                  >
                    <option value={ADD_NEW_VALUE}>+ Add New Address</option>
                    {addresses.map((address) => (
                      <option key={address.id} value={String(address.id)}>
                        {address.fullName} - {address.city}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <a href="/profile?tab=address" className="text-xs font-semibold mt-0.5 text-left" style={{ color: "#00462C" }}>
                  Add Address
                </a>
              )}
            </div>
          </div>

          {/* Standard Delivery */}
          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex-shrink-0">
              <TruckIcon />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold text-gray-700">Standard Delivery</p>
              <p className="text-xs text-gray-500">{deliveryText}</p>
            </div>
          </div>
        </div>

        {/* ── Return & Warranty ── */}
        <div className="p-4 flex flex-col gap-3">
          <h4 className="font-bold text-gray-800" style={{ fontSize: "14px" }}>
            Return &amp; Warranty
          </h4>

          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex-shrink-0">
              <ShieldIcon />
            </span>
            <p className="text-xs text-gray-600">7 Days Free Return</p>
          </div>

          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex-shrink-0">
              <ShieldIcon />
            </span>
            <p className="text-xs text-gray-500">Warranty not available</p>
          </div>
        </div>
      </div>
    </>
  );
}