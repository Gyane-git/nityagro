"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Package,
  FolderTree,
  Flag,
  Tag,
  ShoppingCart,
  Users,
  MessageSquare,
  FileText,
  BarChart3,
  MapPin,
} from "lucide-react";
import { canAccessAdminPermission } from "@/lib/adminPermissions";

export default function SideHeaderBar() {
  const pathname = usePathname();
  const [access, setAccess] = useState({ role: "", rolePermission: null });

  const [expandedItems, setExpandedItems] = useState({
    Products: false,
    Categories: false,
    Banners: false,
    
  });

  React.useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (payload?.data) setAccess(payload.data);
      })
      .catch(() => null);
  }, []);

  const allowed = (permission) => canAccessAdminPermission(access.role, access.rolePermission, permission);

  const toggleExpand = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard", permission: "dashboard" },

    {
      icon: Package,
      label: "Products",
      permission: "products",
      expandable: true,
      children: [
        { name: "View All", path: "/admin/product-list" },
        
        
      ],
    },

    {
      icon: Package,
      label: "Combo Products",
      permission: "combo-products",
      expandable: true,
      children: [
        { name: "View All", path: "/admin/combo-list" },
        { name: "Add New", path: "/admin/combopack" },
      ],
    },

    {
      icon: FolderTree,
      label: "Categories",
      permission: "categories",
      expandable: true,
      children: [
        { name: "View All", path: "/admin/categories-list" },
        { name: "Add New", path: "/admin/add-categories" },
      ],
    },

    {
      icon: Flag,
      label: "Banners",
      permission: "banners",
      expandable: true,
      children: [
        { name: "View All", path: "/admin/banner-list" },
        { name: "Add New", path: "/admin/add-banner" },
      ],
    },

    { icon: Tag, label: "Popup Ads", path: "/admin/popup-ads", permission: "popup-ads" },
    { icon: ShoppingCart,
      label: "Manage Orders",
      permission: "orders",
      expandable: true,
      children: [
        { name: "Orders", path: "/admin/ordermanagement" },
        { name: "Combo Orders", path: "/admin/combo-orders" },
        { name: "OMS Sync", path: "/admin/oms-order-syncs" }
      ],
      path: "/admin/ordermanagement" },

    { icon: Users, label: "Customers", path: "/admin/customers", permission: "customers" },

    { icon: BarChart3, label: "Returns", path: "/admin/returns", permission: "returns" },

    {
      icon: MapPin,
      label: "Set Shipping charges",
      path: "/admin/shipping",
      permission: "shipping",
    },

    { icon: FileText, label: "Grievances", path: "/admin/grievances", permission: "grievances" },
    { icon: FileText, label: "FAQs", path: "/admin/faqs", permission: "faqs" },
    { icon: MessageSquare, label: "Testimonials", path: "/admin/testimonials", permission: "testimonials" },
    { icon: Users, label: "Admin Users", path: "/admin/users", permission: "users" },
  ];

  if (pathname === "/login-admin") return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-hidden">
      <div className="h-full overflow-y-auto py-4">
        {menuItems.filter((item) => allowed(item.permission)).map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label}>
              {/* Normal Link */}
              {!item.expandable ? (
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 transition
                    ${
                      pathname === item.path
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ) : (
                <>
                  {/* Expand button */}
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>

                    {expandedItems[item.label] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>

                  {/* Children */}
                  {expandedItems[item.label] && (
                    <div className="bg-gray-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          href={child.path}
                          className={`block pl-12 pr-4 py-2.5 text-sm transition
                            ${
                              pathname === child.path
                                ? "text-blue-600 font-medium"
                                : "text-gray-600 hover:text-blue-600"
                            }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
