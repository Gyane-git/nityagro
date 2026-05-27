"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import useConfirmModalStore from "@/store/confirmModalStore";

export default function EditBannerPage() {
  const params = useParams();
  const router = useRouter();
  const bannerId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const openConfirm = useConfirmModalStore((state) => state.open);

  const [form, setForm] = useState({
    bannerName: "",
    slug: "",
    bannerDescription: "",
    bannerStatus: true,
  });

  const [bannerImageforWeb, setBannerImageforWeb] = useState(null);
  const [bannerImageforMobile, setBannerImageforMobile] = useState(null);
  const [cardImage, setCardImage] = useState(null);

  const [previewWeb, setPreviewWeb] = useState(null);
  const [previewMobile, setPreviewMobile] = useState(null);
  const [previewCard, setPreviewCard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  };

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

  useEffect(() => {
    if (!bannerId) return;

    const fetchBanner = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/banners/${bannerId}`);
        const data = await res.json();
        const banner = data.data;
        if (!data.success || !banner) throw new Error("Banner not found");

        setForm({
          bannerName: banner.bannerName || banner.title || "",
          slug: banner.slug || "",
          bannerDescription: banner.bannerDescription || "",
          bannerStatus: Boolean(banner.bannerStatus ?? banner.isActive),
        });

        setPreviewWeb(
          banner.bannerImageforWeb
            ? resolveImageUrl(banner.bannerImageforWeb)
            : null,
        );
        setPreviewMobile(
          banner.bannerImageforMobile
            ? resolveImageUrl(banner.bannerImageforMobile)
            : null,
        );
        setPreviewCard(
          banner.cardImage ? resolveImageUrl(banner.cardImage) : null,
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load banner");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [bannerId]);

  const handleImageChange = (setter, previewSetter) => (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file);
      previewSetter(URL.createObjectURL(file));
    } else {
      setter(null);
    }
  };

  const submitUpdate = async () => {
    if (!bannerId) return;
    if (!form.bannerName.trim()) {
      toast.error("Banner name is required");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("bannerName", form.bannerName.trim());
      formData.append("slug", form.slug.trim());
      formData.append("bannerDescription", form.bannerDescription.trim());
      formData.append("bannerStatus", form.bannerStatus ? "1" : "0");
      if (bannerImageforWeb) formData.append("bannerImageforWeb", bannerImageforWeb);
      if (bannerImageforMobile) formData.append("bannerImageforMobile", bannerImageforMobile);
      if (cardImage) formData.append("cardImage", cardImage);

      const res = await fetch(`/api/banners/${bannerId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await readApiResponse(res);
      if (!data.success) throw new Error(data.message || "Failed to update banner");

      toast.success("Banner updated successfully");
      router.push("/admin/banner-list");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    openConfirm({
      title: "Save Banner Changes",
      message: "Do you want to save banner changes now?",
      onConfirm: submitUpdate,
    });
  };

  const handleDelete = () => {
    openConfirm({
      title: "Delete Banner",
      message: "Are you sure you want to delete this banner? This action cannot be undone.",
      onConfirm: async () => {
        if (!bannerId) return;
        setDeleting(true);
        try {
          const res = await fetch(`/api/banners/${bannerId}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message || "Delete failed");
          toast.success("Banner deleted successfully");
          router.push("/admin/banner-list");
        } catch (error) {
          toast.error(error?.message || "Delete failed");
        } finally {
          setDeleting(false);
        }
      },
    });
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
      <div className="max-w-3xl mx-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Banner Name</label>
                <input
                  type="text"
                  value={form.bannerName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, bannerName: e.target.value }))
                  }
                  className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Banner title"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="home-banner"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Banner Description</label>
              <textarea
                value={form.bannerDescription}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bannerDescription: e.target.value }))
                }
                className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                placeholder="Description"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.bannerStatus}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bannerStatus: e.target.checked }))
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              Active
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Banner Image (Web)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange(setBannerImageforWeb, setPreviewWeb)}
                  className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {previewWeb ? (
                  <img src={previewWeb} alt="Web banner" className="mt-3 h-28 w-full object-cover rounded-lg border" />
                ) : null}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Banner Image (Mobile)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange(setBannerImageforMobile, setPreviewMobile)}
                  className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {previewMobile ? (
                  <img src={previewMobile} alt="Mobile banner" className="mt-3 h-28 w-full object-cover rounded-lg border" />
                ) : null}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Card Image (Slider)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange(setCardImage, setPreviewCard)}
                  className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {previewCard ? (
                  <img src={previewCard} alt="Card image" className="mt-3 h-28 w-full object-cover rounded-lg border" />
                ) : null}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="w-1/3 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Banner"}
              </button>

              <button
                type="submit"
                disabled={saving || deleting}
                className="w-2/3 bg-[#0072bc] text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
