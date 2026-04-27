"use client";

import { useState } from "react";
import Image from "next/image";

/* Icons */
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const WishlistIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const GiftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="5" />
  </svg>
);

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Our Philosophy", href: "/philosophy" },
  { label: "Our Methods", href: "/methods", hasDropdown: true },
];

export default function Header() {
  const [methodsOpen, setMethodsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E6ECF0] bg-white">
      {/* top bar */}
      <div className="w-full bg-[#FFF8E7] h-10 px-8 flex items-center justify-between">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-[#00462C] font-medium">
            <GiftIcon />
            <span>
              <b>12% OFF</b> above - Code: <b>NEW12</b>
            </span>
          </div>
        ))}
      </div>

      {/* navbar */}
      <nav className="max-w-[1440px] mx-auto h-[71px] px-[32px] flex items-center justify-between">
        {/* left */}
        <div className="flex items-center gap-8">
          <a href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </a>

          <button className="h-[44px] px-4 flex items-center gap-2 rounded-md hover:bg-[#F5F8F6] transition">
            <GridIcon />
            <span className="text-sm font-medium text-[#00462C]">
              Browse All Categories
            </span>
            <ChevronDownIcon />
          </button>
        </div>

        {/* center */}
        <div className="hidden md:flex items-center gap-[40px]">
          {NAV_LINKS.map((link) => (
            <div key={link.label} className="relative">
              {link.hasDropdown ? (
                <button
                  onClick={() => setMethodsOpen(!methodsOpen)}
                  className="w-[57px] h-[28px] flex items-center gap-1 text-[15px] font-medium text-[#00462C]"
                >
                  {link.label}
                  <ChevronDownIcon />
                </button>
              ) : (
                <a
                  href={link.href}
                  className="h-[28px] flex items-center text-[15px] font-medium text-[#00462C] hover:opacity-70"
                >
                  {link.label}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* right */}
        <div className="flex items-center gap-5 text-[#00462C]">
          <button><SearchIcon /></button>
          <button><WishlistIcon /></button>
          <button><CartIcon /></button>

          <button className="flex items-center gap-2">
            <UserIcon />
            <span>Log in</span>
          </button>
        </div>
      </nav>
    </header>
  );
}