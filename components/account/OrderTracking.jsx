"use client";

import { CircleCheckBig, Clock, MapPin, MoveLeft, Package, ShoppingCart, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiGetRequest } from "@/apihelper/apiHelper";
import toast from "react-hot-toast";
import useCheckoutStore from "@/store/checkoutStore";

function formatMoney(value) {
  return `NPR ${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function buildSteps(status) {
  const normalized = String(status || "processing").toLowerCase();
  const order = ["processing", "shipped", "delivered"];
  const currentIndex = order.includes(normalized) ? order.indexOf(normalized) : 0;

  return [
    {
      label: "Order Created",
      sub: "Order has been placed",
      status: "done",
      icon: <Clock className="text-[#FFFFFF]" size={20} />,
    },
    {
      label: "Processing",
      sub: "Your order is being prepared",
      status: currentIndex >= 0 ? "done" : "active",
      icon: <Package className="text-[#FFFFFF]" size={20} />,
    },
    {
      label: "Shipped",
      sub: "Package has left our facility",
      status: currentIndex >= 1 ? "done" : "pending",
      icon: <Truck className={currentIndex >= 1 ? "text-[#FFFFFF]" : "text-gray-400"} size={20} />,
    },
    {
      label: normalized === "cancelled" ? "Cancelled" : "Delivered",
      sub: normalized === "cancelled" ? "Order was cancelled" : "Package has been delivered",
      status: currentIndex >= 2 ? "done" : normalized === "cancelled" ? "done" : "pending",
      icon: <CircleCheckBig className={currentIndex >= 2 || normalized === "cancelled" ? "text-[#FFFFFF]" : "text-gray-400"} size={20} />,
    },
  ];
}

export default function OrderTracking({ userId = "1", userName = "User" }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedAddress = useCheckoutStore((state) => state.getSelectedAddress());

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const response = await apiGetRequest(`/orders?userId=${userId}&status=all`, false);
      if (!response.success) {
        toast.error(response.message || "Failed to fetch tracking data");
        setLoading(false);
        return;
      }
      setOrders(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    };
    fetchOrders();
  }, [userId]);

  const latestOrder = useMemo(() => orders[0] || null, [orders]);
  const orderItems = latestOrder?.items || [];
  const steps = buildSteps(latestOrder?.orderStatus || "processing");
  const progressWidth = latestOrder?.orderStatus === "delivered" ? "100%" : latestOrder?.orderStatus === "shipped" ? "66%" : latestOrder?.orderStatus === "cancelled" ? "100%" : "35%";

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading tracking details...</div>;
  }

  if (!latestOrder) {
    return <div className="p-6 text-sm text-gray-500">No orders available for tracking.</div>;
  }

  return (
    <div className="min-h-screen p-6 font-sans">
      <div className="max-w-240 mx-auto">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-[20px] font-bold text-[#235a49]">Hi {userName},</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">Here&apos;s the latest update on your order</p>
          </div>
          <Link href="/products" className="flex items-center gap-2 bg-[#235a3e] hover:bg-[#1a4730] text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors">
            <MoveLeft size={16} /> Continue Shopping
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-2">
          <div className="text-[14px] font-bold text-[#235a4e]">Order Status</div>
          <div className="text-[12px] text-[#4E5663] mt-0.5 mb-5">Order ID <span className="text-[#4E5663] font-medium"># {latestOrder.orderNumber}</span></div>

          <div className="relative flex justify-between items-start">
            <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 z-0" />
            <div className="absolute top-5 left-5 h-1 bg-[#235a3e] z-10" style={{ width: progressWidth }} />

            {steps.map((step, i) => (
              <div key={i} className="relative z-20 flex flex-col items-center gap-2 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base ${step.status !== "pending" ? "bg-[#266A3F] text-white" : "bg-gray-100 border-2 border-gray-200 text-gray-300"}`}>
                  {step.icon}
                </div>
                <div className="text-[12px] font-semibold text-center text-gray-700">{step.label}</div>
                <div className="text-[11px] text-gray-400 text-center">{step.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#235a3e] border-b-2 border-[#235a3e] pb-1.5 mb-3"><MapPin size={20} /> Delivery Address</div>
            <div className="text-[13px] font-semibold text-gray-800 mb-1.5">{selectedAddress?.fullName || "N/A"}</div>
            <div className="text-[12px] text-gray-500 leading-relaxed">
              {selectedAddress?.address || "-"}
              <br />
              {selectedAddress?.phone || "-"}
              <br />
              {selectedAddress?.email || "-"}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#235a3e] border-b-2 border-[#235a3e] pb-1.5 mb-3"><ShoppingCart size={20} /> Order Information</div>
            {[
              { label: "Order Date", value: formatDateTime(latestOrder.createdAt), green: false },
              { label: "Payment Method", value: latestOrder.paymentMethod || "COD", green: false },
              { label: "Order Status", value: String(latestOrder.orderStatus || "-").toUpperCase(), green: true },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center mb-2">
                <span className="text-[12px] text-gray-500">{row.label}</span>
                <span className={`text-[12px] font-medium ${row.green ? "text-[#235a3e]" : "text-gray-700"}`}>{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
              <span className="text-[12px] font-semibold text-gray-800">Total Amount :</span>
              <span className="text-[14px] font-bold text-[#235a3e]">{formatMoney(latestOrder.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="mb-4">
            <div className="inline-block pb-1.5 text-[13px] font-bold text-[#235a3e]"><Package size={20} /> Order Items</div>
            <div className="h-0.5 w-full bg-gray-200 relative">
              <div className="absolute left-0 top-0 h-full bg-[#235a3e] w-25"></div>
            </div>
          </div>

          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b-2 border-gray-100">
                {["Product", "Product ID", "Quantity", "Unit Price", "Total"].map((h) => (
                  <th key={h} className="pb-2 text-[#266A3F] font-semibold ps-10 first:text-left text-center last:text-center">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, i) => (
                <tr key={i} className="border-b-2 border-gray-100 last:border-0">
                  <td className="py-2.5 ps-10 text-[#488D53] font-medium">{item.name}</td>
                  <td className="py-2.5 ps-10 text-center text-[#717182]">{item.productCode || "-"}</td>
                  <td className="py-2.5 ps-10 text-center text-[#000000]">{item.qty}</td>
                  <td className="py-2.5 ps-10 text-center text-[#000000]">{formatMoney(item.unitPrice)}</td>
                  <td className="py-2.5 ps-10 text-center font-semibold text-[#488D53]">{formatMoney(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
