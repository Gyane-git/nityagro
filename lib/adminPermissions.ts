export const ADMIN_PERMISSION_OPTIONS = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { key: "products", label: "Products", path: "/admin/product-list" },
  { key: "combo-products", label: "Combo Products", path: "/admin/combo-list" },
  { key: "categories", label: "Categories", path: "/admin/categories-list" },
  { key: "banners", label: "Banners", path: "/admin/banner-list" },
  { key: "popup-ads", label: "Popup Ads", path: "/admin/popup-ads" },
  { key: "orders", label: "Manage Orders", path: "/admin/ordermanagement" },
  { key: "customers", label: "Customers", path: "/admin/customers" },
  { key: "returns", label: "Returns", path: "/admin/returns" },
  { key: "shipping", label: "Shipping Charges", path: "/admin/shipping" },
  { key: "grievances", label: "Grievances", path: "/admin/grievances" },
  { key: "faqs", label: "FAQs", path: "/admin/faqs" },
  { key: "testimonials", label: "Testimonials", path: "/admin/testimonials" },
  { key: "users", label: "Admin Users", path: "/admin/users" },
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSION_OPTIONS)[number]["key"];

export function isSuperAdmin(role: unknown) {
  const value = String(role || "").trim().toUpperCase();
  return value === "SUPER_ADMIN" || value === "SUPERADMIN" || value.includes("SUPER");
}

export function parseAdminPermissions(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (!value) return [];

  try {
    const parsed = JSON.parse(String(value));
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    return String(value).split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

export function canAccessAdminPermission(role: unknown, rolePermission: unknown, permission: string) {
  if (isSuperAdmin(role)) return true;

  // Existing ADMIN accounts with no saved list retain the current full-access behavior.
  const permissions = parseAdminPermissions(rolePermission);
  return rolePermission == null || permissions.includes(permission);
}

export function serializeAdminPermissions(value: unknown) {
  return JSON.stringify(parseAdminPermissions(value));
}
