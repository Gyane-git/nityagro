"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Banner from "@/app/products/Banner";
import { requireLoginForAction } from "@/utils/clientAuthGuard";
import useToastStore from "@/store/toastStore";

const money = (value) => `NPR ${Number(value || 0).toFixed(0)}`;

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "/no-image.png";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
}

function statusClass(status) {
  const map = {
    processing: "bg-amber-100 text-amber-700",
    shipped: "bg-sky-100 text-sky-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
}

export default function ComboOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!requireLoginForAction()) {
        showToast("Please login to view combo orders");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/combo-orders", { credentials: "include" });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || "Failed to load combo orders");
        }
        setOrders(Array.isArray(payload.data) ? payload.data : []);
      } catch (error) {
        showToast(error?.message || "Failed to load combo orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [showToast]);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-360 mx-auto px-4 sm:px-6 py-4">
        <Banner image="/banner1.jpg" title="Combo Orders" />

        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[#00462C] font-bold text-xl">My Combo Orders</h1>
            <div className="w-10 h-0.75 bg-[#00462C] mt-1 rounded" />
          </div>
          <p className="text-sm text-gray-600 whitespace-nowrap">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3 mb-5">
          <Link href="/combo-products" className="inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-semibold border text-[#00462C] border-[#00462C]">
            Browse Combos
          </Link>
          <Link href="/products" className="inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-semibold border border-gray-200 text-gray-600">
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="border border-gray-200 rounded-xl p-10 text-center bg-gray-50 text-gray-500">Loading combo orders...</div>
        ) : orders.length === 0 ? (
          <div className="border border-gray-200 rounded-xl p-10 text-center bg-gray-50">
            <p className="text-gray-500 mb-1">No combo orders yet.</p>
            <p className="text-xs text-gray-400 mb-4">Buy a combo pack and your combo order will appear here.</p>
            <Link href="/combo-products" className="inline-flex items-center justify-center px-5 py-2 rounded-md text-white font-semibold bg-[#00462C]">
              Browse Combo Packs
            </Link>
          </div>
        ) : (
          <div className="space-y-4 pb-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  <Link href={`/combo-products/${order.combo?.id}`} className="w-full sm:w-32 h-32 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0 overflow-hidden">
                    <img src={resolveImageUrl(order.combo?.image)} alt={order.combo?.name || "Combo"} onError={(event) => (event.currentTarget.src = "/no-image.png")} className="w-full h-full object-contain p-2" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs text-gray-500">#{order.orderNumber}</p>
                        <h2 className="font-semibold text-gray-900 mt-1">{order.combo?.name || "Combo Product"}</h2>
                      </div>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusClass(order.orderStatus)}`}>{order.orderStatus}</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-2">{order.combo?.description || "Nityagro combo order"}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                      <span className="font-bold text-[#00462C]">{money(order.totalAmount)}</span>
                      <span className="text-gray-500">Payment: {order.paymentStatus}</span>
                      <span className="text-gray-500">Placed: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</span>
                    </div>
                    <Link href={`/combo-products/${order.combo?.id}`} className="inline-flex mt-3 text-sm font-semibold text-[#00462C] hover:underline">
                      View Combo
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
