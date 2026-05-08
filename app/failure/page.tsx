"use client";

import { useRouter } from "next/navigation";

export default function FailurePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-red-600 text-2xl">✕</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h1>

        <p className="text-gray-500 mb-6">
          Your payment could not be completed. Please try again.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-lg text-white font-semibold"
            style={{ background: "#00462C" }}
          >
            Go to Home
          </button>

          <button
            onClick={() => router.back()}
            className="w-full py-3 rounded-lg border border-gray-300 text-gray-700"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
