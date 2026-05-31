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

export default function SideHeaderBar() {
  const pathname = usePathname();

  const [expandedItems, setExpandedItems] = useState({
    Products: false,
    Categories: false,
    Banners: false,
    
  });

  const toggleExpand = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },

    {
      icon: Package,
      label: "Products",
      expandable: true,
      children: [
        { name: "View All", path: "/admin/product-list" },
        
        
      ],
    },

    {
      icon: Package,
      label: "Combo Products",
      expandable: true,
      children: [
        { name: "View All", path: "/admin/combo-list" },
        { name: "Add New", path: "/admin/combopack" },
      ],
    },

    {
      icon: FolderTree,
      label: "Categories",
      expandable: true,
      children: [
        { name: "View All", path: "/admin/categories-list" },
        { name: "Add New", path: "/admin/add-categories" },
      ],
    },

    {
      icon: Flag,
      label: "Banners",
      expandable: true,
      children: [
        { name: "View All", path: "/admin/banner-list" },
        { name: "Add New", path: "/admin/add-banner" },
      ],
    },

    { icon: Tag, label: "Popup Ads", path: "/admin/popup-ads" },
    { icon: ShoppingCart,
      label: "Manage Orders",
      expandable: true,
      children: [
        { name: "Orders", path: "/admin/ordermanagement" },
        { name: "Combo Orders", path: "/admin/combo-orders" },
        { name: "OMS Sync", path: "/admin/oms-order-syncs" }
      ],
      path: "/admin/ordermanagement" },

    { icon: Users, label: "Customers", path: "/admin/customers" },

    {
      icon: MapPin,
      label: "Set Shipping charges",
      path: "/admin/shipping",
    },

    { icon: FileText, label: "Grievances", path: "/admin/grievances" },
    { icon: FileText, label: "FAQs", path: "/admin/faqs" },
    { icon: MessageSquare, label: "Testimonials", path: "/admin/testimonials" },
  ];

  if (pathname === "/login-admin") return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-hidden">
      <div className="h-full overflow-y-auto py-4">
        {menuItems.map((item) => {
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
