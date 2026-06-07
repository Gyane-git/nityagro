"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/account/Sidebar";
import MyProfile from "@/components/account/MyProfile";
import AddressBook from "@/components/account/AddressBook";
import ChangePassword from "@/components/account/ChangePassword";
import OrderHistory from "@/components/account/OrderHistory";
import OrderTracking from "@/components/account/OrderTracking";
import AccountActivityList from "@/components/account/AccountActivityList";
import toast from "react-hot-toast";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";
import useConfirmModalStore from "@/store/confirmModalStore";
import { Menu, X } from "lucide-react";

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
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const openConfirm = useConfirmModalStore((state) => state.open);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && ["profile", "address", "history", "tracking", "cancellations", "returns", "reviews", "password"].includes(tab)) {
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleTrackOrder = (orderId) => {
    setTrackingOrderId(orderId);
    setActiveTab("tracking");
    setSidebarOpen(false);
  };

  const tabComponents = {
    profile: <MyProfile user={user} userId={user.userId || USER.userId} onProfileUpdated={(data) => setUser((prev) => ({ ...prev, ...data }))} />,
    address: <AddressBook userId={user.userId || USER.userId} />,
    history: <OrderHistory userId={user.userId || USER.userId} onTrackOrder={handleTrackOrder} />,
    tracking: <OrderTracking userId={user.userId || USER.userId} userName={user.name || "User"} selectedOrderId={trackingOrderId} />,
    cancellations: <AccountActivityList type="cancellations" />,
    returns: <AccountActivityList type="returns" />,
    reviews: <AccountActivityList type="reviews" />,
    password: <ChangePassword />,
  };

  const performLogout = async () => {
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

  const handleLogout = () => {
    openConfirm({
      title: "Logout",
      message: "Are you sure you want to logout from your account?",
      onConfirm: performLogout,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center">
        {/* Mobile Header */}
        <div className="lg:hidden ps-4 sm:ps-6">
          <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-1 px-2 py-2 bg-white rounded-lg border border-gray-200">
            <Menu size={14} className="text-gray-900" />
            <span className="hidden sm:inline text-xs font-medium text-gray-900">Menu</span>
          </button>
        </div>
        <nav className="px-2 lg:px-6 py-3 text-[13px] flex items-center text-gray-500">
          <span>Home</span>

          <span className="mx-1 text-gray-400 text-lg font-semibold">›</span>

          <span className="text-gray-800 font-semibold">My Account</span>
        </nav>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex gap-5 px-4 sm:px-6 pb-10">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activeTab={activeTab} onTabChange={handleTabChange} user={user} onLogout={handleLogout} />
        </div>

        {/* Mobile Sidebar Drawer */}
        <div className={`fixed top-23 left-0 h-full z-50 transform transition-transform duration-300 lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="relative h-full bg-white shadow-xl p-4 overflow-y-auto">
            {/* Close Button */}
            <button onClick={() => setSidebarOpen(false)} className="absolute top-6 right-6">
              <X size={22} className="bg-red-500 rounded-md" />
            </button>

            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} user={user} onLogout={handleLogout} />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 min-h-[500px] overflow-hidden">{tabComponents[activeTab]}</main>
      </div>
    </div>
  );
}
