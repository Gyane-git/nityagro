"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ADMIN_PERMISSION_OPTIONS } from "@/lib/adminPermissions";

const emptyForm = { name: "", email: "", password: "", permissions: [] };

function parsePermissions(value) {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
  }
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const response = await fetch("/api/users", { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (response.status === 401 || response.status === 403) {
      toast.error("Only super admin can manage users");
      router.replace("/admin/dashboard");
      return;
    }
    setUsers(payload.data || []);
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const togglePermission = (key) => {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(key)
        ? current.permissions.filter((item) => item !== key)
        : [...current.permissions, key],
    }));
  };

  const editUser = (user) => {
    setEditing(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      permissions: parsePermissions(user.rolePermission),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/users", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editing?.userId,
          name: form.name,
          email: form.email,
          password: form.password,
          permissions: form.permissions,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "Unable to save user");
      toast.success(editing ? "Permissions updated" : "Admin user created");
      resetForm();
      await loadUsers();
    } catch (error) {
      toast.error(error.message || "Unable to save user");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user) => {
    const response = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.userId, status: !user.status }),
    });
    if (!response.ok) {
      toast.error("Unable to update status");
      return;
    }
    loadUsers();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6 text-gray-900">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Users & Permissions</h1>
        <p className="mt-1 text-sm text-gray-500">Create admin users and choose exactly which sidebar sections they can access.</p>
      </div>

      <form onSubmit={submit} className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
          <label className="text-sm font-medium text-gray-700">Email<input required disabled={!!editing} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-100" /></label>
          {!editing && <label className="text-sm font-medium text-gray-700">Password<input required minLength={8} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>}
        </div>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-gray-900"><h2 className="font-semibold text-gray-900">Sidebar permissions</h2><span className="text-xs text-gray-500">{form.permissions.length} selected</span></div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {ADMIN_PERMISSION_OPTIONS.filter((item) => item.key !== "users").map((item) => (
              <label key={item.key} className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
                <input type="checkbox" checked={form.permissions.includes(item.key)} onChange={() => togglePermission(item.key)} className="h-4 w-4 accent-emerald-700" />
                {item.label}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button disabled={saving} className="rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : editing ? "Update Permissions" : "Create Admin User"}</button>
          {editing && <button type="button" onClick={resetForm} className="rounded-lg border px-5 py-2.5 font-semibold text-gray-700">Cancel</button>}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4 font-semibold text-gray-900">Admin accounts</div>
        {loading ? <div className="p-5 text-sm text-gray-500">Loading users...</div> : users.length === 0 ? <div className="p-5 text-sm text-gray-500">No admin users found.</div> : <div className="divide-y">
          {users.filter((user) => String(user.role || "").toUpperCase().includes("ADMIN")).map((user) => (
            <div key={user.userId} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
              <div><p className="font-semibold text-gray-900">{user.name}</p><p className="text-sm text-gray-500">{user.email} · {parsePermissions(user.rolePermission).length || "Full"} permissions</p></div>
              <div className="flex gap-2"><button onClick={() => editUser(user)} className="rounded-lg border px-3 py-2 text-sm font-medium">Edit permissions</button><button onClick={() => toggleStatus(user)} className={`rounded-lg px-3 py-2 text-sm font-medium ${user.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{user.status ? "Active" : "Inactive"}</button></div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}
