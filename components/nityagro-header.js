"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";
import { useAuthModal } from "@/app/account/useAuthModal";
import AuthModals from "@/app/account/AuthModals";

/* ── Icons ── */
const SearchIcon = () => (
  <Link href="/search">
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  </Link>
);

const WishlistIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CartIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GridIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Nav links ── */
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Our Philosophy", href: "/philosophy" },
  {
    label: "Our Methods",
    hasDropdown: true,
    childLinks: [
      { label: "Wood Pressed", slug: "wood-pressed" },
      { label: "Cold Pressed", slug: "cold-pressed" },
      { label: "Stone Pressed", slug: "stone-pressed" },
    ],
  },
];

export default function Header() {
  const [methodsOpen, setMethodsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const auth = useAuthModal();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + Number(item.qty || 1), 0);
  const wishlistCount = wishlistItems.length;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ── Promo bar ── */}
      <div className="w-full bg-[#FFF8E7] border-b border-[#f0e6c8] h-10 px-8 flex items-center justify-between">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-[13px] text-[#1a1a1a] font-medium"
          >
            {/* Red gift box emoji matching screenshot */}
            <span className="text-[15px]">🎁</span>
            <span>
              12% OFF above - Code: <span className="font-semibold">NEW12</span>
            </span>
          </div>
        ))}
      </div>

      {/* ── Main navbar ── */}
      <nav className="w-full bg-white border-b border-[#E6ECF0]">
        <div className="max-w-360 mx-auto h-17.75 px-8 flex items-center justify-between gap-6">
          {/* ── Left: Logo + Browse ── */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Nityagro"
                width={120}
                height={44}
                className="object-contain"
              />
            </Link>

            {/* Browse All Categories */}
            <div className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="h-10 px-3 flex items-center gap-2 rounded-md hover:bg-[#F5F8F6] transition text-[#1a1a1a]"
              >
                <GridIcon />
                <span className="text-[14px] font-medium whitespace-nowrap">
                  Browse All Categories
                </span>
                <ChevronDownIcon />
              </button>

              {categoryOpen && (
                <div className="absolute top-full left-0 mt-1 w-55 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                  {[
                    "Oils",
                    "Flours",
                    "Spices",
                    "Jaggery",
                    "Dairy",
                    "Sattu",
                  ].map((item) => (
                    <a
                      key={item}
                      href={`/category/${item.toLowerCase()}`}
                      className="block px-5 py-3 text-[13px] text-[#00462C] hover:bg-[#F5F8F6] transition"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Center: Nav links ── */}
          <div className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative">
                {link.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setMethodsOpen(!methodsOpen)}
                      className="flex items-center gap-1 text-[15px] font-medium text-[#1a1a1a] hover:text-[#00462C] transition-colors"
                    >
                      {link.label}
                      <ChevronDownIcon />
                    </button>
                    {methodsOpen && (
                      <div className="absolute top-full left-0 mt-2 w-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                        {link.childLinks.map((child) => (
                          <Link
                            key={child.label}
                            href={`/methods/${child.slug}`}
                            onClick={() => setMethodsOpen(false)}
                            className="block px-5 py-3 text-[13px] text-[#00462C] hover:bg-[#F5F8F6] transition"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={link.href}
                    className="text-[15px] font-medium text-[#1a1a1a] hover:text-[#00462C] transition-colors"
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* ── Right: Icons ── */}
          <div className="flex items-center gap-5 text-[#1a1a1a] shrink-0">
            {/* Search */}
            <button className="hover:text-[#00462C] transition-colors">
              <SearchIcon />
            </button>

            {/* Wishlist with badge */}
            <Link href="/wishlist" className="relative hover:text-[#00462C] transition-colors">
              <WishlistIcon />
              <span
                className="absolute -top-1.75 -right-1.75 min-w-4.25 h-4.25 px-0.75
                           bg-[#00462C] text-white text-[10px] font-bold rounded-full
                           flex items-center justify-center leading-none"
              >
                {wishlistCount}
              </span>
            </Link>

            {/* Cart with badge */}
            <Link href="/cart" className="relative hover:text-[#00462C] transition-colors">
              <CartIcon />
              <span
                className="absolute -top-1.75 -right-1.75 min-w-4.25 h-4.25 px-0.75
                           bg-[#00462C] text-white text-[10px] font-bold rounded-full
                           flex items-center justify-center leading-none"
              >
                {cartCount}
              </span>
            </Link>

            {/* Log in */}
            <button
              className="flex items-center gap-2 text-[15px] font-medium hover:text-[#00462C] transition-colors"
              onClick={auth.openLogin}
            >
              <UserIcon />
              <span>Log in</span>
            </button>
          </div>
        </div>
      </nav>
      <AuthModals auth={auth} />
    </header>
  );
}
