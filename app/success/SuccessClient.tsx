"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessClient() {
  const params = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/esewa/verify?${params.toString()}`);
        const data = await res.json();

        const status =
          data?.status || data?.data?.status || data?.response?.status;

        const success =
          status === "COMPLETE" ||
          status === "Success" ||
          status === "success";

        setIsSuccess(success);
      } catch (err) {
        console.error(err);
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-700 font-semibold">Verifying payment...</div>
      </div>
    );
  }

  if (!isSuccess) {
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
            We could not verify your payment.
          </p>

          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-lg text-white font-semibold"
            style={{ background: "#00462C" }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-600 text-2xl">✓</span>
        </div>

        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Payment Successful
        </h1>

        <p className="text-gray-500 mb-6">
          Your order has been placed successfully.
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
            onClick={() => router.push("/orders")}
            className="w-full py-3 rounded-lg border border-gray-300 text-gray-700"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
}
