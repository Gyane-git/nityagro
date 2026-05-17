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

type CheckoutSourceItem = {
  id: number;
  qty?: number;
  unitPrice?: number;
  total?: number;
  name?: string;
};

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

  const getTotalAmount = (sourceItems: CheckoutSourceItem[]) => {
    const itemTotal = sourceItems.reduce(
      (sum, item) => sum + Number(item.total ?? item.unitPrice ?? 0),
      0,
    );
    const deliveryCharge = itemTotal > 0 ? 200 : 0;
    return Number((itemTotal + deliveryCharge).toFixed(2));
  };

  const placeCodOrder = async () => {
    const sourceItems: CheckoutSourceItem[] =
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
        items: sourceItems.map((item: CheckoutSourceItem) => ({
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

  const startConnectIpsPayment = async () => {
    const sourceItems: CheckoutSourceItem[] =
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
        typeof window !== "undefined" ? window.localStorage.getItem("userId") : null;
      const parsedUserId = Number(localUserId || 1);

      const normalizedItems = sourceItems.map((item) => ({
        id: Number(item.id),
        qty: Math.max(1, Number(item.qty ?? 1)),
        unitPrice: Number(item.unitPrice ?? item.total ?? 0),
        total: Number(item.total ?? item.unitPrice ?? 0),
        name: item.name || "",
      }));

      const amount = getTotalAmount(sourceItems);
      const initRes = await fetch("/connectips/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          userId: Number.isFinite(parsedUserId) && parsedUserId > 0 ? parsedUserId : 1,
          items: normalizedItems,
          address: selectedAddress,
          addressId: Number(selectedAddress.id),
        }),
      });

      const initData = await initRes.json();
      if (!initRes.ok || !initData?.success) {
        toast.error(initData?.message || "Unable to initialize ConnectIPS");
        return;
      }

      const referenceId = String(initData.referenceId || "");
      if (referenceId) {
        window.sessionStorage.setItem(
          `connectips_intent_${referenceId}`,
          JSON.stringify({
            referenceId,
            amount,
            addressId: Number(selectedAddress.id),
            address: selectedAddress,
            userId: Number.isFinite(parsedUserId) && parsedUserId > 0 ? parsedUserId : 1,
            items: normalizedItems,
          }),
        );
        window.sessionStorage.setItem("connectips_last_reference", referenceId);
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = initData.gatewayUrl;
      form.style.display = "none";

      Object.entries(initData.payload || {}).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value ?? "");
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("ConnectIPS init error:", err);
      toast.error("Unable to start ConnectIPS payment");
    } finally {
      setProcessing(false);
    }
  };

  const handleProceed = () => {
    if (paymentMethod === "cod") {
      placeCodOrder();
      return;
    }
    if (paymentMethod === "connectips") {
      startConnectIpsPayment();
      return;
    }
    toast.error("Unsupported payment method");
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
