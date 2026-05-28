"use client";

import Breadcrumb from "@/app/adress_book/components/Breadcrumb";
import ShippingAddressCard from "@/app/adress_book/components/ShippingAddressCard";
import OrderItemsList from "@/app/Checkout/components/Orderitemslist";
import OrderSummary from "@/app/adress_book/components/OrderSummary";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { requireLoginForAction } from "@/utils/clientAuthGuard";
import useCheckoutStore from "@/store/checkoutStore";

export default function CheckoutReviewPage() {
  const setAddressesFromServer = useCheckoutStore((state) => state.setAddressesFromServer);

  useEffect(() => {
    if (!requireLoginForAction()) {
      toast.error("Please login to continue checkout");
      return;
    }

    let ignore = false;
    fetch("/api/account/addresses", {
      headers: { Accept: "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((payload) => {
        if (ignore) return;
        setAddressesFromServer(Array.isArray(payload?.data) ? payload.data : []);
      })
      .catch(() => {
        if (!ignore) setAddressesFromServer([]);
      });

    return () => {
      ignore = true;
    };
  }, [setAddressesFromServer]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-10 py-10" style={{ maxWidth: "1440px" }}>
        {/* ── Page title ───────────────────────────────────────────────── */}
        <div className="mb-5">
          <h1 className="font-bold mb-2" style={{ fontSize: "28px", color: "#00462C" }}>
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

        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left column */}
          <div className="flex flex-col flex-1 min-w-0 w-full">
            <ShippingAddressCard />
            <OrderItemsList />
          </div>

          {/* Right column */}
          <div className="w-full lg:w-[280px]">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
