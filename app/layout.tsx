import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: {
    default: "YuemiNepal",
    template: "%s | YuemiNepal",
  },
  description:
    "Official Yuemi Ecosystem Nepal store for accessories, LED lights, and car infotainment systems.",

  applicationName: "YuemiNepal",

  metadataBase: new URL("https://yuemi.com.np"),

  icons: {
    icon: "/yumei_logo.png",
  },

  openGraph: {
    title: "YuemiNepal",
    description:
      "Explore Yuemi Ecosystem Nepal products and smart automotive solutions.",
    url: "https://yuemi.com.np",
    siteName: "YuemiNepal",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "YuemiNepal",
    description: "Official Yuemi Ecosystem Nepal store.",
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
        <link rel="icon" href="/yumei_logo.png" />

        {/* ✅ Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "YuemiNepal",
              url: "https://yuemi.com.np",
            }),
          }}
        />
        <meta name="google-site-verification" content="4Pbvvp7u8ymUTbtietI_J_9ruHzdrzbDCRZofhLI2V4" />
      </head>

      <body className="antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}