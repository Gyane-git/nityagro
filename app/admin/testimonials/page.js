"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import useConfirmModalStore from "@/store/confirmModalStore";
import useWarningModalStore from "@/store/warningModalStore";

const API_URL = "/api/testimonials";
const YOUTUBE_API_URL = "/api/youtube-testimonials";

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

function getAuthHeader() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function TestimonialsAdmin() {
  const openConfirm = useConfirmModalStore((state) => state.open);
  const openWarning = useWarningModalStore((state) => state.open);
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [youtubeItems, setYoutubeItems] = useState([]);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [editingYoutubeItem, setEditingYoutubeItem] = useState(null);
  const [testimonialImageFile, setTestimonialImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    name: "",
    destination: "",
    profile_image: "",
    rating: 5,
    message: "",
    isActive: true,
  });
  const [youtubeForm, setYoutubeForm] = useState({
    title: "",
    description: "",
    youtubeLink: "",
    isActive: true,
  });

  useEffect(() => {
    fetchTestimonials();
    fetchYoutubeTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      const list = Array.isArray(data) ? data : data?.data || [];
      const parsed = list.map((item) => ({
        id: item.id,
        title: item.title || "",
        name: item.name,
        destination: item.destination,
        profile_image: item.profile_image || item.image,
        rating: Number(item.rating || item.starRating || 5),
        message: item.description || item.message,
        isActive: !!item.isActive,
      }));

      setTestimonials(parsed);
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
    }
  };

  const fetchYoutubeTestimonials = async () => {
    try {
      const res = await fetch(YOUTUBE_API_URL);
      const payload = await res.json();
      setYoutubeItems(payload?.data || []);
    } catch (err) {
      console.error("Failed to fetch youtube testimonials:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!getAdminToken()) {
      toast.error("Please login as admin again");
      return;
    }

    if (!formData.name || !formData.message) {
      toast.error("User name and description are required");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title || "");
    payload.append("name", formData.name || "");
    payload.append("destination", formData.destination || "");
    payload.append("description", formData.message || "");
    payload.append("rating", String(formData.rating || 5));
    payload.append("isActive", formData.isActive ? "1" : "0");
    payload.append("existingImage", formData.profile_image || "");
    if (testimonialImageFile) {
      payload.append("image", testimonialImageFile);
    }

    try {
      if (editingItem) {
        payload.append("id", String(editingItem.id));
        const res = await fetch(API_URL, {
          method: "PUT",
          headers: {
            ...getAuthHeader(),
          },
          body: payload,
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result?.message || "Failed to update testimonial");
        toast.success("Testimonial updated");
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            ...getAuthHeader(),
          },
          body: payload,
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result?.message || "Failed to create testimonial");
        toast.success("Testimonial created");
      }

      fetchTestimonials();
      resetForm();
    } catch (err) {
      console.error("Save failed:", err);
      toast.error(err?.message || "Failed to save testimonial");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      name: item.name,
      destination: item.destination,
      profile_image: item.profile_image,
      rating: Number(item.rating || 5),
      message: item.message,
      isActive: item.isActive,
    });
    setTestimonialImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!getAdminToken()) {
      openWarning({
        title: "Session Expired",
        message: "Please login again to delete testimonial.",
      });
      return;
    }

    openConfirm({
      title: "Delete Testimonial",
      message: "Are you sure you want to delete this testimonial?",
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}?id=${id}`, {
            method: "DELETE",
            headers: {
              ...getAuthHeader(),
            },
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result?.message || "Failed to delete testimonial");
          toast.success("Testimonial deleted");
          fetchTestimonials();
        } catch (err) {
          console.error("Delete failed:", err);
          toast.error(err?.message || "Failed to delete testimonial");
        }
      },
    });
  };

  const handleYoutubeSubmit = async (e) => {
    e.preventDefault();
    if (!getAdminToken()) {
      toast.error("Please login as admin again");
      return;
    }
    if (!youtubeForm.title || !youtubeForm.youtubeLink) {
      toast.error("Title and YouTube link are required");
      return;
    }
    try {
      if (editingYoutubeItem) {
        const res = await fetch(YOUTUBE_API_URL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            id: editingYoutubeItem.id,
            title: youtubeForm.title,
            description: youtubeForm.description,
            youtubeLink: youtubeForm.youtubeLink,
            isActive: youtubeForm.isActive,
          }),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.message || "Failed to update");
      } else {
        const res = await fetch(YOUTUBE_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            title: youtubeForm.title,
            description: youtubeForm.description,
            youtubeLink: youtubeForm.youtubeLink,
            isActive: youtubeForm.isActive,
          }),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.message || "Failed to create");
      }
      toast.success("YouTube testimonial saved");
      fetchYoutubeTestimonials();
      resetYoutubeForm();
    } catch (err) {
      toast.error(err?.message || "Failed to save youtube testimonial");
    }
  };

  const handleYoutubeEdit = (item) => {
    setEditingYoutubeItem(item);
    setYoutubeForm({
      title: item.title || "",
      description: item.description || "",
      youtubeLink: item.youtubeLink || "",
      isActive: Boolean(item.status),
    });
    setShowYoutubeModal(true);
  };

  const handleYoutubeDelete = async (id) => {
    if (!getAdminToken()) {
      openWarning({
        title: "Session Expired",
        message: "Please login again to delete YouTube testimonial.",
      });
      return;
    }
    openConfirm({
      title: "Delete Video Testimonial",
      message: "Are you sure you want to delete this YouTube testimonial?",
      onConfirm: async () => {
        try {
          const res = await fetch(`${YOUTUBE_API_URL}?id=${id}`, {
            method: "DELETE",
            headers: {
              ...getAuthHeader(),
            },
          });
          const payload = await res.json();
          if (!res.ok) throw new Error(payload?.message || "Delete failed");
          toast.success("Deleted");
          fetchYoutubeTestimonials();
        } catch (err) {
          toast.error(err?.message || "Delete failed");
        }
      },
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      name: "",
      destination: "",
      profile_image: "",
      rating: 5,
      message: "",
      isActive: true,
    });
    setTestimonialImageFile(null);
    setEditingItem(null);
    setShowModal(false);
  };

  const resetYoutubeForm = () => {
    setYoutubeForm({
      title: "",
      description: "",
      youtubeLink: "",
      isActive: true,
    });
    setEditingYoutubeItem(null);
    setShowYoutubeModal(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Testimonials Manager
          </h2>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-5 py-3 bg-blue-600 text-white rounded-xl shadow flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={18} /> Add Testimonial
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-slate-700 to-slate-800 px-8 py-4">
            <h2 className="text-xl font-semibold text-white">
              Testimonials
            </h2>
          </div>

          <div className="p-6">
            {testimonials.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg">
                  No testimonials added yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {testimonials.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-6 p-5 border rounded-xl bg-linear-to-r from-slate-50 to-white hover:shadow-md"
                  >
                    <img
                      src={item.profile_image || "/placeholder.png"}
                      className="w-16 h-16 rounded-full object-cover border"
                      alt=""
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold truncate">
                          {item.name}
                        </h3>

                        <span
                          className={`px-3 py-1 text-xs rounded-full font-semibold ${
                            item.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600">
                        {item.destination || "Customer"} · {item.rating || 5} Star
                      </p>

                      <p className="mt-2 text-slate-700 line-clamp-2">
                        {item.title ? <span className="font-semibold">{item.title}: </span> : null}
                        “{item.message}”
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto text-gray-600">
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <input
                name="title"
                placeholder="Review Title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border px-4 py-3 rounded-lg"
              />

              <input
                name="name"
                placeholder="User Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border px-4 py-3 rounded-lg"
                required
              />

              <input
                name="destination"
                placeholder="Destination / Designation"
                value={formData.destination}
                onChange={handleInputChange}
                className="w-full border px-4 py-3 rounded-lg"
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      className={`text-3xl leading-none ${
                        star <= Number(formData.rating || 0)
                          ? "text-yellow-400"
                          : "text-slate-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-slate-500">
                    {formData.rating}/5
                  </span>
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setTestimonialImageFile(e.target.files?.[0] || null)}
                className="w-full border px-4 py-3 rounded-lg"
              />
              {(testimonialImageFile || formData.profile_image) && (
                <div className="flex items-center gap-3">
                  <img
                    src={
                      testimonialImageFile
                        ? URL.createObjectURL(testimonialImageFile)
                        : formData.profile_image
                    }
                    alt="Preview"
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                  <span className="text-sm text-slate-600">
                    {testimonialImageFile ? testimonialImageFile.name : "Current image"}
                  </span>
                </div>
              )}

              <textarea
                name="message"
                placeholder="Description / Review"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full border px-4 py-3 rounded-lg min-h-[120px]"
                required
              />

              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-5 h-5"
                />
                <span>Set as active</span>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border py-3 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
                >
                  {editingItem ? "Update Testimonial" : "Create Testimonial"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      
    </div>
  );
}
