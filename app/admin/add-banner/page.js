"use client";
import { useState } from "react";

export default function AddBannerPage() {
  const [bannerName, setBannerName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bannerName || !file) {
      setMsg("Fill both fields first ");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", bannerName);
    formData.append("image", file);

    // send to API (upload image + save to DB)
    const res = await fetch("/api/banners", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);
    setMsg(data.message);

    if (data.success) {
      setBannerName("");
      setFile(null);
    }
  };

  return (
    // <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow">
    //   <h1 className="text-2xl  text-black font-bold mb-4">Add Banner</h1>

      <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl text-black font-bold mb-4">Add Banner</h1>

      {msg && <p className="text-green-600 text-center">{msg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Banner Name */}
        <div>
          <label className="block mb-1 font-medium text-black">Banner Name</label>
          <input
            type="text"
            value={bannerName}
            onChange={(e) => setBannerName(e.target.value)}
            className="w-full text-black border px-3 py-2 rounded"
            placeholder="Enter banner name"
          />
        </div>

        {/* Upload Banner */}
        <div>
          <label className="block mb-1 text-black font-medium">Upload Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-black border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Uploading..." : "Add Banner"}
        </button>
      </form>
        </div>
      </div>
    </div>
  );
}
