"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/account/Sidebar";
import MyProfile from "@/components/account/MyProfile";
import AddressBook from "@/components/account/AddressBook";
import OrderHistory from "@/components/account/OrderHistory";
import OrderTracking from "@/components/account/OrderTracking";
import { apiGetRequest } from "@/apihelper/apiHelper";
import toast from "react-hot-toast";

const USER = {
  userId: "1",
  name: "User",
  email: "user@example.com",
  phone: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
};

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === "undefined") return "profile";
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    return tab && ["profile", "address", "history", "tracking"].includes(tab)
      ? tab
      : "profile";
  });
  const [user, setUser] = useState(USER);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await apiGetRequest(`/account/profile?userId=${USER.userId}`, false);
      if (!response.success) {
        toast.error(response.message || "Failed to load profile");
        return;
      }
      if (response.data) {
        setUser((prev) => ({ ...prev, ...response.data }));
      }
    };
    fetchProfile();
  }, []);

  const tabComponents = {
    profile: (
      <MyProfile
        user={user}
        userId={user.userId || USER.userId}
        onProfileUpdated={(data) => setUser((prev) => ({ ...prev, ...data }))}
      />
    ),
    address: <AddressBook userId={user.userId || USER.userId} />,
    history: <OrderHistory />,
    tracking: <OrderTracking />,
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="px-6 py-3 text-[13px] flex items-center text-gray-500">
        <span>Home</span>
        <span className="mx-1 text-gray-400 text-lg font-semibold">›</span>
        <span className="text-gray-800 font-semibold">My Account</span>
      </nav>

      <div className="flex items-start gap-5 px-6 pb-10">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} />

        <main className="flex-1 bg-white rounded-lg shadow-sm p-8 min-h-100">
          {tabComponents[activeTab]}
        </main>
      </div>
    </div>
  );
}
