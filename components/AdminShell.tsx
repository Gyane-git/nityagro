"use client";

import AdminHeaderBar from "@/components/admin-HeaderBar";
import SideHeaderBar from "@/components/admin-sidebar";
import Toast from "@/components/Toast";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AdminHeaderBar />

      <div className="flex flex-1 overflow-hidden">
        <SideHeaderBar />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Toast />
          {children}
        </main>
      </div>
    </div>
  );
}
