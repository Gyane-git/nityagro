"use client";

import { useState } from "react";
import Image from "next/image";

// ── Types ────────────────────────────────────────────────────────────────────
interface Review {
  id: number;
  title: string;
  rating: number; // out of 5
  body: string;
  name: string;
  timeAgo: string;
  image: string; // replace with StaticImageData when using next/image imports
}

// ── Data ─────────────────────────────────────────────────────────────────────
const reviews: Review[] = [
  {
    id: 1,
    title: "Very Healthy Products.",
    rating: 4,
    body: "I trust Nityagro because I know the owner is very picky about where they source their products and that they are very pure and clean products.",
    name: "Scott Wandana Matt",
    timeAgo: "2 days ago",
    image: "/c1.jpg", // ← replace with your image path
  },
  {
    id: 2,
    title: "Pure Aroma, Authentic Taste!",
    rating: 4,
    body: "I trust Nityagro because I know the owner is very picky about where they source their products and that they are very pure and clean products.",
    name: "Ankush S.",
    timeAgo: "3 days ago",
    image: "/c2.jpg", // ← replace with your image path
  },
  {
    id: 3,
    title: "Great Quality, Love It!",
    rating: 5,
    body: "Amazing products sourced directly from the farms. You can taste the difference compared to store-bought items. Highly recommend!",
    name: "Priya M.",
    timeAgo: "5 days ago",
    image: "/c3.jpg",
  },
  {
    id: 4,
    title: "Absolutely Authentic.",
    rating: 5,
    body: "The spices are so fresh and fragrant. I've been using Nityagro for months now and I couldn't be happier with the quality.",
    name: "Ramesh K.",
    timeAgo: "1 week ago",
    image: "/c4.jpg",
  },
];

// ── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Review Card ───────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-w-0 h-full">
      {/* Left: Customer Photo */}
      <div className="relative w-44 shrink-0">
        <Image
          width={176}
          height={176}
          src={review.image}
          alt={review.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/*
         * Once you have real images, swap the <img> above for:
         * <Image src={review.image} alt={review.name} fill className="object-cover" />
         */}
      </div>

      {/* Right: Content */}
      <div className="flex flex-col justify-between p-6 flex-1 gap-3">
        {/* Top: title + stars + body */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-gray-900 leading-snug">
            {review.title}
          </h3>
          <StarRating rating={review.rating} />
          <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
        </div>

        {/* Bottom: name + time */}
        <div>
          <p className="text-sm font-bold text-gray-900">{review.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{review.timeAgo}</p>
        </div>
      </div>
    </div>
  );
}

// ── Arrow Button ──────────────────────────────────────────────────────────────
function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous reviews" : "Next reviews"}
      className={`
        flex items-center justify-center w-10 h-10 rounded-full border border-gray-200
        bg-white shadow-sm transition-all shrink-0
        ${
          disabled
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-gray-50 hover:shadow-md cursor-pointer"
        }
      `}
    >
      <svg
        className="w-4 h-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        {direction === "left" ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function CustomerReviews() {
  const CARDS_PER_PAGE = 2;
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(reviews.length / CARDS_PER_PAGE);
  const visibleReviews = reviews.slice(
    page * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE + CARDS_PER_PAGE,
  );

  return (
    <section className="bg-white py-16 px-4 sm:px-8 lg:px-16">
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl font-bold text-[#1e5631] text-center mb-12">
        What Our Customers Say
      </h2>

      {/* Carousel Row */}
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        {/* Left Arrow */}
        <ArrowButton
          direction="left"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        />

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 min-h-55">
          {visibleReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Right Arrow */}
        <ArrowButton
          direction="right"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
        />
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            aria-label={`Go to page ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all ${
              i === page ? "bg-[#2d7a4f] w-4" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
