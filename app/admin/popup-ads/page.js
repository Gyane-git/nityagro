"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import useConfirmModalStore from "@/store/confirmModalStore";

const API_URL = "/api/popup-ads";

export default function PopupAdsAdmin() {
  const openConfirm = useConfirmModalStore((state) => state.open);
  const [ads, setAds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isActive: true,
  });

  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  };

  const fetchAds = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      const parsedAds = (json.data?.popupAds || []).map((item) => ({
        id: item.id,
        title: item.title || "Untitled popup",
        description: item.popupDescription || "",
        imageUrl: item.imageUrl || "",
        isActive: Boolean(item.isActive),
        updatedAt: item.updatedAt || "",
      }));

      setAds(parsedAds);
    } catch (err) {
      console.error("Failed to fetch popup ads:", err);
      toast.error("Failed to fetch popup ads");
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter popup title");
      return;
    }

    setSaving(true);
    const loadingId = toast.loading(editingAd ? "Updating popup..." : "Creating popup...");

    try {
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("isActive", formData.isActive ? "1" : "0");
      if (selectedImage) payload.append("image", selectedImage);

      const res = await fetch(editingAd ? `${API_URL}/${editingAd.id}` : API_URL, {
        method: editingAd ? "PUT" : "POST",
        body: payload,
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to save popup ad");
      }

      toast.success(editingAd ? "Popup updated successfully" : "Popup created successfully", {
        id: loadingId,
      });

      await fetchAds();
      resetForm();
    } catch (err) {
      console.error("Failed to save popup ad:", err);
      toast.error(err?.message || "Failed to save popup ad", { id: loadingId });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description || "",
      isActive: ad.isActive,
    });
    setSelectedImage(null);
    setPreviewImage(ad.imageUrl ? resolveImageUrl(ad.imageUrl) : "");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    openConfirm({
      title: "Delete Popup Ad",
      message: "Are you sure you want to delete this popup ad?",
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          const data = await res.json();
          if (!data.success) throw new Error(data.message || "Delete failed");
          toast.success("Popup deleted successfully");
          fetchAds();
        } catch (err) {
          console.error("Failed to delete popup ad:", err);
          toast.error(err?.message || "Failed to delete popup ad");
        }
      },
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      isActive: true,
    });
    setSelectedImage(null);
    setPreviewImage("");
    setEditingAd(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Popup Ads Manager</h2>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-5 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} /> Add New Popup
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-slate-700 to-slate-800 px-8 py-4">
            <h2 className="text-xl font-semibold text-white">Popup Banner List</h2>
          </div>

          <div className="p-6">
            {ads.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg">No popup ads yet. Create your first one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ads.map((ad) => (
                  <div
                    key={ad.id}
                    className="flex items-center gap-6 p-5 bg-linear-to-r from-slate-50 to-white border border-slate-200 rounded-xl hover:shadow-md transition-all"
                  >
                    {ad.imageUrl ? (
                      <div className="w-24 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                        <img
                          src={resolveImageUrl(ad.imageUrl)}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-16 rounded-lg border border-dashed border-slate-300 shrink-0 flex items-center justify-center text-xs text-slate-400">
                        No image
                      </div>
                    )}

                    <div className="grow min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-slate-800 truncate">{ad.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ad.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {ad.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{ad.description || "-"}</p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(ad)}
                        className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg"
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Popup Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Popup Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg text-black min-h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Popup Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedImage(file);
                    setPreviewImage(file ? URL.createObjectURL(file) : "");
                  }}
                  className="w-full px-4 py-2 border rounded-lg text-black"
                />
                {previewImage ? (
                  <img
                    src={resolveImageUrl(previewImage)}
                    alt="Preview"
                    className="mt-3 h-36 w-full object-cover rounded-lg border"
                  />
                ) : null}
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                Active
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingAd ? "Update Popup" : "Create Popup"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
