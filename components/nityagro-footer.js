"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MailIcon, PhoneIcon } from "lucide-react";

// ─── Social Icons ─────────────────────────────────────────────────────────────

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 2c.6 2.6 2.4 4.7 5 5v3c-2.2-.1-4.2-.9-5.8-2.2V16c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.3 0 .7 0 1 .1v3.2c-.3-.1-.6-.2-1-.2-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3V2h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// ─── Mobile Nav Icons ─────────────────────────────────────────────────────────

const HomeIcon = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M9 21V12h6v9"
      stroke={filled ? "white" : "currentColor"}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const ProductsIcon = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill={filled ? "currentColor" : "none"}
    />
    <line
      x1="3"
      y1="6"
      x2="21"
      y2="6"
      stroke={filled ? "white" : "currentColor"}
      strokeWidth="1.8"
    />
    <path
      d="M16 10a4 4 0 0 1-8 0"
      stroke={filled ? "white" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const WishlistIcon = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill={filled ? "currentColor" : "none"}
    />
  </svg>
);

const AccountIcon = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle
      cx="12"
      cy="7"
      r="4"
      stroke="currentColor"
      strokeWidth="1.8"
      fill={filled ? "currentColor" : "none"}
    />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const CUSTOMER_SUPPORT = [
  { label: "FAQs", href: "/faqs" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Return & Refund Policy", href: "/return-policy" },
];

const COMPANY = [
  { label: "About Nityagro", href: "/about" },
  
  { label: "Contact Us", href: "/contact-us" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const MOBILE_NAV = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Products", href: "/products", icon: ProductsIcon },
  { label: "Wishlist", href: "/wishlist", icon: WishlistIcon },
  { label: "Account", href: "/profile", icon: AccountIcon },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {/* ── DESKTOP FOOTER (md and above) ── */}
      <footer className="relative w-full overflow-hidden hidden md:block">
        <div className="relative w-full min-h-130 lg:min-h-167.5">
          <Image
            src="/footer-bg image.png"
            alt=""
            fill
            className="object-cover object-top"
            priority
          />

          <div className="absolute inset-0 flex items-end">
            <div className="w-full bg-transparent pt-32 lg:pt-48">
              <div className="mx-auto px-6 lg:px-8 max-w-305">
                <div className="mb-2 max-w-[1100px] h-[341px] p-5">
                  {/* Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10 pb-10 ">
                    {/* GET IN TOUCH */}
                    <div className="flex flex-col gap-5 max-w-85">
                      <h3
                        className="text-white text-[16] lg:text-xl font-medium leading-[24px]"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        GET IN TOUCH
                      </h3>
                      <p className="text-white text-xs leading-5 font-normal">
                        Join our network of trusted partners and bring
                        traditional, organic products to your community
                      </p>
                      <div className="flex flex-col gap-3 text-white text-sm font-normal">
                        <a
                          href="tel:+915400025124553"
                          className="flex items-center gap-3"
                        >
                          <PhoneIcon size={17} className="text-sm" />
                          <span className="text-xs">(+91)-540-025-124553</span>
                        </a>
                        <a
                          href="mailto:sale@nityagro.com"
                          className="flex items-center gap-3"
                        >
                          <MailIcon size={17} className="text-sm" />
                          <span className="text-xs">sale@nityagro.com</span>
                        </a>
                      </div>
                    </div>

                    {/* Customer Support */}
                    <div className="flex flex-col gap-5">
                      <h3
                        className="text-white text-[16] lg:text-xl font-medium leading-[24px]"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        Customer Support
                      </h3>
                      <div className="flex flex-col gap-4 text-white text-xs font-normal">
                        {CUSTOMER_SUPPORT.map((item) => (
                          <a key={item.label} href={item.href}>
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Company */}
                    <div className="flex flex-col gap-5">
                      <h3
                        className="text-white text-[16] lg:text-xl font-medium leading-[24px]"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        Company
                      </h3>
                      <div className="flex flex-col gap-4 text-white text-xs font-normal">
                        {COMPANY.map((item) => (
                          <a key={item.label} href={item.href}>
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Legal */}
                    <div className="flex flex-col gap-5">
                      <h3
                        className="text-white text-[16] lg:text-xl font-medium leading-[24px]"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        Legal
                      </h3>
                      <div className="flex flex-col gap-4 text-white text-xs font-normal">
                        {LEGAL.map((item) => (
                          <a key={item.label} href={item.href}>
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#E6ECF0]" />

                  {/* Bottom bar */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 text-white text-sm font-normal text-sm">
                    <p>©️ {new Date().getFullYear()}, Nityagro - All rights reserved</p>
                    <div className="flex items-center gap-4">
                      <span className="font-normal text-sm">Follow Us</span>
                      <div className="flex gap-3">
                        {[
                          {
                            icon: <FacebookIcon className="text-lg" />,
                            href: "#",
                            label: "Facebook",
                          },
                          {
                            icon: <TikTokIcon />,
                            href: "https://www.tiktok.com/@nityagro.np",
                            label: "TikTok",
                          },
                          {
                            icon: <InstagramIcon />,
                            href: "https://www.instagram.com/nityamagro.np",
                            label: "Instagram",
                          },
                        ].map(({ icon, href, label }) => (
                          <a
                            key={label}
                            href={href}
                            aria-label={label}
                            className="w-7 h-7 rounded-full p-2 bg-white text-[#00462C] flex items-center justify-center hover:scale-110 transition-all duration-200"
                          >
                            {icon}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="border-b border-[#E6ECF0]" />
                </div>

                <div className="border-t border-[#E6ECF0]" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ── MOBILE BOTTOM NAV BAR (below md) ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100"
        style={{
          boxShadow: "0 -2px 16px rgba(0,0,0,0.08)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {MOBILE_NAV.map(({ label, href, icon: Icon }) => {
            const isActive =
              isMounted &&
              (href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`));
            return (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-1 min-w-15 pt-1"
              >
                <span
                  className="transition-colors duration-200"
                  style={{ color: isActive ? "#00462C" : "#9CA3AF" }}
                >
                  <Icon filled={isActive} />
                </span>
                <span
                  className="font-medium transition-colors duration-200"
                  style={{
                    color: isActive ? "#00462C" : "#9CA3AF",
                    fontSize: "11px",
                    lineHeight: "16px",
                  }}
                >
                  {label}
                </span>
                {isActive && (
                  <span className="w-9 h-0.5 rounded-full bg-[#00462C]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer so page content isn't hidden behind the fixed mobile nav */}
      <div className="md:hidden h-16" />
    </>
  );
}
