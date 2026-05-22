"use client";

import { useEffect, useState } from "react";
import CartItems from "./Cartitems";
import OrderSummary from "./Ordersummary";
import Link from "next/link";
import useToastStore from "@/store/toastStore";
import { requireLoginForAction } from "@/utils/clientAuthGuard";

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 mb-6">
      <Link href="/" className="hover:text-[#00462C] transition-colors">
        Home
      </Link>
      <span className="text-gray-400">›</span>
      <span className="font-semibold text-gray-700">Cart</span>
    </nav>
  );
}

export default function CartPage() {
  const [checkedIds, setCheckedIds] = useState([]);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    if (!requireLoginForAction()) {
      showToast("Please login to view your cart");
    }
  }, [showToast]);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" style={{ maxWidth: "1440px" }}>
        {/* Page title */}
        <div className="mb-2">
          <h1 className="font-bold text-2xl sm:text-[28px]" style={{ color: "#00462C" }}>
            Shopping Cart
          </h1>
          <div className="mt-2" style={{ width: "160px", height: "2.5px", background: "#00462C", borderRadius: "2px" }} />
        </div>

        {/* Breadcrumb */}
        <div className="mt-4">
          <Breadcrumb />
        </div>

        {/* Main layout: stacks on mobile, side-by-side on lg+ */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Cart items — takes remaining width */}
          <div className="w-full min-w-0">
            <CartItems checkedIds={checkedIds} setCheckedIds={setCheckedIds} />
          </div>

          {/* Order summary — full width on mobile, fixed 340px on desktop */}
          <div className="w-full lg:w-[340px] lg:flex-shrink-0">
            <OrderSummary checkedIds={checkedIds} />
          </div>
        </div>
      </div>
    </main>
  );
}
