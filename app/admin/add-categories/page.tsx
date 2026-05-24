"use client";

import Link from "next/link";
import toast from "react-hot-toast";

export default function AddCategoryPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Category Creation Moved
        </h1>
        <p className="text-gray-600 mb-6">
          Categories are now synced from OMS only. Please use{" "}
          <strong>OMS Data Sync</strong> in Categories List and then edit
          metadata (slug, description, images, status) there.
        </p>
        <Link
          href="/admin/categories-list"
          onClick={() => toast("Opening categories list. Use OMS Data Sync from there.")}
          className="inline-flex items-center justify-center rounded-lg bg-[#1f6a45] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#155235] transition"
        >
          Go to Categories List
        </Link>
      </div>
    </div>
  );
}
