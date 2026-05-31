"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const PAGE_SIZE = 20;

function getAdminToken() {
  if (typeof window === "undefined") return null;
  const raw =
    localStorage.getItem("admin_auth") ||
    localStorage.getItem("admin_token") ||
    sessionStorage.getItem("admin_token");

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed?.token || parsed?.accessToken || parsed?.jwt || null;
  } catch {
    return raw;
  }
}

function fmtDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function statusClass(status) {
  return status
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";
}

export default function AdminCustomersPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  const [detailLoading, setDetailLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(id);
  }, [searchInput]);

  const fetchCustomers = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/login-admin");
      return;
    }

    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });

      if (search) query.set("search", search);

      const res = await fetch(`/api/admin/customers?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = await res.json();

      if (res.status === 401 || res.status === 403) {
        toast.error("Admin login required");
        router.replace("/login-admin");
        return;
      }

      if (!res.ok) {
        throw new Error(payload?.message || "Failed to fetch customers");
      }

      setCustomers(payload?.data || []);
      setMeta(payload?.meta || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      toast.error(error?.message || "Failed to fetch customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [page, router, search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const openDetails = async (id) => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/login-admin");
      return;
    }

    try {
      setDetailLoading(true);
      const res = await fetch(`/api/admin/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.message || "Failed to fetch customer details");
      }

      setSelected(payload?.data || null);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch customer details");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 text-gray-700">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">Manage customer list and details</p>
        </div>
        <div className="text-sm text-gray-600">Total: {meta.total || 0}</div>
      </div>

      <div className="bg-white rounded-xl border p-3">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name, email, phone, user id"
          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No customers found.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Addresses</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{item.fullName || "-"}</div>
                      <div className="text-xs text-gray-500">User ID: {item.userId || "-"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{item.email || "-"}</div>
                      <div className="text-xs text-gray-500">{item.phone || "-"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{Number(item.orderCount || 0)}</td>
                    <td className="px-4 py-3">{Number(item?._count?.addresses || 0)}</td>
                    <td className="px-4 py-3">{fmtDate(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openDetails(item.id)}
                        disabled={detailLoading}
                        className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-40"
        >
          Previous
        </button>
        <div className="text-sm text-gray-600">
          Page {meta.page || page} / {meta.totalPages || 1}
        </div>
        <button
          disabled={page >= (meta.totalPages || 1) || loading}
          onClick={() => setPage((p) => Math.min(meta.totalPages || 1, p + 1))}
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-white rounded-xl border p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Customer Details</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
              <div className="rounded-lg border p-3">
                <div className="text-gray-500">Full Name</div>
                <div className="font-semibold">{selected.fullName || "-"}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-gray-500">Email</div>
                <div className="font-semibold">{selected.email || "-"}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-gray-500">Phone</div>
                <div className="font-semibold">{selected.phone || "-"}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-gray-500">Status</div>
                <div className="font-semibold">{selected.status ? "Active" : "Inactive"}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-gray-500">Orders</div>
                <div className="font-semibold">{selected.orders?.length || 0} (latest 20)</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-gray-500">Addresses</div>
                <div className="font-semibold">{selected.addresses?.length || 0}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Addresses</h3>
              <div className="space-y-2">
                {(selected.addresses || []).length === 0 ? (
                  <div className="text-sm text-gray-500">No addresses found.</div>
                ) : (
                  selected.addresses.map((address) => (
                    <div key={address.id} className="rounded-lg border p-3 text-sm">
                      <div className="font-semibold">{address.fullName} ({address.phone})</div>
                      <div className="text-gray-700 mt-1">
                        {address.address}
                        {address.landmark ? `, ${address.landmark}` : ""}
                      </div>
                      <div className="text-gray-500 mt-1">
                        {address.zone?.zoneName || "-"}, {address.city?.city || "-"}, {address.province?.name || "-"}
                      </div>
                      <div className="mt-1 flex gap-2">
                        {address.defaultShipping && (
                          <span className="text-xs rounded-full bg-orange-100 text-orange-700 px-2 py-1">Default Shipping</span>
                        )}
                        {address.defaultBilling && (
                          <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2 py-1">Default Billing</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Recent Orders</h3>
              {(selected.orders || []).length === 0 ? (
                <div className="text-sm text-gray-500">No orders found.</div>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full min-w-[720px] text-sm border rounded-lg overflow-hidden">
                    <thead className="bg-gray-50 border-b">
                      <tr className="text-left">
                        <th className="px-3 py-2">Order No</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Payment</th>
                        <th className="px-3 py-2">Total</th>
                        <th className="px-3 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.orders.map((order) => (
                        <tr key={order.id} className="border-b last:border-0">
                          <td className="px-3 py-2">#{order.orderNumber}</td>
                          <td className="px-3 py-2 capitalize">{order.orderStatus}</td>
                          <td className="px-3 py-2 capitalize">{order.paymentStatus}</td>
                          <td className="px-3 py-2">Rs. {Number(order.totalAmount || 0).toLocaleString()}</td>
                          <td className="px-3 py-2">{fmtDate(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
