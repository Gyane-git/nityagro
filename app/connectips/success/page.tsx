"use client";

import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessClient />
    </Suspense>
  );
}
