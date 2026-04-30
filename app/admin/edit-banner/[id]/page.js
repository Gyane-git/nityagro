"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function EditBannerPage() {
  const params = useParams();
  const router = useRouter();
  const bannerId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("0");
  const [isActive, setIsActive] = useState(true);
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
    if (!bannerId) return;

    const fetchBanner = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/banners");
        const data = await res.json();
        const banners = data.data?.banners || data.banners || [];
        const banner = banners.find((item) => String(item.id) === String(bannerId));
        if (!banner) throw new Error("Banner not found");

        setTitle(banner.title || "");
        setPosition(String(banner.position ?? 0));
        setIsActive(Boolean(banner.isActive));
        setExistingImage(banner.imageUrl || "");
        setPreview(banner.imageUrl ? resolveImageUrl(banner.imageUrl) : null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load banner");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [bannerId]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(existingImage ? resolveImageUrl(existingImage) : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bannerId) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("position", position);
      formData.append("isActive", isActive ? "1" : "0");
      if (image) formData.append("image", image);

      const res = await fetch(`/api/banners/${bannerId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to update banner");

      toast.success("Banner updated successfully!");
      router.push("/admin/banner-list");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">Loading banner...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.push("/admin/banner-list")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">Edit Banner</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Banner title"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Position</label>
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              Active
            </label>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Banner Image</label>
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
                  className="mt-3 h-40 w-full object-cover rounded-lg border"
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
