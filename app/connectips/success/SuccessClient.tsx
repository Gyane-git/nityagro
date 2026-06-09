"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import useCartStore from "@/store/cartStore";
import { removeCartFromDb } from "@/utils/accountListApi";

type ValidationResponse = {
  status?: string;
  statusDesc?: string;
  creditStatus?: string;
};

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const txnId = searchParams.get("TXNID") || "";
  const gatewayReferenceId =
    searchParams.get("REFERENCEID") ||
    searchParams.get("REFID") ||
    searchParams.get("OID") ||
    "";
  const referenceId = txnId || gatewayReferenceId;
  const txnAmtFromQuery = Number(searchParams.get("TXNAMT") || 0);

  const [result, setResult] = useState<{
    status: "loading" | "success" | "error";
    message?: string;
  }>({ status: "loading" });
  const removeItems = useCartStore((state) => state.removeItems);

  useEffect(() => {
    const run = async () => {
      try {
        if (!referenceId) {
          setResult({
            status: "error",
            message: "Missing ConnectIPS reference id.",
          });
          return;
        }

        const intentRaw = sessionStorage.getItem(
          `connectips_intent_${referenceId}`
        );
        const intent = intentRaw ? JSON.parse(intentRaw) : null;
        const amountCandidates = Array.from(
          new Set(
            [
              txnAmtFromQuery,
              Number(intent?.gatewayAmount || 0),
              Number(intent?.validationPaisaAmount || 0),
              Number(intent?.amount || 0),
              Math.round(Number(intent?.amount || 0) * 100),
            ].filter((value) => Number.isFinite(value) && value > 0),
          ),
        );

        if (!amountCandidates.length) {
          setResult({
            status: "error",
            message: "Missing transaction amount for verification.",
          });
          return;
        }

        let paymentVerified = false;
        let validateData: ValidationResponse = {};
        let detailsData: ValidationResponse = {};

        for (const txnAmt of amountCandidates) {
          const validateRes = await fetch("/connectips/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              REFERENCEID: referenceId,
              TXNID: txnId || referenceId,
              TXNAMT: txnAmt,
            }),
          });
          validateData = await validateRes.json().catch(() => ({}));
          const validateStatus = String(validateData?.status || "").toUpperCase();
          paymentVerified = validateRes.ok && validateStatus === "SUCCESS";

          if (paymentVerified) break;

          const detailsRes = await fetch("/connectips/get_details", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              REFERENCEID: referenceId,
              TXNID: txnId || referenceId,
              TXNAMT: txnAmt,
            }),
          });
          detailsData = await detailsRes.json().catch(() => ({}));
          const detailsStatus = String(detailsData?.status || "").toUpperCase();
          const creditStatus = String(detailsData?.creditStatus || "").toUpperCase();
          paymentVerified =
            detailsStatus === "SUCCESS" &&
            (creditStatus === "" ||
              creditStatus === "000" ||
              creditStatus === "999" ||
              creditStatus === "DEFER");

          if (paymentVerified) break;
        }

        if (!paymentVerified) {
          setResult({
            status: "error",
            message:
              validateData?.statusDesc ||
              detailsData?.statusDesc ||
              "Payment validation failed at bank.",
          });
          return;
        }

        if (!intent?.addressId || !Array.isArray(intent?.items) || !intent.items.length) {
          setResult({
            status: "error",
            message:
              "Payment verified, but checkout data is missing. Please contact support.",
          });
          return;
        }

        const finalizedKey = `connectips_finalized_${referenceId}`;
        if (sessionStorage.getItem(finalizedKey) === "1") {
          setResult({ status: "success" });
          return;
        }

        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: "connectips",
            connectipsReferenceId: referenceId,
            addressId: intent.addressId,
            address: intent.address,
            userId: intent.userId,
            totalAmount: intent.amount,
            items: intent.items,
          }),
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) {
          throw new Error(orderData?.message || "Failed to create paid order.");
        }

        sessionStorage.setItem(finalizedKey, "1");
        const orderedIds = Array.isArray(intent.items)
          ? intent.items.map((item: { id: number | string }) => item.id)
          : [];
        if (orderedIds.length) {
          removeItems(orderedIds);
          await Promise.all(orderedIds.map((id: number | string) => removeCartFromDb(id).catch(() => null)));
        }
        sessionStorage.removeItem(`connectips_intent_${referenceId}`);
        if (sessionStorage.getItem("connectips_last_reference") === referenceId) {
          sessionStorage.removeItem("connectips_last_reference");
        }

        setResult({ status: "success" });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while confirming payment.";
        toast.error(message);
        setResult({ status: "error", message });
      }
    };

    run();
  }, [referenceId, txnAmtFromQuery]);

  if (result.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-[#00462C]">
        Verifying payment...
      </div>
    );
  }

  if (result.status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-50 text-green-600">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white text-center mb-2">Payment Successful!</h1>
            <p className="text-green-100 text-center">Your order has been placed successfully.</p>
          </div>

          <div className="px-8 py-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center py-2 gap-2 border-b border-gray-200 last:border-b-0">
                <span className="text-gray-600 font-medium">Transaction ID</span>
                <span className="text-gray-900 font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                  {txnId || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 gap-2">
                <span className="text-gray-600 font-medium">Reference ID</span>
                <span className="text-gray-900 font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                  {referenceId}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Payment Verified</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/profile" className="w-full inline-flex items-center justify-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200">
                Go to Profile
              </Link>
              <Link href="/" className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white text-center mb-2">Payment Failed</h1>
          <p className="text-red-100 text-center">{result.message || "Could not verify payment."}</p>
        </div>
        <div className="px-8 py-6">
          <Link href="/Checkout" className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200">
            Back to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
