"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/nityagro-header"
import Footer from "@/components/nityagro-footer";

import CookieConsentBanner from "@/components/CookieConsentBanner";
//import { Toaster } from "react-hot-toast";
import TawkToWidget from "@/components/TawkToWidget";
import Toast from "@/components/Toast";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
     

      {children}

      {!isAdminRoute && <CookieConsentBanner />}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <TawkToWidget />  }
      {/* {!isAdminRoute && <Toaster position="top-right" />} */}
      {!isAdminRoute && <Toast />}
    </>
  );
}
