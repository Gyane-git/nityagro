"use client";

import { Clock, KeyRound, LogOut, MapPin, RotateCcw, Star, Truck, User, XCircle } from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Manage My Account",
    items: [
      { id: "profile", label: "My Profile", icon: <User size={16} /> },
      { id: "address", label: "Address Book", icon: <MapPin size={16} /> },
    ],
  },
  {
    title: "Order Activity",
    items: [
      { id: "history", label: "Order History", icon: <Clock size={16} /> },
      { id: "tracking", label: "Order Tracking", icon: <Truck size={16} /> },
      { id: "cancellations", label: "Cancellation", icon: <XCircle size={16} /> },
      { id: "returns", label: "Return", icon: <RotateCcw size={16} /> },
      { id: "reviews", label: "Review", icon: <Star size={16} /> },
    ],
  },
];

export default function Sidebar({ activeTab, onTabChange, user, onLogout }) {
  const displayName = user?.name || "User";
  const displayEmail = user?.email || "";
  return (
    <div className="w-[260px] sm:w-[280px] flex flex-col gap-4 sm:gap-1 rounded-xl">
      {/* CARD 1 */}
      <div className="bg-white rounded-lg shadow-sm px-5 py-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#DB8F00] flex items-center justify-center text-white text-xl font-bold shrink-0">{displayName.charAt(0)}</div>
        <div className="overflow-hidden">
          <p className="text-[14px] font-semibold text-gray-800 truncate">{displayName}</p>
          <p className="text-[12px] text-gray-400 mt-0.5 truncate">{displayEmail}</p>
        </div>
      </div>

      {/* CARD 2 */}
      <div className="bg-white rounded-lg shadow-sm px-5 py-5 flex flex-col gap-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            {/* Title */}
            <div className="mb-3">
              <p className="text-[13px] font-bold text-gray-800 pb-1.5 border-b-2 border-[#DB8F00] inline-block">{section.title}</p>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13.5px] text-left transition-colors duration-150
                    ${activeTab === item.id ? "bg-[#fdf3d7] text-gray-800 font-semibold" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"}`}
                >
                  <span className={activeTab === item.id ? "text-[#DB8F00]" : "text-gray-400"}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button onClick={() => onTabChange("password")} className={`mt-1 flex items-center gap-3 w-full rounded-md px-3 py-2.5 text-left text-[13.5px] transition-colors ${activeTab === "password" ? "bg-[#fdf3d7] text-gray-800 font-semibold" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"}`}>
          <KeyRound size={16} className={activeTab === "password" ? "text-[#DB8F00]" : "text-gray-400"} />
          Change Password
        </button>

        <button onClick={onLogout} className="mt-1 flex items-center gap-3 w-full rounded-md border border-red-100 bg-red-50 px-3 py-2.5 text-left text-[13.5px] font-semibold text-red-600 transition-colors hover:bg-red-100">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
