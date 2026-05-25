"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function statusClass(status) {
  const value = String(status || "").toLowerCase();
  if (value === "resolved") return "bg-green-100 text-green-700";
  if (value === "in_progress") return "bg-blue-100 text-blue-700";
  return "bg-orange-100 text-orange-700";
}

export default function GrievancesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchInquiries = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/login-admin");
      return;
    }

    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (statusFilter !== "all") query.set("status", statusFilter);

      const response = await fetch(`/api/inquiries?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await response.json();

      if (response.status === 401 || response.status === 403) {
        toast.error("Admin session expired");
        router.replace("/login-admin");
        return;
      }

      if (!response.ok) {
        throw new Error(payload?.message || "Failed to fetch inquiries");
      }

      setInquiries(payload?.data || []);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch inquiries");
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, [router, statusFilter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inquiries;
    return inquiries.filter((item) => {
      return (
        String(item?.name || "").toLowerCase().includes(q) ||
        String(item?.email || "").toLowerCase().includes(q) ||
        String(item?.inquiryType || "").toLowerCase().includes(q) ||
        String(item?.message || "").toLowerCase().includes(q)
      );
    });
  }, [inquiries, search]);

  return (
    <div className="p-4 md:p-6 space-y-4 text-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grievances</h1>
          <p className="text-sm text-gray-500">Customer inquiries from contact form</p>
        </div>
        <div className="text-sm text-gray-600">Total: {filtered.length}</div>
      </div>

      <div className="bg-white  p-3 md:p-4 flex flex-col md:flex-row gap-3 text-gray-600">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, type or message"
          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm bg-white"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading grievances...</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No grievances found.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[960px] text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">{item.email}</td>
                    <td className="px-4 py-3">{item.phone}</td>
                    <td className="px-4 py-3 max-w-[360px]">
                      <div className="truncate" title={item.message}>
                        {item.message}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusClass(
                          item.status
                        )}`}
                      >
                        {item.status || "new"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(item)}
                        className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50"
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

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-xl border p-5 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Grievance Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border p-3">
                <div className="text-gray-500">Name</div>
                <div className="font-semibold">{selected.name}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-gray-500">Email</div>
                <div className="font-semibold">{selected.email}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-gray-500">Phone</div>
                <div className="font-semibold">{selected.phone}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-gray-500">Status</div>
                <div className="font-semibold">{selected.status || "new"}</div>
              </div>
              <div className="rounded-lg border p-3 md:col-span-2">
                <div className="text-gray-500">Submitted At</div>
                <div className="font-semibold">{formatDate(selected.createdAt)}</div>
              </div>
              <div className="rounded-lg border p-3 md:col-span-2">
                <div className="text-gray-500 mb-1">Message</div>
                <div className="whitespace-pre-wrap text-gray-800">{selected.message}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
