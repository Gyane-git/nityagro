// 


// ===============
"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AddCategoryPage() {
  const [categoryName, setCategoryName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryLogo, setCategoryLogo] = useState(null);
  const [categoryBanner, setCategoryBanner] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);

  const [categoryStatus, setCategoryStatus] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    if (type === "image") {
      setCategoryImage(file);
      setPreviewImage(url);
    }
    if (type === "logo") {
      setCategoryLogo(file);
      setPreviewLogo(url);
    }
    if (type === "banner") {
      setCategoryBanner(file);
      setPreviewBanner(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName) {
      toast.error("Category name is required!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("categoryName", categoryName);
      formData.append("slug", slug);
      formData.append("categoryDescription", categoryDescription);
      formData.append("categoryStatus", categoryStatus);

      if (categoryImage) formData.append("categoryImage", categoryImage);
      if (categoryLogo) formData.append("categoryLogo", categoryLogo);
      if (categoryBanner) formData.append("categoryBanner", categoryBanner);

      const res = await fetch("/api/categories", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Category added successfully!");

        setCategoryName("");
        setSlug("");
        setCategoryDescription("");
        setCategoryImage(null);
        setCategoryLogo(null);
        setCategoryBanner(null);

        setPreviewImage(null);
        setPreviewLogo(null);
        setPreviewBanner(null);

        setCategoryStatus(true);
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add New Category
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Category Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Slug
              </label>
              <input
                type="text"
                placeholder="Enter slug (optional)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                placeholder="Write a short description…"
                rows={4}
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="w-full border rounded-lg px-4 text-black py-2 outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Category Image */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "image")}
                className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  className="mt-3 h-40 w-40 object-cover rounded-lg border"
                />
              )}
            </div>

            {/* Category Logo */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "logo")}
                className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {previewLogo && (
                <img
                  src={previewLogo}
                  className="mt-3 h-40 w-40 object-cover rounded-lg border"
                />
              )}
            </div>

            {/* Category Banner */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category Banner
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "banner")}
                className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {previewBanner && (
                <img
                  src={previewBanner}
                  className="mt-3 h-40 w-40 object-cover rounded-lg border"
                />
              )}
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={categoryStatus}
                onChange={(e) => setCategoryStatus(e.target.checked)}
              />
              <label className="text-gray-700 font-medium">
                Active Status
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#0072bc] text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}