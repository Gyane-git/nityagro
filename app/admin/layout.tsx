import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { requireAdminRole } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdminRole();
  } catch {
    redirect("/?login=1&next=/admin/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}
