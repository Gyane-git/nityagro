"use client";

// app/checkout/review/page.tsx
//
// This is the ORDER REVIEW step of checkout — shown after the user
// saves their delivery address. It displays:
//   Left column  → Shipping Address summary card + Order items list
//   Right column → Order Summary with "Proceed to Pay"

import Breadcrumb          from "@/app/adress_book/components/Breadcrumb";
import ShippingAddressCard from "@/app/adress_book/components/ShippingAddressCard";
import OrderItemsList      from "@/app/Checkout/components/Orderitemslist";
import OrderSummary        from "@/app/adress_book/components/OrderSummary";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { requireLoginForAction } from "@/utils/clientAuthGuard";

export default function CheckoutReviewPage() {
  useEffect(() => {
    if (!requireLoginForAction()) {
      toast.error("Please login to continue checkout");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div
        className="mx-auto px-10 py-10"
        style={{ maxWidth: "1440px" }}
      >

        {/* ── Page title ───────────────────────────────────────────────── */}
        <div className="mb-5">
          <h1
            className="font-bold mb-2"
            style={{ fontSize: "28px", color: "#00462C" }}
          >
            Checkout
          </h1>
          <div
            style={{
              width: "160px",
              height: "2.5px",
              background: "#00462C",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <div className="mb-8">
          <Breadcrumb />
        </div>

        {/* ── Two-column layout ────────────────────────────────────────── */}
        {/*
         *  Left  → Shipping address card + order items  (flex-1)
         *  Right → Order summary panel                  (300px fixed)
         *  gap-6 = 24px gutter
         */}
        <div className="flex sm:flex-row items-start gap-6">

          {/* Left column */}
          <div className="flex flex-col flex-1 min-w-0">
            <ShippingAddressCard />
            <OrderItemsList />
          </div>

          {/* Right column */}
          <OrderSummary />

        </div>
      </div>
    </div>
  );
}
