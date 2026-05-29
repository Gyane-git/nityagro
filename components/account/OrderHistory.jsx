"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { apiGetRequest } from "@/apihelper/apiHelper";
import toast from "react-hot-toast";

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

function formatMoney(value) {
  return `NPR ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function normalizeStatus(status) {
  const s = String(status || "").toLowerCase();
  if (s === "processing") return "Processing";
  if (s === "shipped") return "Shipped";
  if (s === "delivered") return "Delivered";
  if (s === "cancelled") return "Cancelled";
  if (s === "returns") return "Returns";
  return "Pending";
}

function StatusBadge({ status }) {
  const styles = {
    Processing: "bg-[#FFF3CD] text-[#B8860B]",
    Shipped: "bg-sky-100 text-sky-700",
    Delivered: "bg-[#2e5e2e] text-white",
    Cancelled: "bg-red-100 text-red-600",
    Returns: "bg-purple-100 text-purple-700",
    Pending: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`inline-flex items-center justify-center px-5 py-1.5 rounded-md text-[12.5px] font-semibold ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
}

function OrderCard({ order }) {
  const firstItem = order?.items?.[0];
  const qty = Number(firstItem?.qty || 1);
  const unitPrice = Number(firstItem?.unitPrice ?? order?.totalAmount ?? 0);
  const isCombo = order?.orderType === "combo";
  const imageSrc = firstItem?.image || "/products/mustard-oil.png";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-4">
      <div className="w-16 h-16 rounded-md bg-amber-50 border border-amber-100 shrink-0 flex items-center justify-center overflow-hidden relative">
        <Image src={imageSrc} alt={firstItem?.name || "Product"} fill className="object-contain p-1" unoptimized={imageSrc.startsWith("/uploads/")} />
      </div>

      <div className="w-55 shrink-0">
        <div className="flex items-center gap-2">
          <p className="text-[13.5px] font-semibold text-gray-800 leading-snug">{firstItem?.name || "N/A"}</p>
          {isCombo ? <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#2e5e2e] text-[10px] font-bold border border-emerald-100">Combo</span> : null}
        </div>
        <p className="text-[12px] text-gray-400 mt-0.5">Code: {firstItem?.productCode || "-"}</p>
        <div className="flex items-center gap-1 mt-1.5 text-gray-400">
          <CalendarIcon />
          <span className="text-[12px]">{formatDate(order.createdAt)}</span>
        </div>
      </div>

      <div className="flex-1 text-[13px] text-gray-500">{formatMoney(unitPrice)}</div>

      <div className="text-[13px] text-gray-500 w-14">Qty: <span className="font-semibold text-gray-700">{qty}</span></div>

      <div className="text-[13.5px] font-semibold text-gray-800 w-28 text-right">{formatMoney(order.totalAmount)}</div>

      <div className="w-28 flex justify-center shrink-0">
        <StatusBadge status={normalizeStatus(order.orderStatus)} />
      </div>

      <button className="ml-1 px-4 py-2 border border-gray-300 rounded-md text-[12.5px] text-gray-600 font-medium hover:border-[#2e5e2e] hover:text-[#2e5e2e] transition-colors whitespace-nowrap shrink-0">
        #{order.orderNumber}
      </button>
    </div>
  );
}

export default function OrderHistory({ userId = "1" }) {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const [orderResponse, comboResponse] = await Promise.all([
        apiGetRequest(`/orders?userId=${userId}&status=all`, false),
        apiGetRequest("/combo-orders", true),
      ]);

      if (!orderResponse.success) {
        toast.error(orderResponse.message || "Failed to fetch order history");
        setLoading(false);
        return;
      }

      const normalOrders = Array.isArray(orderResponse.data) ? orderResponse.data : [];
      const comboOrders = comboResponse.success && Array.isArray(comboResponse.data)
        ? comboResponse.data.map((order) => ({
            id: `combo-${order.id}`,
            rawId: order.id,
            orderNumber: order.orderNumber,
            orderType: "combo",
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            totalAmount: Number(order.totalAmount || 0),
            createdAt: order.createdAt,
            items: [
              {
                id: `${order.id}-combo`,
                productCode: order.combo?.code || order.combo?.productCodes || "COMBO",
                name: order.combo?.name || "Combo Product",
                image: order.combo?.image || "/no-image.png",
                qty: Number(order.quantity || 1),
                unitPrice: Number(order.totalAmount || 0) / Math.max(1, Number(order.quantity || 1)),
                subtotal: Number(order.totalAmount || 0),
              },
            ],
          }))
        : [];

      setOrders(
        [...normalOrders, ...comboOrders].sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
        ),
      );
      setLoading(false);
    };
    fetchOrders();
  }, [userId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((order) => {
      const item = order?.items?.[0];
      return (
        String(item?.name || "").toLowerCase().includes(q) ||
        String(order?.orderNumber || "").toLowerCase().includes(q)
      );
    });
  }, [orders, search]);

  return (
    <div>
      <h2 className="text-xl font-bold text-[#2e5e2e] mb-0.5">Order History</h2>
      <p className="text-[13px] text-gray-400 mb-4">Currently active and recent purchases.</p>

      <div className="relative w-60 mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-[13px] text-gray-600 placeholder-gray-400 outline-none focus:border-[#DB8F00] bg-[#fcfcfb] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-100 px-6 py-12 text-center text-[13px] text-gray-400">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 px-6 py-12 text-center text-[13px] text-gray-400">No orders found.</div>
        ) : (
          filtered.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}
