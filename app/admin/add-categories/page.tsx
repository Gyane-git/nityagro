"use client";

import { apiPostRequest } from "@/app/apihelper/apiHelper";
import Toast from "@/components/Toast";
import { useState } from "react";
import toast from "react-hot-toast";

type FormData = {
  categoryName: string;
  slug: string | null;
  categoryDescription: string | null;
  categoryImage: string | null;
  categoryLogo: string | null;
  categoryBanner: string | null;
  userId: string;
};

export default function AddCategoryPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // store file
  const [preview, setPreview] = useState(null); // for image preview
  const [loading, setLoading] = useState(false);

  const initialFormData: FormData = {
  categoryName: "",
  slug: null,
  categoryDescription: null,
  categoryImage: null,
  categoryLogo: null,
  categoryBanner: null,
  userId: "1",
};

  const [formdata, setFormData] = useState(initialFormData);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    console.log(formdata)
    try {
      const response = await apiPostRequest("/categories", formdata);
      if (response.success) {
        toast.success("response.message");
        setLoading(false);
        // reset form
        setFormData(initialFormData);
        return;
      } else {
        toast.error(response.message ?? "");

        setLoading(false);
        console.log(response.message);
      }
    } catch (error) {
      setLoading(false);

      console.error("Network error:", error);
    }
  };

  return (
    // <div className="w-full bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto">
    //   <h2 className="text-2xl font-semibold text-gray-800 mb-6">
    //     Add New Category
    //   </h2>

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
                value={formdata.categoryName ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    categoryName: e.target.value,
                  }));
                }}
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
                value={formdata.slug ?? ""}
               onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    slug: e.target.value,
                  }));
                }}
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
                value={formdata.categoryDescription ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    categoryDescription: e.target.value,
                  }));
                }}
                className="w-full border rounded-lg px-4 text-black py-2 outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-3 h-40 w-40 object-cover rounded-lg border"
                />
              )}
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
