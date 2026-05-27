"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddBannerPage() {
  const [form, setForm] = useState({
    bannerName: "",
    slug: "",
    bannerDescription: "",
    bannerStatus: true,
  });
  const [bannerImageforWeb, setBannerImageforWeb] = useState(null);
  const [bannerImageforMobile, setBannerImageforMobile] = useState(null);
  const [cardImage, setCardImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const readApiResponse = async (res) => {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json();
    }
    const text = await res.text();
    return {
      success: false,
      message:
        res.status === 413
          ? "Image is too large. Please upload a smaller image or increase server upload limit."
          : text || `Request failed with status ${res.status}`,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.bannerName.trim()) {
      toast.error("Banner name is required");
      return;
    }

    setLoading(true);
    const loadingToastId = toast.loading("Creating banner...");

    try {
      const formData = new FormData();
      formData.append("bannerName", form.bannerName.trim());
      formData.append("slug", form.slug.trim());
      formData.append("bannerDescription", form.bannerDescription.trim());
      formData.append("bannerStatus", form.bannerStatus ? "1" : "0");
      if (bannerImageforWeb) formData.append("bannerImageforWeb", bannerImageforWeb);
      if (bannerImageforMobile) formData.append("bannerImageforMobile", bannerImageforMobile);
      if (cardImage) formData.append("cardImage", cardImage);

      const res = await fetch("/api/banners", {
        method: "POST",
        body: formData,
      });
      const data = await readApiResponse(res);
      if (!data.success) {
        throw new Error(data.message || "Failed to create banner");
      }

      toast.success("Banner created successfully", { id: loadingToastId });
      setForm({
        bannerName: "",
        slug: "",
        bannerDescription: "",
        bannerStatus: true,
      });
      setBannerImageforWeb(null);
      setBannerImageforMobile(null);
      setCardImage(null);
    } catch (error) {
      toast.error(error?.message || "Failed to create banner", {
        id: loadingToastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl text-black font-bold mb-4">Add Banner</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-black">Banner Name</label>
                <input
                  type="text"
                  value={form.bannerName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, bannerName: e.target.value }))
                  }
                  className="w-full text-black border px-3 py-2 rounded"
                  placeholder="Enter banner name"
                />
              </div>

              
            </div>

            <div>
              <label className="block mb-1 font-medium text-black">Description</label>
              <textarea
                value={form.bannerDescription}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bannerDescription: e.target.value }))
                }
                className="w-full text-black border px-3 py-2 rounded min-h-24"
                placeholder="Banner description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-black font-medium">Banner Image (Web)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerImageforWeb(e.target.files?.[0] || null)}
                  className="w-full text-black border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 text-black font-medium">Banner Image (Mobile)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerImageforMobile(e.target.files?.[0] || null)}
                  className="w-full text-black border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 text-black font-medium">Card Image (Slider)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCardImage(e.target.files?.[0] || null)}
                  className="w-full text-black border px-3 py-2 rounded"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.bannerStatus}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bannerStatus: e.target.checked }))
                }
              />
              Active Banner
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? "Saving..." : "Add Banner"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
