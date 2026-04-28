"use client";

import { useState } from "react";

// Reuse from previous checkout steps
import OrderSummary from "@/app/adress_book/components/OrderSummary"
import Breadcrumb   from "@/app/adress_book/components/Breadcrumb";

// New components for this step
import PaymentMethodSelector from "@/app/Checkout/payment/Paymentmethodselector"
import OrderConfirmedModal   from "@/app/Checkout/payment/Orderconfirmedmodal";

/*
 * NOTE: Adjust the import paths above to match your actual project structure.
 * If OrderSummary and Breadcrumb live in a shared /components folder, update accordingly:
 *   import OrderSummary from "@/components/OrderSummary";
 *   import Breadcrumb   from "@/components/Breadcrumb";
 */

export default function CheckoutPaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleProceed = () => {
    // In real usage: call your payment API here,
    // then show the modal on success.
    setShowConfirmation(true);
  };

  const handleContinue = () => {
    setShowConfirmation(false);
    // Redirect to home or orders page:
    // router.push("/account/orders");
  };

  return (
    <div className="min-h-screen bg-white">
      <div
        className="mx-auto px-10 py-10"
        style={{ maxWidth: "1440px" }}
      >
        {/* ── Page title ─────────────────────────────────────────────── */}
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

        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <Breadcrumb />
        </div>

        {/* ── Two-column layout ──────────────────────────────────────── */}
        <div className="flex items-start gap-6">

          {/* Left: payment method picker */}
          <PaymentMethodSelector
            selected={paymentMethod}
            onSelect={setPaymentMethod}
          />

          {/* Right: reused OrderSummary — "Proceed to Pay" triggers modal */}
          <div style={{ width: "300px", flexShrink: 0 }}>
            {/*
             * OrderSummary already has its own "Proceed to Pay" button.
             * To wire the button to handleProceed, either:
             *   (a) Accept an onProceed prop in OrderSummary, OR
             *   (b) Use the wrapper approach below to overlay the button.
             *
             * Simplest approach — wrap and override with an onClick prop:
             */}
            <OrderSummary onProceed={handleProceed} />
          </div>

        </div>
      </div>

      {/* ── Order confirmed modal ───────────────────────────────────── */}
      {showConfirmation && (
        <OrderConfirmedModal
          orderId="145028740"
          placedAt="August 12, 2025 10:39:44 EST"
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}

// ─── Inline variant of OrderSummary that accepts onProceed ───────────────────
// This avoids modifying the shared OrderSummary component.
function OrderSummaryWithAction({ onProceed }: { onProceed: () => void }) {
  return (
    <div
      className="flex flex-col border border-gray-200 rounded-xl bg-white px-6 py-6"
      style={{ width: "300px" }}
    >
      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: "20px" }}>
        Order Summary
      </h2>
      <div
        className="mb-5"
        style={{ height: "2px", background: "#00462C", borderRadius: "2px", width: "100%" }}
      />

      <div className="flex flex-col gap-3 mb-5">
        {[
          { label: "Item(s) total",   value: "NPR 1250.00"  },
          { label: "Discount",        value: "- NPR 350.00" },
          { label: "Delivery Charge", value: "NPR 200.00"   },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-800">{value}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 mb-4" />

      <div className="flex items-center justify-between mb-6">
        <span className="text-base font-bold text-gray-900">Total Amount</span>
        <span className="text-base font-bold" style={{ color: "#00462C" }}>
          NPR 1150.00
        </span>
      </div>

      <button
        onClick={onProceed}
        className="w-full flex items-center justify-center text-white font-bold text-sm rounded-lg transition-all hover:opacity-90 active:scale-[0.99]"
        style={{
          background: "#00462C",
          height: "48px",
          boxShadow: "0 4px 16px rgba(0,70,44,0.20)",
        }}
      >
        Proceed to Pay
      </button>
    </div>
  );
}