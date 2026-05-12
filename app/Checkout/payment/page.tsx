"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OrderSummary from "@/app/adress_book/components/OrderSummary";
import Breadcrumb from "@/app/adress_book/components/Breadcrumb";
import PaymentMethodSelector from "@/app/Checkout/payment/Paymentmethodselector";
import OrderConfirmedModal from "@/app/Checkout/payment/Orderconfirmedmodal";
import useCheckoutStore from "@/store/checkoutStore";
import useCartStore from "@/store/cartStore";
import toast from "react-hot-toast";

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");
  const [placedAt, setPlacedAt] = useState("");
  const [processing, setProcessing] = useState(false);
  const checkoutItems = useCheckoutStore((state) => state.checkoutItems);
  const checkoutItem = useCheckoutStore((state) => state.checkoutItem);
  const clearCheckoutItem = useCheckoutStore((state) => state.clearCheckoutItem);
  const getSelectedAddress = useCheckoutStore((state) => state.getSelectedAddress);
  const removeItems = useCartStore((state) => state.removeItems);

  const placeCodOrder = async () => {
    const sourceItems =
      checkoutItems.length > 0 ? checkoutItems : checkoutItem ? [checkoutItem] : [];

    if (sourceItems.length === 0) {
      toast.error("No checkout items selected");
      return;
    }

    if (processing) return;

    try {
      const selectedAddress = getSelectedAddress?.();
      if (!selectedAddress) {
        toast.error("Please select delivery address first");
        router.push("/profile?tab=address&next=/Checkout/payment");
        return;
      }

      setProcessing(true);

      const localUserId =
        typeof window !== "undefined"
          ? window.localStorage.getItem("userId")
          : null;
      const parsedUserId = Number(localUserId || 1);

      const payload = {
        paymentMethod: "COD",
        items: sourceItems.map((item) => ({
          id: item.id,
          qty: item.qty,
          unitPrice: item.unitPrice,
          total: item.total,
          name: item.name,
        })),
        address: selectedAddress ?? null,
        userId: Number.isFinite(parsedUserId) && parsedUserId > 0 ? parsedUserId : 1,
      };

      const res = await fetch("/api/orders/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        toast.error(data?.message || "Order placement failed");
        return;
      }

      const orderedIds = sourceItems.map((item) => item.id);
      removeItems(orderedIds);
      clearCheckoutItem();

      setConfirmedOrderId(data?.data?.orderIds?.[0] || "");
      setPlacedAt(new Date().toLocaleString());
      setShowConfirmation(true);
      toast.success("Order placed successfully");
    } catch (err) {
      console.error("COD error:", err);
      toast.error("Order placement failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleProceed = () => {
    if (paymentMethod !== "cod") {
      toast.error("Only Cash on Delivery is enabled right now");
      return;
    }
    placeCodOrder();
  };

  const handleContinue = () => {
    setShowConfirmation(false);
    router.push("/products");
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
            <OrderSummary onProceed={handleProceed} processing={processing} />
          </div>
        </div>
      </div>

      {showConfirmation && (
        <OrderConfirmedModal
          orderId={confirmedOrderId || "-"}
          placedAt={placedAt || new Date().toLocaleString()}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
