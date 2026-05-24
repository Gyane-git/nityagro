"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  };

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/categories/${categoryId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to load category");

        const category = data.data?.category || data.data;
        setName(category.category || "");
        setSlug(category.slug || "");
        setDescription(category.description || "");
        setExistingImage(category.image || "");
        setPreview(category.image ? resolveImageUrl(category.image) : null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      toast.success("Category image selected");
    } else {
      setImage(null);
      setPreview(existingImage ? resolveImageUrl(existingImage) : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required!");
      return;
    }

    if (!categoryId) return;

    const saveToastId = toast.loading("Updating category...");
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("status", 1);
      formData.append("slug", slug);
      formData.append("description", description);
      if (image) formData.append("image", image);

      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to update category");

      toast.success("Category updated successfully!", { id: saveToastId });
      router.push("/admin/categories-list");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong!", { id: saveToastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          Loading category...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.push("/admin/categories-list")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">Edit Category</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Slug</label>
              <input
                type="text"
                placeholder="Enter slug (optional)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                placeholder="Write a short description…"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg px-4 text-black py-2 outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Category Image</label>
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

            <button
              type="submit"
              disabled={saving}
              className={`w-full bg-[#0072bc] text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors ${
                saving ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
