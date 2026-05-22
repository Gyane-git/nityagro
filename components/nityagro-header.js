"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";
import { useAuthModal } from "@/app/account/useAuthModal";
import AuthModals from "@/app/account/AuthModals";
import { apiGetRequest } from "@/apihelper/apiHelper";
import toast from "react-hot-toast";

/* ── Icons ── */
const SearchIcon = () => (
  <Link href="/search">
    <svg
      width="14"
      height="14"
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
    width="14"
    height="14"
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
    width="14"
    height="14"
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
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GridIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <rect x="3" y="3" width="7" height="7" rx="3" />
    <rect x="13" y="3" width="7" height="7" rx="3" />
    <rect x="13" y="13" width="7" height="7" rx="3" />
    <rect x="3" y="13" width="7" height="7" rx="3" />
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

const MenuIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
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

/* ── Badge ── */
const Badge = ({ count }) => (
  <span
    className="absolute -top-2 -right-2 min-w-3.5 h-3.5 px-0.5
               bg-[#00462C] text-white text-[8px] font-bold rounded-full
               flex items-center justify-center leading-none"
  >
    {count}
  </span>
);

export default function Header() {
  const [methodsOpen, setMethodsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMethodsOpen, setMobileMethodsOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [promoMessages, setPromoMessages] = useState([
    "12% OFF above · Code: NEW12",
  ]);
  const [promoIndex, setPromoIndex] = useState(0);
  const [authUser, setAuthUser] = useState(null);

  const auth = useAuthModal();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const setCartUser = useCartStore((state) => state.setCartUser);
  const setCartItems = useCartStore((state) => state.setCartItems);
  const clearAllCartState = useCartStore((state) => state.clearAllCartState);
  const wishlistItems = useWishlistStore((state) => state.items);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const setWishlistUser = useWishlistStore((state) => state.setWishlistUser);
  const setWishlistItems = useWishlistStore((state) => state.setWishlistItems);
  const clearAllWishlistState = useWishlistStore((state) => state.clearAllWishlistState);
  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item.qty || 1),
    0,
  );
  const wishlistCount = wishlistItems.length;
  const isLoggedIn = Boolean(authUser?.userId);
  const accountHref = "/profile";

  const categoryRef = useRef(null);
  const methodsRef = useRef(null);

  const clearAuthState = () => {
    setAuthUser(null);
    clearAllCartState();
    clearAllWishlistState();
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("admin_token");
    window.localStorage.removeItem("admin_auth");
    window.localStorage.removeItem("auth_user");
    window.localStorage.removeItem("userId");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Local cleanup below is the source of truth for the browser state.
    }

    clearAuthState();
    setMobileMenuOpen(false);
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
      if (methodsRef.current && !methodsRef.current.contains(e.target)) {
        setMethodsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiGetRequest("/categories");
      const rows = Array.isArray(response?.data) ? response.data : [];
      const active = rows.filter((item) => item.categoryStatus !== false);
      setCategories(active);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const loadAuthUser = async () => {
      try {
        const cachedUser = window.localStorage.getItem("auth_user");
        if (cachedUser) {
          setAuthUser(JSON.parse(cachedUser));
        }
      } catch {
        window.localStorage.removeItem("auth_user");
      }

      try {
        const token = window.localStorage.getItem("token");
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const payload = await response.json();

        if (!response.ok || !payload?.success || !payload?.data?.userId) {
          clearAuthState();
          return;
        }

        const nextUser = payload.data;
        setAuthUser(nextUser);
        setCartUser(nextUser.userId);
        setWishlistUser(nextUser.userId);
        window.localStorage.setItem("auth_user", JSON.stringify(nextUser));
        window.localStorage.setItem("userId", nextUser.userId);

        const authHeaders = {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const [cartResponse, wishlistResponse] = await Promise.all([
          fetch("/api/account/cart", {
            headers: authHeaders,
            credentials: "include",
          }).then((res) => res.json()).catch(() => null),
          fetch("/api/account/wishlist", {
            headers: authHeaders,
            credentials: "include",
          }).then((res) => res.json()).catch(() => null),
        ]);

        if (cartResponse?.success) {
          setCartItems(cartResponse.data || []);
        }
        if (wishlistResponse?.success) {
          setWishlistItems(wishlistResponse.data || []);
        }
      } catch {
        setAuthUser(null);
      }
    };

    loadAuthUser();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "1") {
      auth.openLogin();
    }
  }, []);

  useEffect(() => {
    const fetchPopupPromo = async () => {
      try {
        const response = await apiGetRequest("/popup-ads");
        const rows = Array.isArray(response?.data?.popupAds)
          ? response.data.popupAds
          : [];
        const activeRows = rows.filter((item) => item.isActive !== false);
        const messages = (activeRows.length ? activeRows : rows)
          .map((item) => item.popupDescription || item.title || "")
          .map((item) => String(item).trim())
          .filter(Boolean);

        if (messages.length > 0) {
          setPromoMessages(messages);
          setPromoIndex(0);
        }
      } catch {
        // keep fallback promo text
      }
    };
    fetchPopupPromo();
  }, []);

  useEffect(() => {
    if (promoMessages.length <= 1) return;

    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [promoMessages]);

  const promoText = promoMessages[promoIndex] || "12% OFF above · Code: NEW12";

  return (
    <header
      className="sticky top-0 z-50 w-full h-24 left-0 right-0"
      style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
    >
      {/* ── Promo bar ── */}
      <div
        className="w-full bg-[#FFF8E7] border-b border-[#f0e6c8] h-9 overflow-hidden"
        style={{ width: "100%", boxSizing: "border-box" }}
      >
        {/* Mobile: single centered item */}
        <div className="flex md:hidden items-center justify-center h-full px-4 text-[12px] text-[#1a1a1a] font-medium gap-1.5">
          <span className="text-[14px]">🎁</span>
          <span>{promoText}</span>
        </div>
        {/* Desktop: four items */}
        <div className="hidden md:flex items-center justify-between h-full px-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-[13px] text-[#1a1a1a] font-medium"
            >
              <span className="text-[15px]">🎁</span>
              <span>{promoText}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main navbar ── */}
      <nav
        className="w-full bg-white"
        style={{ width: "100%", boxSizing: "border-box" }}
      >
        <div className="w-full max-w-360 mx-auto h-14 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* ── Left: Logo + Browse ── */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 lg:gap-6 shrink-0 ">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Nityagro"
                  width={110}
                  height={40}
                  className="object-contain w-22.5 sm:w-27.5"
                />
              </Link>

              {/* Browse All Categories — hidden on mobile */}
              <div className="relative hidden sm:block" ref={categoryRef}>
                <button
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="h-10 px-2.5 lg:px-3 flex items-center gap-1.5 lg:gap-2 rounded-md hover:bg-[#F5F8F6] transition text-[#1a1a1a]"
                >
                  <GridIcon className="w-4 h-4 text-[#266A3F] font-semibold " />
                  <span className="hidden lg:inline text-[10px] text-[#266A3F] font-semibold whitespace-nowrap">
                    Browse All Categories
                  </span>
                  <span className="hidden md:inline lg:hidden text-[12px] font-semibold whitespace-nowrap">
                    Categories
                  </span>
                  <ChevronDownIcon />
                </button>

                <div
                  className={`absolute top-full left-0 mt-1 w-45 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50
                   transform origin-top transition-all duration-200 ease-out
                   ${
                     categoryOpen
                       ? "opacity-100 scale-100 pointer-events-auto"
                       : "opacity-0 scale-95 pointer-events-none"
                   }`}
                >
                  {categories.map((item) => (
                    <Link
                      key={item.categoryId || item.categoryName}
                      href={`/products?category=${encodeURIComponent(
                        item.categoryName,
                      )}`}
                      onClick={() => setCategoryOpen(false)}
                      className="block px-5 py-3 text-[13px] text-[#00462C] hover:bg-[#F5F8F6] transition "
                    >
                      {item.categoryName}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Center: Nav links (desktop only) ── */}
            <div className="hidden lg:flex items-center gap-7 xl:gap-9">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className="relative flex items-center"
                  ref={link.hasDropdown ? methodsRef : undefined}
                >
                  {link.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setMethodsOpen(!methodsOpen)}
                        className="flex items-center gap-1 text-[12px] font-semibold text-[#2D333A] hover:text-[#00462C] transition-colors"
                      >
                        {link.label}
                        <ChevronDownIcon />
                      </button>

                      <div
                        className={`absolute top-full left-0 mt-2 w-30 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50
                         origin-top transform-gpu transition-all duration-200 ease-out
                         ${
                           methodsOpen
                             ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
                             : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                         }`}
                      >
                        {link.childLinks.map((child) => (
                          <Link
                            key={child.label}
                            href={`/methods/${child.slug}`}
                            onClick={() => setMethodsOpen(false)}
                            className="block px-5 py-3 text-[11px] text-[#00462C] hover:bg-[#F5F8F6] transition border-b border-gray-300 last:border-b-0"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <a
                      href={link.href}
                      className="text-[12px] font-semibold text-[#2D333A] hover:text-[#00462C] transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Icons ── */}
          <div>
            <div className="flex items-center gap-4 sm:gap-5 text-[#1a1a1a] shrink-0">
              <button className="hover:text-[#00462C] transition-colors">
                <SearchIcon className="text-[#266A3F]" />
              </button>

              {isLoggedIn ? (
                <>
                  <Link
                    href="/wishlist"
                    className="relative hover:text-[#00462C] transition-colors"
                    aria-label="Wishlist"
                  >
                    <WishlistIcon />
                    <Badge count={wishlistCount} />
                  </Link>

                  <Link
                    href="/cart"
                    className="relative hover:text-[#00462C] transition-colors"
                    aria-label="Cart"
                  >
                    <CartIcon className="text-[#266A3F]" />
                    <Badge count={cartCount} />
                  </Link>

                  <Link
                    href={accountHref}
                    className="flex items-center gap-1.5 text-[15px] font-medium hover:text-[#00462C] transition-colors"
                    title={authUser?.name || "My Account"}
                  >
                    <UserIcon />
                    <span className="hidden sm:inline max-w-28 truncate text-sm">
                      {authUser?.name || "Account"}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="hidden sm:inline-flex text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="flex items-center gap-1.5 text-[15px] font-medium hover:text-[#00462C] transition-colors"
                  onClick={auth.openLogin}
                >
                  <UserIcon />
                  <span className="hidden sm:inline text-sm">Log in</span>
                </button>
              )}

              {/* Hamburger — mobile/tablet only */}
              <button
                className="lg:hidden hover:text-[#00462C] transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer overlay ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div
        className={`
          fixed top-0 left-0 h-full w-75 max-w-[85vw] bg-white z-50
          shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-17.75 border-b border-[#E6ECF0]">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <Image src="/logo.png" alt="Nityagro" width={124} height={63} />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-[#1a1a1a] hover:text-[#00462C] transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Browse Categories (mobile) */}
          <div className="px-5 mb-1">
            <button
              onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
              className="w-full flex items-center justify-between py-3 text-[15px] font-semibold text-[#1a1a1a]"
            >
              <span className="flex items-center gap-2">
                <GridIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#266A3F]" />
                Browse Categories
              </span>
              <span
                className={`transition-transform duration-200 ${
                  mobileCategoryOpen ? "rotate-180" : ""
                }`}
              >
                <ChevronDownIcon />
              </span>
            </button>
            {mobileCategoryOpen && (
              <div className="pl-7 pb-2 flex flex-col gap-0.5">
                {categories.map((item) => (
                  <Link
                    key={item.categoryId || item.categoryName}
                    href={`/products?category=${encodeURIComponent(
                      item.categoryName,
                    )}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-[14px] text-[#00462C] hover:font-medium transition"
                  >
                    {item.categoryName}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="mx-5 h-px bg-[#E6ECF0] my-1" />

          {/* Nav links (mobile) */}
          {NAV_LINKS.map((link) => (
            <div key={link.label} className="px-5 ">
              {link.hasDropdown ? (
                <>
                  <button
                    onClick={() => setMobileMethodsOpen(!mobileMethodsOpen)}
                    className="w-full flex items-center justify-between py-3 text-[15px] font-medium text-[#1a1a1a]"
                  >
                    {link.label}
                    <span
                      className={`transition-transform duration-200 ${
                        mobileMethodsOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDownIcon />
                    </span>
                  </button>
                  <div
                    className={`pl-4 flex flex-col gap-0.5 overflow-hidden
                    transition-[max-height,opacity] duration-300 ease-in-out
                    ${
                      mobileMethodsOpen
                        ? "max-h-60 opacity-100 pb-2"
                        : "max-h-0 opacity-0 pb-0 pointer-events-none"
                    }`}
                  >
                    {link.childLinks.map((child) => (
                      <Link
                        key={child.label}
                        href={`/methods/${child.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 text-[14px] text-[#00462C] hover:font-medium transition"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <a
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-[15px] font-medium text-[#1a1a1a] hover:text-[#462000] transition-colors"
                >
                  {link.label}
                </a>
              )}
            </div>
          ))}

          <div className="mx-5 h-px bg-[#E6ECF0] my-1" />

          <div className="px-5">
            {isLoggedIn ? (
              <div className="space-y-1">
                <Link
                  href={accountHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 py-3 text-[15px] font-medium text-[#266A3F] hover:text-[#00462C] transition-colors"
                >
                  <UserIcon className="text-[#266A3F]" />
                  {authUser?.name || "My Account"}
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 py-3 text-[15px] font-medium text-[#266A3F] hover:text-[#00462C] transition-colors"
                >
                  <WishlistIcon />
                  Wishlist ({wishlistCount})
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 py-3 text-[15px] font-medium text-[#266A3F] hover:text-[#00462C] transition-colors"
                >
                  <CartIcon />
                  Cart ({cartCount})
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 py-3 text-[15px] font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  auth.openLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 py-3 text-[15px] font-medium text-[#266A3F] hover:text-[#00462C] transition-colors"
              >
                <UserIcon className="text-[#266A3F]" />
                Log in
              </button>
            )}
          </div>
        </div>

        {/* Drawer footer */}
        <div className="px-5 py-4 border-t border-[#E6ECF0] bg-[#FFF8E7]">
          <p className="text-[12px] text-[#1a1a1a] font-medium text-center">
            🎁 12% OFF above · Code:{" "}
            <span className="font-semibold">NEW12</span>
          </p>
        </div>
      </div>

      <AuthModals auth={auth} />
    </header>
  );
}
