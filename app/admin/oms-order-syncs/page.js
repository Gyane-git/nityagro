"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function statusClass(status) {
  if (status === "SUCCESS") return "bg-green-100 text-green-700";
  if (status === "FAILED") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

export default function OmsOrderSyncsPage() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ failedCount: 0, total: 0 });
  const [status, setStatus] = useState("FAILED");
  const [loading, setLoading] = useState(false);
  const [retryingId, setRetryingId] = useState(null);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/oms-order-syncs?status=${status}`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Failed to load OMS logs");
      setRows(Array.isArray(payload.data) ? payload.data : []);
      setMeta(payload.meta || { failedCount: 0, total: 0 });
    } catch (error) {
      toast.error(error?.message || "Failed to load OMS logs");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const retry = async (id) => {
    setRetryingId(id);
    try {
      const response = await fetch("/api/admin/oms-order-syncs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Retry failed");
      toast.success(payload.message || "Retry completed");
      await loadLogs();
    } catch (error) {
      toast.error(error?.message || "Retry failed");
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 text-gray-700">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OMS Order Sync</h1>
          <p className="text-sm text-gray-500">Failed website orders can be retried here without affecting local orders.</p>
        </div>
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-2 text-sm font-semibold text-red-700">
          Failed Notice: {meta.failedCount || 0}
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border bg-white p-3">
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-md border px-3 py-2 text-sm">
          <option value="FAILED">Failed</option>
          <option value="SUCCESS">Success</option>
          <option value="ALL">All</option>
        </select>
        <button onClick={loadLogs} className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white">Refresh</button>
      </div>

      <div className="overflow-auto rounded-xl border bg-white">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="border-b bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Local Orders</th>
              <th className="px-4 py-3">Attempts</th>
              <th className="px-4 py-3">Last Tried</th>
              <th className="px-4 py-3">Error</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-8 text-center text-gray-500" colSpan="8">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-4 py-8 text-center text-gray-500" colSpan="8">No OMS sync logs found.</td></tr>
            ) : rows.map((row) => (
              <tr key={row.omsOrderSyncLogId} className="border-b last:border-0 align-top">
                <td className="px-4 py-3 font-semibold">#{row.omsOrderSyncLogId}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-bold ${statusClass(row.status)}`}>{row.status}</span></td>
                <td className="px-4 py-3">{row.orderType}</td>
                <td className="px-4 py-3">{row.localOrderIds || "-"}</td>
                <td className="px-4 py-3">{row.attempts}</td>
                <td className="px-4 py-3">{formatDate(row.lastTriedAt)}</td>
                <td className="px-4 py-3 max-w-[340px] whitespace-pre-wrap text-xs text-red-600">{row.errorMessage || "-"}</td>
                <td className="px-4 py-3">
                  {row.status !== "SUCCESS" ? (
                    <button disabled={retryingId === row.omsOrderSyncLogId} onClick={() => retry(row.omsOrderSyncLogId)} className="rounded-md bg-[#00462C] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">
                      {retryingId === row.omsOrderSyncLogId ? "Retrying..." : "Retry Post"}
                    </button>
                  ) : <span className="text-xs text-gray-400">Posted</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
