"use client";

import { useState } from "react";
import { Menu, X, Bell, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminHeaderBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => null);

    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("userId");
    router.push("/?login=1&next=/admin/dashboard");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-gray-700"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link
            href="/admin/dashboard"
            className="text-xl font-bold text-gray-800"
          >
            Admin Panel
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          <button className="text-gray-600 hover:text-blue-600 transition">
            <Bell size={22} />
          </button>

          <button
            onClick={() => router.push("/admin/profile")}
            className="text-gray-600 hover:text-blue-600 transition"
          >
            <User size={22} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
          >
            <LogOut size={18} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t bg-gray-50 p-4 space-y-3">
          <Link
            href="/admin/dashboard"
            className="block text-gray-700 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className="block text-gray-700 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>

          <Link
            href="/admin/orders"
            className="block text-gray-700 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Orders
          </Link>

          <Link
            href="/admin/users"
            className="block text-gray-700 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Users
          </Link>
        </div>
      )}
    </header>
  );
}
