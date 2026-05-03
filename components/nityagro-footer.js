"use client";

import Image from "next/image";

// Social Icons
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.09-1.09a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
  </svg>
);

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const CUSTOMER_SUPPORT = [
  { label: "FAQs", href: "/faqs" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Return & Refund Policy", href: "/return-policy" },
];

const COMPANY = [
  { label: "About Nityagro", href: "/about" },
  { label: "Our Mission", href: "/mission" },
  {label: "Contact Us", href: "/contact-us" }
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden">
      {/* ── Mountain background image (decorative top section) ── */}
      <div className="relative w-full" style={{ height: "650px" }}>
        <Image
          src="/footer-bg image.png"
          alt=""
          fill
          className="object-cover object-top"
          priority
          aria-hidden="true"
        />
        {/* ── Dark green content area ── */}
      <div className="  absolute inset-0 bg-transparent w-full top-65">
        {/* Inner container: ax 1220px centered, matching Figma frame */}
        <div
          className="mx-auto px-8"
          style={{ maxWidth: "1220px" }}
        >
          {/* ── Top grid: 4 columns ── */}
          {/*
            Col 1: width 345.99 / gap 19.99  → GET IN TOUCH block (height ~180)
            Col 2–4: width 207.3 / gap 18    → Customer Support / Company / Legal (height ~222)
          */}
          <div
            className="grid pt-12 pb-10"
            style={{
              gridTemplateColumns: "345.99px 207.3px 207.3px 207.3px",
              columnGap: "20px",
            }}
          >
            {/* ── GET IN TOUCH ── */}
            <div
              className="flex flex-col"
              style={{ height: "180px", gap: "19.99px" }}
            >
              <h3 className="text-white font-bold text-[17px] tracking-widest uppercase">
                GET IN TOUCH
              </h3>

              <p className="text-white/75 text-sm leading-[1.65]">
                Join our network of trusted partners and bring traditional,
                organic products to your community
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="tel:+915400025124553"
                  className="flex items-center gap-3 text-white/85 text-sm hover:text-white transition-colors group"
                >
                  <span className="opacity-75 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <PhoneIcon />
                  </span>
                  <span>(+91)-540-025-124553</span>
                </a>

                <a
                  href="mailto:sale@nityagro.com"
                  className="flex items-center gap-3 text-white/85 text-sm hover:text-white transition-colors group"
                >
                  <span className="opacity-75 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <MailIcon />
                  </span>
                  <span>sale@nityagro.com</span>
                </a>
              </div>
            </div>

            {/* ── Customer Support ── */}
            <div
              className="flex flex-col"
              style={{ height: "222px", gap: "18px" }}
            >
              <h4 className="text-white font-semibold text-[15px]">
                Customer Support
              </h4>
              <div className="flex flex-col" style={{ gap: "18px" }}>
                {CUSTOMER_SUPPORT.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-white/75 text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Company ── */}
            <div
              className="flex flex-col"
              style={{ height: "222px", gap: "18px" }}
            >
              <h4 className="text-white font-semibold text-[15px]">
                Company
              </h4>
              <div className="flex flex-col" style={{ gap: "18px" }}>
                {COMPANY.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-white/75 text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Legal ── */}
            <div
              className="flex flex-col"
              style={{ height: "222px", gap: "18px" }}
            >
              <h4 className="text-white font-semibold text-[15px]">Legal</h4>
              <div className="flex flex-col" style={{ gap: "18px" }}>
                {LEGAL.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-white/75 text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-[#E6ECF0] " />

          {/* ── Bottom bar ── */}
          <div className="flex items-center justify-between py-5 ">
            <p className="text-white/70 text-sm">
              © 2022, Nityagro - All rights reserved
            </p>

            <div className="flex items-center gap-4">
              <span className="text-white font-semibold text-sm">
                Follow Us
              </span>
              <div className="flex items-center gap-3">
                {[
                  { icon: <FacebookIcon />, href: "#", label: "Facebook" },
                  { icon: <TwitterIcon />, href: "#", label: "Twitter" },
                  { icon: <InstagramIcon />, href: "#", label: "Instagram" },
                ].map(({ icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-white text-[#00462C] flex items-center justify-center hover:bg-white/90 hover:scale-110 transition-all duration-200"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      
    </footer>
  );
}