"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, Package, Users, ShoppingCart, MessageSquareWarning, ChevronRight } from "lucide-react";

function getAdminToken() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("admin_auth") || localStorage.getItem("admin_token") || sessionStorage.getItem("admin_token");

  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.token || parsed?.accessToken || parsed?.jwt || null;
  } catch {
    return raw;
  }
}

function formatMoney(value) {
  const num = Number(value || 0);
  return `Rs. ${num.toLocaleString()}`;
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function StatCard({ title, value, subtitle, icon: Icon, tone = "orange" }) {
  const tones = {
    orange: "from-orange-500 to-amber-500",
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    purple: "from-purple-500 to-violet-500",
    red: "from-red-500 to-rose-500",
    slate: "from-slate-600 to-slate-700",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className={`absolute -top-10 -right-10 h-28 w-28 rounded-full bg-linear-to-br ${tones[tone]} opacity-10`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={`rounded-xl bg-linear-to-br ${tones[tone]} p-2.5 text-white shadow`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function StatusBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-700 capitalize">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersMeta, setOrdersMeta] = useState({ total: 0 });
  const [customersMeta, setCustomersMeta] = useState({ total: 0 });
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);

  const loadDashboard = useCallback(async () => {
    const token = getAdminToken();

    // Temporary changes
    if (!token) {
      // router.replace("/login-admin");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [ordersRes, customersRes, inquiriesRes, productsRes] = await Promise.all([
        fetch("/api/admin/orders?limit=100", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/customers?limit=100", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/inquiries", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/products"),
      ]);

      const [ordersPayload, customersPayload, inquiriesPayload, productsPayload] = await Promise.all([
        ordersRes.json(),
        customersRes.json(),
        inquiriesRes.json(),
        productsRes.json(),
      ]);

      if ([ordersRes, customersRes, inquiriesRes].some((r) => r.status === 401 || r.status === 403)) {
        router.replace("/login-admin");
        return;
      }

      if (!ordersRes.ok) throw new Error(ordersPayload?.message || "Failed to load orders");
      if (!customersRes.ok) throw new Error(customersPayload?.message || "Failed to load customers");
      if (!inquiriesRes.ok) throw new Error(inquiriesPayload?.message || "Failed to load inquiries");

      setOrders(ordersPayload?.data || []);
      setOrdersMeta(ordersPayload?.meta || { total: 0 });
      setCustomersMeta(customersPayload?.meta || { total: 0 });
      setInquiries(inquiriesPayload?.data || []);
      setProducts(productsPayload?.products || []);
    } catch (e) {
      setError(e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o?.totalAmount || 0), 0);

    const orderStatus = {
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returns: 0,
    };

    orders.forEach((o) => {
      const key = String(o?.orderStatus || "").toLowerCase();
      if (orderStatus[key] !== undefined) orderStatus[key] += 1;
    });

    const inquiryStatus = { new: 0, in_progress: 0, resolved: 0 };
    inquiries.forEach((i) => {
      const key = String(i?.status || "new").toLowerCase();
      if (inquiryStatus[key] !== undefined) inquiryStatus[key] += 1;
    });

    return {
      totalRevenue,
      orderStatus,
      inquiryStatus,
      totalOrders: Number(ordersMeta?.total || orders.length),
      totalCustomers: Number(customersMeta?.total || 0),
      totalProducts: Number(products.length || 0),
      totalInquiries: Number(inquiries.length || 0),
    };
  }, [orders, ordersMeta, customersMeta, inquiries, products]);

  const recentOrders = useMemo(() => {
    return [...orders].slice(0, 7);
  }, [orders]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#fff7ed_0%,#f8fafc_40%,#f8fafc_100%)] p-4 md:p-6 space-y-6">
      <div className="rounded-3xl border border-orange-100 bg-linear-to-r from-green-900 via-green-500 to-green-700 p-6 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.2em] text-white/90">Admin Command Center</p>
        <h1 className="mt-2 text-3xl font-black">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-white/90">Real-time snapshot of orders, customers, inquiries and revenue.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl border bg-white animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <StatCard icon={DollarSign} title="Revenue" value={formatMoney(metrics.totalRevenue)} subtitle="From recent loaded orders" tone="green" />
            <StatCard icon={ShoppingCart} title="Orders" value={metrics.totalOrders} subtitle="Total order count" tone="orange" />
            <StatCard icon={Users} title="Customers" value={metrics.totalCustomers} subtitle="Registered customers" tone="blue" />
            <StatCard icon={Package} title="Products" value={metrics.totalProducts} subtitle="Available in product table" tone="purple" />
            <StatCard icon={MessageSquareWarning} title="Inquiries" value={metrics.totalInquiries} subtitle="Contact form grievances" tone="slate" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 text-gray-700">
            <div className="xl:col-span-2 rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                <button onClick={() => router.push("/admin/ordermanagement")} className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                  View all <ChevronRight size={16} />
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-500">No orders found.</p>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full min-w-190 text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left">
                        <th className="px-3 py-2">Order</th>
                        <th className="px-3 py-2">Customer</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Amount</th>
                        <th className="px-3 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((o) => (
                        <tr key={o.id} className="border-b last:border-0">
                          <td className="px-3 py-2 font-semibold">#{o.orderNumber}</td>
                          <td className="px-3 py-2">{o.user?.fullName || "-"}</td>
                          <td className="px-3 py-2 capitalize">{o.orderStatus}</td>
                          <td className="px-3 py-2 font-semibold">{formatMoney(o.totalAmount)}</td>
                          <td className="px-3 py-2 text-gray-500">{formatDate(o.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Order Status Split</h3>
                <div className="space-y-3">
                  <StatusBar label="processing" value={metrics.orderStatus.processing} total={metrics.totalOrders || 1} color="bg-blue-500" />
                  <StatusBar label="shipped" value={metrics.orderStatus.shipped} total={metrics.totalOrders || 1} color="bg-indigo-500" />
                  <StatusBar label="delivered" value={metrics.orderStatus.delivered} total={metrics.totalOrders || 1} color="bg-green-500" />
                  <StatusBar label="returns" value={metrics.orderStatus.returns} total={metrics.totalOrders || 1} color="bg-amber-500" />
                  <StatusBar label="cancelled" value={metrics.orderStatus.cancelled} total={metrics.totalOrders || 1} color="bg-red-500" />
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Support Pipeline</h3>
                <div className="space-y-3">
                  <StatusBar label="inquiries new" value={metrics.inquiryStatus.new} total={metrics.totalInquiries || 1} color="bg-slate-500" />
                  <StatusBar label="in_progress" value={metrics.inquiryStatus.in_progress} total={metrics.totalInquiries || 1} color="bg-blue-500" />
                  <StatusBar label="resolved" value={metrics.inquiryStatus.resolved} total={metrics.totalInquiries || 1} color="bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
