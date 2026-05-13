import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export const dynamic = "force-dynamic";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-gray-700 font-semibold">Verifying payment...</div>
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
