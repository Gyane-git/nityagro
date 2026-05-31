"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const FAQ_SECTIONS = [
  { key: "products-quality", label: "Products & Quality" },
  { key: "orders-payment", label: "Orders & Payment" },
  { key: "shipping-delivery", label: "Shipping & Delivery" },
  { key: "returns-refunds", label: "Returns & Refunds" },
  { key: "health-usage", label: "Health & Usage" },
];

const EMPTY_FORM = {
  question: "",
  answer: "",
  faqSection: "products-quality",
  sortOrder: 0,
  showOnHome: false,
  faqStatus: true,
};

export default function AdminFaqsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sectionFilter, setSectionFilter] = useState("all");

  const loadFaqs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/faqs");
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Failed to fetch FAQs");
      }
      setItems(Array.isArray(payload.data) ? payload.data : []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch FAQs");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const filteredItems = useMemo(() => {
    if (sectionFilter === "all") return items;
    return items.filter((item) => item.faqSection === sectionFilter);
  }, [items, sectionFilter]);

  const homeSelectedCount = useMemo(
    () => items.filter((item) => item.showOnHome).length,
    [items],
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      question: item.question || "",
      answer: item.answer || "",
      faqSection: item.faqSection || "products-quality",
      sortOrder: Number(item.sortOrder || 0),
      showOnHome: Boolean(item.showOnHome),
      faqStatus: Boolean(item.faqStatus),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const question = form.question.trim();
    const answer = form.answer.trim();
    if (question.length < 3) {
      toast.error("Question must be at least 3 characters");
      return;
    }
    if (answer.length < 3) {
      toast.error("Answer must be at least 3 characters");
      return;
    }

    if (!editingId && form.showOnHome && homeSelectedCount >= 5) {
      toast.error("Homepage FAQ can show maximum 5 questions");
      return;
    }

    if (editingId) {
      const current = items.find((item) => String(item.id) === String(editingId));
      if (!current?.showOnHome && form.showOnHome && homeSelectedCount >= 5) {
        toast.error("Homepage FAQ can show maximum 5 questions");
        return;
      }
    }

    try {
      setSaving(true);
      const response = await fetch(editingId ? `/api/faqs/${editingId}` : "/api/faqs", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, question, answer }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Failed to save FAQ");
      }
      toast.success(payload.message || "FAQ saved successfully");
      resetForm();
      loadFaqs();
    } catch (error) {
      toast.error(error.message || "Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete FAQ: "${item.question}"?`)) return;
    try {
      const response = await fetch(`/api/faqs/${item.id}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Failed to delete FAQ");
      }
      toast.success("FAQ deleted successfully");
      loadFaqs();
    } catch (error) {
      toast.error(error.message || "Failed to delete FAQ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-700">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between text-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
          <p className="text-sm text-gray-500">
            Add unlimited questions for each FAQ page section. Select only 5 for homepage FAQ.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
          Homepage Selected: {homeSelectedCount}/5
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {editingId ? "Edit FAQ" : "Add FAQ"}
          </h2>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Section</label>
            <select
              value={form.faqSection}
              onChange={(event) => handleChange("faqSection", event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2e5e2e]"
            >
              {FAQ_SECTIONS.map((section) => (
                <option key={section.key} value={section.key}>
                  {section.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Sort Order</label>
            <input
              type="number"
              min="0"
              value={form.sortOrder}
              onChange={(event) => handleChange("sortOrder", Number(event.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2e5e2e]"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Question</label>
            <input
              value={form.question}
              onChange={(event) => handleChange("question", event.target.value)}
              placeholder="Write question"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2e5e2e]"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Answer</label>
            <textarea
              rows={4}
              value={form.answer}
              onChange={(event) => handleChange("answer", event.target.value)}
              placeholder="Write answer"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2e5e2e]"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <input
              type="checkbox"
              checked={form.faqStatus}
              onChange={(event) => handleChange("faqStatus", event.target.checked)}
              className="h-4 w-4 accent-[#2e5e2e]"
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <input
              type="checkbox"
              checked={form.showOnHome}
              onChange={(event) => handleChange("showOnHome", event.target.checked)}
              className="h-4 w-4 accent-[#DB8F00]"
            />
            Show in homepage FAQ
          </label>
        </div>

        <div className="mt-5">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#2e5e2e] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#244b24] disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update FAQ" : "Add FAQ"}
          </button>
        </div>
      </form>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSectionFilter("all")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${sectionFilter === "all" ? "bg-[#2e5e2e] text-white" : "bg-white border border-gray-200 text-gray-600"}`}
        >
          All
        </button>
        {FAQ_SECTIONS.map((section) => (
          <button
            key={section.key}
            onClick={() => setSectionFilter(section.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${sectionFilter === section.key ? "bg-[#2e5e2e] text-white" : "bg-white border border-gray-200 text-gray-600"}`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Home</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Sort</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="px-4 py-10 text-center text-gray-400">Loading FAQs...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan="6" className="px-4 py-10 text-center text-gray-400">No FAQs found.</td></tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{item.question}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.answer}</p>
                    </td>
                    <td className="px-4 py-3">
                      {FAQ_SECTIONS.find((section) => section.key === item.faqSection)?.label || item.faqSection}
                    </td>
                    <td className="px-4 py-3">{item.showOnHome ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.faqStatus ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {item.faqStatus ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{item.sortOrder}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(item)} className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item)} className="rounded-md border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
