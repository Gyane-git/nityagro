"use client";

import { useState } from "react";
import Sidebar from "@/components/account/Sidebar";
import MyProfile from "@/components/account/MyProfile";
import AddressBook from "@/components/account/AddressBook";
import OrderHistory from "@/components/account/OrderHistory";
import OrderTracking from "@/components/account/OrderTracking";

const USER = {
  name: "Archie Rai",
  email: "archierai74@gmail.com",
  phone: "+977 9851642517",
};

const TAB_COMPONENTS = {
  profile: <MyProfile user={USER} />,
  address: <AddressBook />,
  history: <OrderHistory />,
  tracking: <OrderTracking />,
};

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === "undefined") return "profile";
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    return tab && Object.hasOwn(TAB_COMPONENTS, tab) ? tab : "profile";
  });

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Breadcrumb */}
      <nav className="px-6 py-3 text-[13px] flex items-center text-gray-500">
        <span>Home</span>
        <span className="mx-1 text-gray-400 text-lg font-semibold">›</span>
        <span className="text-gray-800 font-semibold">My Account</span>
      </nav>

      {/* Layout: narrow sidebar + wide content */}
      <div className="flex items-start gap-5 px-6 pb-10">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={USER} />

        {/* Right content panel*/}
        <main className="flex-1 bg-white rounded-lg shadow-sm p-8 min-h-100">
          {TAB_COMPONENTS[activeTab]}
        </main>
      </div>
    </div>
  );
}
