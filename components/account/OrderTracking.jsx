"use client";

import {
  CircleCheckBig,
  Clock,
  MapPin,
  MoveLeft,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";
import Link from "next/link";

export default function OrderTracking() {
  const orderItems = [
    {
      name: "Yellow Mustard Oil",
      id: "HSP-500-25",
      qty: 10,
      unit: "$125.00",
      total: "$1,250.00",
    },
    {
      name: "Red Mustard Oil",
      id: "FAF-300-18",
      qty: 8,
      unit: "$89.50",
      total: "$716.00",
    },
    {
      name: "Green",
      id: "IC-750-40",
      qty: 12,
      unit: "$73.00",
      total: "$876.00",
    },
  ];

  const steps = [
    {
      label: "Order Created",
      sub: "Order has been placed",
      status: "done",
      icon: <Clock className="text-[#FFFFFF]" size={20} />,
    },
    {
      label: "Processing",
      sub: "Your order is being prepared",
      status: "active",
      icon: <Package className="text-[#FFFFFF]" size={20} />,
    },
    {
      label: "Shipped",
      sub: "Package has left our facility",
      status: "pending",
      icon: <Truck className="text-gray-400" size={20} />,
    },
    {
      label: "Delivered",
      sub: "Package has been delivered",
      status: "pending",
      icon: <CircleCheckBig className="text-gray-400" size={20} />,
    },
  ];

  return (
    <div className="min-h-screen p-6 font-sans">
      <div className="max-w-240 mx-auto">
        {/* Top bar */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-[20px] font-bold text-[#235a49]">
              Hi Archie Rai,
            </h2>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Here's the latest update on your order
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 bg-[#235a3e] hover:bg-[#1a4730] text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors"
          >
            <MoveLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {/* Order Status Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-2">
          <div className="text-[14px] font-bold text-[#235a4e]">
            Order Status
          </div>
          <div className="text-[12px] text-[#4E5663] mt-0.5 mb-5">
            Order ID &nbsp;
            <span className="text-[#4E5663] font-medium"># AD-2024-001234</span>
          </div>

          {/* Timeline */}
          <div className="relative flex justify-between items-start">
            {/* Background line */}
            <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 z-0" />
            {/* Progress line */}
            <div className="absolute top-5 left-5 w-[35%] h-1 bg-[#235a3e] z-10" />

            {steps.map((step, i) => (
              <div
                key={i}
                className="relative z-20 flex flex-col items-center gap-2 flex-1"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-base
                  ${
                    step.status !== "pending"
                      ? "bg-[#266A3F] text-white"
                      : "bg-gray-100 border-2 border-gray-200 text-gray-300"
                  }`}
                >
                  {step.icon}
                </div>
                <div className="text-[12px] font-semibold text-center text-gray-700">
                  {step.label}
                </div>
                <div className="text-[11px] text-gray-400 text-center">
                  {step.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery + Order Info */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {/* Delivery Address */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#235a3e] border-b-2 border-[#235a3e] pb-1.5 mb-3">
              <MapPin size={20} /> Delivery Address
            </div>
            <div className="text-[13px] font-semibold text-gray-800 mb-1.5">
              Archie Rai
            </div>
            <div className="text-[12px] text-gray-500 leading-relaxed">
              1234 Agriculture Drive · Des Moines, IA 50309
              <br />
              +977 9860377498
              <br />
              archierai74@gmail.com
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#235a3e] border-b-2 border-[#235a3e] pb-1.5 mb-3">
              <ShoppingCart size={20} /> Order Information
            </div>
            {[
              { label: "Order Date", value: "Nov 19, 2025", green: false },
              {
                label: "Estimated Delivery",
                value: "Nov 21, 2025",
                green: true,
              },
              { label: "Payment Method", value: "Esewa", green: false },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center mb-2">
                <span className="text-[12px] text-gray-500">{row.label}</span>
                <span
                  className={`text-[12px] font-medium ${
                    row.green ? "text-[#235a3e]" : "text-gray-700"
                  }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
              <span className="text-[12px] font-semibold text-gray-800">
                Total Amount :
              </span>
              <span className="text-[14px] font-bold text-[#235a3e]">
                NRP 1830
              </span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="mb-4">
            <div className="inline-block pb-1.5 text-[13px] font-bold text-[#235a3e]">
              <Package size={20} /> Order Items
            </div>

            <div className="h-0.5 w-full bg-gray-200 relative">
              <div className="absolute left-0 top-0 h-full bg-[#235a3e] w-25"></div>
            </div>
          </div>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b-2 border-gray-100">
                {[
                  "Product",
                  "Product ID",
                  "Quantity",
                  "Unit Price",
                  "Total",
                ].map((h) => (
                  <th
                    key={h}
                    className="pb-2 text-[#266A3F] font-semibold ps-10 first:text-left text-center last:text-center"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, i) => (
                <tr
                  key={i}
                  className="border-b-2 border-gray-100 last:border-0"
                >
                  <td className="py-2.5 ps-10 text-[#488D53] font-medium cursor-pointer hover:underline">
                    {item.name}
                  </td>
                  <td className="py-2.5 ps-10 text-center text-[#717182]">
                    {item.id}
                  </td>
                  <td className="py-2.5 ps-10 text-center text-[#000000]">
                    {item.qty}
                  </td>
                  <td className="py-2.5 ps-10 text-center text-[#000000]">
                    {item.unit}
                  </td>
                  <td className="py-2.5 ps-10 text-center font-semibold text-[#488D53]">
                    {item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
