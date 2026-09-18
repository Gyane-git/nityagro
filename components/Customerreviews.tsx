"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────
interface Review {
  id: number;
  title: string;
  rating: number;
  body: string;
  name: string;
  timeAgo: string;
  image: string;
  socialVideoUrl?: string;
}

function getVideoEmbedUrl(value: string) {
  const text = String(value || "").trim();
  const srcMatch = text.match(/src=["']([^"']+)["']/i);
  const raw = srcMatch?.[1] || text;
  try {
    const url = new URL(raw);
    if (url.hostname.includes("instagram.com")) {
      if (!url.pathname.endsWith("/embed/")) url.pathname = `${url.pathname.replace(/\/$/, "")}/embed/`;
      return url.toString();
    }
    if (url.hostname.includes("facebook.com") || url.hostname.includes("fb.watch")) {
      if (url.pathname.startsWith("/plugins/video.php")) return url.toString();
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.toString())}&show_text=false`;
    }
    return url.toString();
  } catch {
    return "";
  }
}

// ── Data ──────────────────────────────────────────────────────────────
const reviews: Review[] = [
  {
    id: 1,
    title: "Very Healthy Products.",
    rating: 4,
    body: "I trust Nityagro because I know the owner is very picky about where they source their products and that they are very pure and clean products.",
    name: "Scott Wandana Matt",
    timeAgo: "2 days ago",
    image: "/c1.jpg",
  },
  {
    id: 2,
    title: "Pure Aroma, Authentic Taste!",
    rating: 4,
    body: "I trust Nityagro because I know the owner is very picky about where they source their products and that they are very pure and clean products.",
    name: "Ankush S.",
    timeAgo: "3 days ago",
    image: "/c2.jpg",
  },
  {
    id: 3,
    title: "Great Quality, Love It!",
    rating: 5,
    body: "Amazing products sourced directly from the farms. You can taste the difference compared to store-bought items.",
    name: "Priya M.",
    timeAgo: "5 days ago",
    image: "/c1.jpg",
  },
  {
    id: 4,
    title: "Absolutely Authentic.",
    rating: 5,
    body: "The spices are so fresh and fragrant. I've been using Nityagro for months now.",
    name: "Ramesh K.",
    timeAgo: "1 week ago",
    image: "/c2.jpg",
  },
];

// ── Star Rating ───────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 sm:w-5 h-4 sm:h-5 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Review Card ───────────────────────────────────────────────────────
function ReviewCard({ review, onWatchVideo, onReadMore }: { review: Review; onWatchVideo: (url: string) => void; onReadMore: (body: string) => void }) {
  return (
    <div className="flex min-h-[270px] w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md sm:flex-row">
      {/* Image */}
      <div className="relative h-52 w-full shrink-0 overflow-hidden sm:h-auto sm:w-44">
        <Image
          src={review.image}
          alt={review.name}
          fill
          className="object-cover"
          unoptimized={review.image.startsWith("/uploads/")}
        />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-5 sm:p-6">
        <div className="space-y-2.5">
          <h3 className="text-base font-bold text-gray-900">{review.title}</h3>

          <StarRating rating={review.rating} />

          <p className="min-h-[96px] text-sm leading-6 text-gray-600 line-clamp-4">{review.body}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
            {review.body.length > 180 && (
              <button type="button" className="font-semibold text-[#235A49] hover:underline" onClick={() => onReadMore(review.body)}>
                Read more
              </button>
            )}
            {review.socialVideoUrl && (
              <button type="button" className="inline-flex items-center gap-2 rounded-full bg-[#235A49] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#174536]" onClick={() => onWatchVideo(review.socialVideoUrl || "")}>
                <span aria-hidden="true">▶</span> Watch video
              </button>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold">{review.name}</p>
          <p className="text-xs text-gray-400">{review.timeAgo}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────
export default function CustomerReviews() {
  const CARDS_PER_PAGE = 2;
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Review[]>(reviews);
  const [videoUrl, setVideoUrl] = useState("");
  const [reviewText, setReviewText] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch("/api/testimonials", {
          cache: "no-store",
        });
        const payload = await response.json();
        const rows = Array.isArray(payload) ? payload : payload?.data || [];
        const activeRows = rows.filter((item: any) => item.isActive !== false);
        if (!activeRows.length) return;

        setItems(
          activeRows.map((item: any) => ({
            id: Number(item.id || item.testimonialsId || 0),
            title: item.title || "Customer Review",
            rating: Number(item.rating || item.starRating || 5),
            body: item.description || item.message || "",
            name: item.name || item.userName || "Customer",
            timeAgo:
              item.destination || item.designation || "Verified customer",
            image: item.image || item.profile_image || "/c1.jpg",
            socialVideoUrl: item.socialVideoUrl || item.videoUrl || "",
          })),
        );
        setPage(0);
      } catch {
        // Static reviews remain as graceful fallback.
      }
    };

    loadReviews();
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / CARDS_PER_PAGE));

  const visible = items.slice(
    page * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE + CARDS_PER_PAGE,
  );

  const resetAutoSlide = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (totalPages <= 1) return;
    timerRef.current = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 4000);
  }, [totalPages]);

  useEffect(() => {
    resetAutoSlide();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetAutoSlide]);

  return (
    <section className="bg-white py-2 sm:py-8 px-4 sm:px-8 lg:px-16">
      {/* Heading */}
      <h1
        className="text-center text-xl sm:text-2xl lg:text-3xl font-bold text-[#235A49] mb-10"
        style={{ fontFamily: "Roboto Slab" }}
      >
        What Our Customers Say
      </h1>

      {/* Layout */}
      <div className="max-w-6xl mx-auto flex items-center gap-3 sm:gap-4">
        {/* Left Button (hidden on mobile) */}
        <button
          className="hidden sm:flex w-10 h-10 items-center justify-center border rounded-full"
          onClick={() => {
            setPage((p) => (p - 1 + totalPages) % totalPages);
            resetAutoSlide();
          }}
        >
          ←
        </button>

        {/* Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {visible.map((r) => (
            <ReviewCard key={r.id} review={r} onWatchVideo={setVideoUrl} onReadMore={setReviewText} />
          ))}
        </div>

        {/* Right Button (hidden on mobile) */}
        <button
          className="hidden sm:flex w-10 h-10 items-center justify-center border rounded-full"
          onClick={() => {
            setPage((p) => (p + 1) % totalPages);
            resetAutoSlide();
          }}
        >
          →
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setPage(i);
              resetAutoSlide();
            }}
            className={`h-2 rounded-full transition-all ${
              i === page ? "w-4 bg-[#2d7a4f]" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

      {videoUrl && getVideoEmbedUrl(videoUrl) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setVideoUrl("")}>
          <div className="relative max-h-[88vh] w-[min(92vw,420px)] overflow-hidden rounded-2xl bg-black shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between bg-[#173d31] px-4 py-3 text-sm font-semibold text-white">
              <span>Customer testimonial</span>
              <button type="button" onClick={() => setVideoUrl("")} className="rounded-full px-2 text-xl leading-none hover:bg-white/15" aria-label="Close video">×</button>
            </div>
            <div className="aspect-[9/16] max-h-[calc(88vh-52px)] w-full">
              <iframe src={getVideoEmbedUrl(videoUrl)} title="Testimonial video" className="h-full w-full border-0 object-contain" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen />
            </div>
          </div>
        </div>
      )}

      {reviewText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setReviewText("")}>
          <div className="max-w-lg rounded-2xl bg-white p-6" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setReviewText("")} className="float-right text-xl">×</button>
            <p className="pr-6 text-sm leading-7 text-gray-700">{reviewText}</p>
          </div>
        </div>
      )}
    </section>
  );
}
