"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConfirmModalStore from "@/store/confirmModalStore";
import useInfoModalStore from "@/store/infoModalStore";

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const openConfirm = useConfirmModalStore((state) => state.open);
  const openInfo = useInfoModalStore((state) => state.open);
  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return "/no-image.png";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  };

  const fetchBanners = async () => {
    const res = await fetch("/api/banners");
    const data = await res.json();
    if (data.success) {
      setBanners(data.data?.banners || data.banners || []);
    }
  };

  const deleteBanner = async (id) => {
    openConfirm({
      title: "Delete Banner",
      message: "Are you sure you want to delete this banner? This action cannot be undone.",
      onConfirm: async () => {
        const res = await fetch(`/api/banners/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Banner removed successfully");
          fetchBanners();
        } else {
          toast.error("Failed to delete banner");
        }
      },
    }); 


    // if (data.success) {
    //   toast.success("Banner removed successfully");
    //   fetchBanners();
    // } else {
    //   toast.error("Failed to delete banner");
    // }
  };

  const handleEdit = (id) => {
    window.location.href = `/admin/edit-banner/${id}`;
  };

  const handleInfo = (banner) => {
    openInfo({
      title: "Banner Details",
      message: [
        `Name: ${banner.bannerName || banner.title || "Untitled banner"}`,
        `Status: ${banner.isActive || banner.bannerStatus ? "Active" : "Inactive"}`,
        `Slug: ${banner.slug || "-"}`,
        `Description: ${banner.bannerDescription || "-"}`,
      ].join("\n"),
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBanners();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 ">
        <h1 className="text-3xl font-bold text-gray-800">Banner Management</h1>
        <p className="text-gray-600 mt-1">Manage your banner collection</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden text-stone-600">
        {banners.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No banners available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-280 text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3">Banner</th>
                  
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Web Image</th>
                  <th className="px-4 py-3">Mobile Image</th>
                  <th className="px-4 py-3">Card Image</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr
                    key={banner.id}
                    className="border-b last:border-0 align-top hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">
                        {banner.bannerName || banner.title || "Untitled banner"}
                      </div>
                      <div className="text-xs text-gray-500">ID: {banner.id}</div>
                    </td>
                    
                    <td className="px-4 py-3 text-gray-700 max-w-70">
                      <div className="line-clamp-2">
                        {banner.bannerDescription || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-24 h-14">
                        <img
                          src={resolveImageUrl(banner.bannerImageforWeb || banner.imageUrl)}
                          alt={banner.bannerName || "Banner Web"}
                          className="w-full h-full object-cover rounded border border-gray-200"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-24 h-14">
                        <img
                          src={resolveImageUrl(banner.bannerImageforMobile || banner.imageUrl)}
                          alt={banner.bannerName || "Banner Mobile"}
                          className="w-full h-full object-cover rounded border border-gray-200"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-24 h-14">
                        <img
                          src={resolveImageUrl(banner.cardImage || banner.imageUrl)}
                          alt={banner.bannerName || "Banner Card"}
                          className="w-full h-full object-cover rounded border border-gray-200"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          banner.isActive || banner.bannerStatus
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {banner.isActive || banner.bannerStatus ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {banner.updatedAt
                        ? new Date(banner.updatedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleInfo(banner)}
                          className="px-3 py-1 text-xs font-medium text-sky-600 bg-sky-50 rounded-md hover:bg-sky-100 transition-colors"
                          title="View Banner Info"
                        >
                          Info
                        </button>
                        <button
                          onClick={() => handleEdit(banner.id)}
                          className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                          title="Edit Banner"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteBanner(banner.id)}
                          className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                          title="Delete Banner"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
