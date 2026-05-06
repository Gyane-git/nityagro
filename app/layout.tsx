import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: {
    default: "Nityagro",
    template: "%s | Nityagro",
  },
  description: "Official Nityagro store.",

  applicationName: "Nityagro",

  metadataBase: new URL("https://nityagro.com"),

  // temporary change
  // icons: {
  //   icon: "/nityagro_logo.png",
  // },

  openGraph: {
    title: "Nityagro",
    description:
      "Explore Nityagro's official store for premium agricultural products. Discover a wide range of high-quality seeds, fertilizers, and farming tools designed to boost your agricultural success. Shop now for the best in farming essentials.",
    url: "https://nityagro.com",
    siteName: "Nityagro",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Nityagro",
    description: "Official Nityagro store.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* temporary change */}
        {/* <link rel="icon" href="/yumei_logo.png" /> */}

        {/* ✅ Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Nityagro",
              url: "https://nityagro.com",
            }),
          }}
        />
        <meta
          name="google-site-verification"
          content="4Pbvvp7u8ymUTbtietI_J_9ruHzdrzbDCRZofhLI2V4"
        />
      </head>
      <body suppressHydrationWarning={true} className="antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
