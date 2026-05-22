"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/account/Sidebar";
import MyProfile from "@/components/account/MyProfile";
import AddressBook from "@/components/account/AddressBook";
import OrderHistory from "@/components/account/OrderHistory";
import OrderTracking from "@/components/account/OrderTracking";
import toast from "react-hot-toast";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";

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
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(USER);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && ["profile", "address", "history", "tracking"].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = window.localStorage.getItem("token");
      const authResponse = await fetch("/api/auth/me", {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      }).then((res) => res.json());

      if (!authResponse.success || !authResponse.data?.userId) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("admin_token");
        window.localStorage.removeItem("admin_auth");
        window.localStorage.removeItem("auth_user");
        window.localStorage.removeItem("userId");
        toast.error("Please login to continue");
        window.location.href = "/?login=1&next=/profile";
        return;
      }

      const localUserId = authResponse.data.userId;
      window.localStorage.setItem("userId", localUserId);
      window.localStorage.setItem("auth_user", JSON.stringify(authResponse.data));

      const response = await fetch("/api/account/profile", {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      }).then((res) => res.json());

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
    history: <OrderHistory userId={user.userId || USER.userId} />,
    tracking: <OrderTracking userId={user.userId || USER.userId} userName={user.name || "User"} />,
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Local logout should still complete even if network is unavailable.
    }

    clearCart();
    clearWishlist();
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("admin_token");
    window.localStorage.removeItem("admin_auth");
    window.localStorage.removeItem("auth_user");
    window.localStorage.removeItem("userId");
    toast.success("Logged out successfully");

    setTimeout(() => {
      window.location.href = "/";
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="px-6 py-3 text-[13px] flex items-center text-gray-500">
        <span>Home</span>
        <span className="mx-1 text-gray-400 text-lg font-semibold">›</span>
        <span className="text-gray-800 font-semibold">My Account</span>
      </nav>

      <div className="flex items-start gap-5 px-6 pb-10">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          user={user}
          onLogout={handleLogout}
        />

        <main className="flex-1 bg-white rounded-lg shadow-sm p-8 min-h-100">
          {tabComponents[activeTab]}
        </main>
      </div>
    </div>
  );
}
