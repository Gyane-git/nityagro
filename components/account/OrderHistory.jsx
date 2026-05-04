"use client";

import { useState } from "react";

const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="13"
    height="13"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="15"
    height="15"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ORDERS = [
  {
    id: 1,
    name: "Yellow Mustard Oil",
    weight: "100 gm",
    date: "28 Apr 2026",
    unitPrice: "NPR 125.00",
    qty: 1,
    total: "NPR 1,250.00",
    status: "Processing",
  },
  {
    id: 2,
    name: "Yellow Mustard Oil",
    weight: "100 gm",
    date: "28 Apr 2026",
    unitPrice: "NPR 125.00",
    qty: 1,
    total: "NPR 1,250.00",
    status: "Delivered",
  },
  {
    id: 3,
    name: "Jaggery Powder",
    weight: "100 gm",
    date: "28 Apr 2026",
    unitPrice: "NPR 125.00",
    qty: 1,
    total: "NPR 1,250.00",
    status: "Delivered",
  },
  {
    id: 4,
    name: "Jaggery Powder",
    weight: "100 gm",
    date: "28 Apr 2026",
    unitPrice: "NPR 125.00",
    qty: 1,
    total: "NPR 1,250.00",
    status: "Delivered",
  },
];

function StatusBadge({ status }) {
  const styles = {
    Processing: "bg-[#FFF3CD] text-[#B8860B]",
    Delivered: "bg-[#2e5e2e] text-white",
    Cancelled: "bg-red-100 text-red-600",
    Pending: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`inline-flex items-center justify-center px-5 py-1.5 rounded-md text-[12.5px] font-semibold ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
}

// Product image
function ProductImage({ name }) {
  return (
    <div className="w-16 h-16 rounded-md bg-amber-50 border border-amber-100 shrink-0 flex items-center justify-center overflow-hidden">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#DB8F00"
        strokeWidth="1.5"
        opacity="0.45"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-4">
      {/* Product image */}
      <ProductImage name={order.name} />

      {/* Name / weight / date */}
      <div className="w-37.5 shrink-0">
        <p className="text-[13.5px] font-semibold text-gray-800 leading-snug">
          {order.name}
        </p>
        <p className="text-[12px] text-gray-400 mt-0.5">
          Weight: {order.weight}
        </p>
        <div className="flex items-center gap-1 mt-1.5 text-gray-400">
          <CalendarIcon />
          <span className="text-[12px]">{order.date}</span>
        </div>
      </div>

      {/* Unit price */}
      <div className="flex-1 text-[13px] text-gray-500">{order.unitPrice}</div>

      {/* Qty */}
      <div className="text-[13px] text-gray-500 w-14">
        Qty: <span className="font-semibold text-gray-700">{order.qty}</span>
      </div>

      {/* Total */}
      <div className="text-[13.5px] font-semibold text-gray-800 w-28 text-right">
        {order.total}
      </div>

      {/* Status */}
      <div className="w-28 flex justify-center shrink-0">
        <StatusBadge status={order.status} />
      </div>

      {/* View Details */}
      <button className="ml-1 px-4 py-2 border border-gray-300 rounded-md text-[12.5px] text-gray-600 font-medium hover:border-[#2e5e2e] hover:text-[#2e5e2e] transition-colors whitespace-nowrap shrink-0">
        View Details
      </button>
    </div>
  );
}

export default function OrderHistory() {
  const [search, setSearch] = useState("");

  const filtered = ORDERS.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* Header */}
      <h2 className="text-xl font-bold text-[#2e5e2e] mb-0.5">Order History</h2>
      <p className="text-[13px] text-gray-400 mb-4">
        Currently active and recent purchases.
      </p>

      {/* Search */}
      <div className="relative w-60 mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-[13px] text-gray-600 placeholder-gray-400 outline-none focus:border-[#DB8F00] bg-[#fcfcfb] transition-colors"
        />
      </div>

      {/* Order cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 px-6 py-12 text-center text-[13px] text-gray-400">
            No orders found.
          </div>
        ) : (
          filtered.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}
