"use client";
import { useState } from "react";
import OrderSummary from "@/app/adress_book/components/OrderSummary";
import Breadcrumb from "@/app/adress_book/components/Breadcrumb";
import PaymentMethodSelector from "@/app/Checkout/payment/Paymentmethodselector";
import OrderConfirmedModal from "@/app/Checkout/payment/Orderconfirmedmodal";

export default function CheckoutPaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleEsewaPayment = async () => {
    try {
      const res = await fetch("/api/esewa/pay", {
        method: "POST",
        body: JSON.stringify({
          orderId: "YOUR_DYNAMIC_ORDER_ID", // replacable
        }),
      });

      const data = await res.json();

      // Create form dynamically
      const form = document.createElement("form");
      form.method = "POST";
      form.action = process.env.NEXT_PUBLIC_ESEWA_PAYMENT_URL!;

      Object.entries(data).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("eSewa error:", err);
    }
  };

  const handleProceed = () => {
    if (paymentMethod === "esewa") {
      handleEsewaPayment();
    } else {
      setShowConfirmation(true);
    }
  };

  const handleContinue = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-10 py-10" style={{ maxWidth: "1440px" }}>
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

        <div className="mb-8">
          <Breadcrumb />
        </div>

        <div className="flex items-start gap-6">
          <PaymentMethodSelector
            selected={paymentMethod}
            onSelect={setPaymentMethod}
          />

          <div style={{ width: "300px", flexShrink: 0 }}>
            <OrderSummary onProceed={handleProceed} />
          </div>
        </div>
      </div>

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
