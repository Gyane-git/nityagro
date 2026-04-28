"use client";

import { useState } from "react";
import CartItems from "./Cartitems";
import OrderSummary from "./Ordersummary";

// ─── Breadcrumb ──────────────────────────────────────────────────────────────
function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 mb-6">
      <a href="/" className="hover:text-[#00462C] transition-colors">
        Home
      </a>
      <span className="text-gray-400">›</span>
      <span className="font-semibold text-gray-700">Cart</span>
    </nav>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const [cartItems, setCartItems] = useState(null);

  return (
    <main className="min-h-screen bg-white">
      <div
        className="mx-auto px-8 py-8"
        style={{ maxWidth: "1440px" }}
      >
        {/* ── Page title ── */}
        <div className="mb-2">
          <h1
            className="font-bold"
            style={{ color: "#00462C", fontSize: "28px" }}
          >
            Shopping Cart
          </h1>
          {/* Green underline */}
          <div
            className="mt-2"
            style={{
              width: "160px",
              height: "2.5px",
              background: "#00462C",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* ── Breadcrumb ── */}
        <div className="mt-4">
          <Breadcrumb />
        </div>

        {/* ── Main layout: Cart Items (left) + Order Summary (right) ── */}
        <div className="flex gap-6 items-start">
          {/* Left: cart items table */}
          <CartItems onCartChange={setCartItems} />

          {/* Right: order summary */}
          <OrderSummary />
        </div>
      </div>
    </main>
  );
}