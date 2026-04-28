"use client";

import Image from "next/image";
import { useState } from "react";

// ─── Icons ──────────────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Initial cart items ──────────────────────────────────────────────────────
const INITIAL_ITEMS = [
  { id: 1, name: "Yellow Mustard Oil", weight: "100 gm", price: 125, qty: 1, image: "/products/red-chilli.png" },
  { id: 2, name: "Yellow Mustard Oil", weight: "100 gm", price: 125, qty: 1, image: "/products/jaggery.png" },
  { id: 3, name: "Yellow Mustard Oil", weight: "100 gm", price: 125, qty: 1, image: "/products/mustard-oil.png" },
];

// ─── Qty spinner ─────────────────────────────────────────────────────────────
function QtySpinner({ value, onChange }) {
  return (
    <div
      className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-gray-50"
      style={{ width: "64px", height: "38px" }}
    >
      <span
        className="flex-1 text-center text-sm font-semibold text-gray-800 select-none"
      >
        {value}
      </span>
      <div className="flex flex-col border-l border-gray-200 h-full">
        <button
          onClick={() => onChange(value + 1)}
          className="flex-1 flex items-center justify-center hover:bg-gray-100 transition-colors px-1.5"
        >
          <ChevronUpIcon />
        </button>
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          className="flex-1 flex items-center justify-center hover:bg-gray-100 transition-colors px-1.5 border-t border-gray-200"
        >
          <ChevronDownIcon />
        </button>
      </div>
    </div>
  );
}

// ─── Single cart row ─────────────────────────────────────────────────────────
function CartRow({ item, checked, onCheck, onQtyChange, onRemove }) {
  const subtotal = item.price * item.qty;

  return (
    <>
      <div className="flex items-center gap-5 py-5">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={checked}
          onChange={onCheck}
          className="w-4 h-4 rounded border-gray-300 flex-shrink-0 cursor-pointer"
          style={{ accentColor: "#00462C" }}
        />

        {/* Product image */}
        <div
          className="relative flex-shrink-0 bg-gray-50 rounded-md border border-gray-100"
          style={{ width: "80px", height: "80px" }}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain p-2"
            sizes="80px"
          />
        </div>

        {/* Name + weight */}
        <div className="flex flex-col gap-0.5" style={{ minWidth: "180px" }}>
          <p className="text-sm font-semibold text-gray-800">{item.name}</p>
          <p className="text-xs text-gray-500">Weight: {item.weight}</p>
        </div>

        {/* Price */}
        <div className="flex-1 text-center">
          <p className="text-sm text-gray-500 font-medium">
            NPR {item.price.toFixed(2)}
          </p>
        </div>

        {/* Qty spinner */}
        <div style={{ width: "80px" }} className="flex justify-center">
          <QtySpinner value={item.qty} onChange={(v) => onQtyChange(item.id, v)} />
        </div>

        {/* Subtotal */}
        <div style={{ width: "130px" }} className="text-right">
          <p className="font-bold" style={{ color: "#00462C", fontSize: "15px" }}>
            NPR {(subtotal * 10).toLocaleString("en-NP", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Delete */}
        <button
          onClick={() => onRemove(item.id)}
          className="flex-shrink-0 ml-2 p-1 rounded hover:bg-red-50 transition-colors"
          aria-label="Remove item"
        >
          <TrashIcon />
        </button>
      </div>

      {/* Row divider */}
      <div className="border-t border-gray-100" />
    </>
  );
}

// ─── Main CartItems component ─────────────────────────────────────────────────
export default function CartItems({ onCartChange }) {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [checkedIds, setCheckedIds] = useState([]);

  const allChecked = items.length > 0 && checkedIds.length === items.length;

  const toggleSelectAll = () => {
    if (allChecked) setCheckedIds([]);
    else setCheckedIds(items.map((i) => i.id));
  };

  const toggleCheck = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleQtyChange = (id, qty) => {
    const updated = items.map((i) => (i.id === id ? { ...i, qty } : i));
    setItems(updated);
    onCartChange?.(updated);
  };

  const handleRemove = (id) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    setCheckedIds((prev) => prev.filter((x) => x !== id));
    onCartChange?.(updated);
  };

  const handleClearCart = () => {
    setItems([]);
    setCheckedIds([]);
    onCartChange?.([]);
  };

  return (
    <div
      className="flex flex-col border border-gray-200 rounded-xl bg-white overflow-hidden"
      style={{ flex: 1, minWidth: 0 }}
    >
      {/* ── Select All header ── */}
      <div className="flex items-center gap-3 px-6 pt-5 pb-4">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={toggleSelectAll}
          className="w-4 h-4 rounded border-gray-300 cursor-pointer"
          style={{ accentColor: "#00462C" }}
        />
        <span className="text-sm font-medium text-gray-700">Select All</span>
      </div>

      {/* ── Column headers ── */}
      <div className="flex items-center gap-5 px-6 py-2 border-t border-b border-gray-200 bg-gray-50">
        <div style={{ width: "16px" }} />
        <div style={{ width: "80px" }} />
        {/* Product label */}
        <p className="text-sm font-bold text-gray-800" style={{ minWidth: "180px" }}>
          Product
        </p>
        {/* Price */}
        <p className="flex-1 text-center text-sm font-bold text-gray-800">Price</p>
        {/* Qty */}
        <p className="text-sm font-bold text-gray-800 text-center" style={{ width: "80px" }}>
          Qty
        </p>
        {/* Sub Total */}
        <p className="text-sm font-bold text-gray-800 text-right" style={{ width: "130px" }}>
          Sub Total
        </p>
        {/* Delete spacer */}
        <div style={{ width: "34px" }} />
      </div>

      {/* ── Cart rows ── */}
      <div className="flex flex-col px-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-gray-400 text-sm font-medium">Your cart is empty.</p>
            <a
              href="/products"
              className="text-sm font-semibold underline"
              style={{ color: "#00462C" }}
            >
              Browse Products
            </a>
          </div>
        ) : (
          items.map((item) => (
            <CartRow
              key={item.id}
              item={item}
              checked={checkedIds.includes(item.id)}
              onCheck={() => toggleCheck(item.id)}
              onQtyChange={handleQtyChange}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>

      {/* ── Footer: Continue Shopping + Clear Cart ── */}
      <div className="flex items-center justify-between px-6 py-5 mt-2">
        <a
          href="/products"
          className="inline-flex items-center justify-center border-2 rounded-lg font-semibold text-sm transition-all hover:bg-gray-50"
          style={{
            borderColor: "#00462C",
            color: "#00462C",
            width: "200px",
            height: "44px",
          }}
        >
          Continue Shopping
        </a>

        <button
          onClick={handleClearCart}
          className="inline-flex items-center justify-center border-2 rounded-lg font-semibold text-sm transition-all hover:bg-amber-50"
          style={{
            borderColor: "#F5A623",
            color: "#F5A623",
            width: "160px",
            height: "44px",
          }}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}