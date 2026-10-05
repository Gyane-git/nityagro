"use client";

import AdminHeaderBar from "@/components/admin-HeaderBar";
import SideHeaderBar from "@/components/admin-sidebar";
import Toast from "@/components/Toast";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ADMIN_PERMISSION_OPTIONS, canAccessAdminPermission } from "@/lib/adminPermissions";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [access, setAccess] = useState<{ role?: string; rolePermission?: string | null } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => setAccess(payload?.data || {}))
      .catch(() => setAccess({}));
  }, []);

  useEffect(() => {
    if (!access || pathname === "/admin/dashboard") return;
    const current = ADMIN_PERMISSION_OPTIONS.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));
    if (current && !canAccessAdminPermission(access.role, access.rolePermission, current.key)) {
      const fallback = ADMIN_PERMISSION_OPTIONS.find((item) => canAccessAdminPermission(access.role, access.rolePermission, item.key));
      router.replace(fallback?.path || "/admin/dashboard");
    }
  }, [access, pathname, router]);

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
