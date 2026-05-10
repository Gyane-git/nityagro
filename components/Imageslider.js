"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * ImageSlider — Responsive
 *
 * Mobile  (<640px):  1 card
 * Tablet  (640–1023px): 2 cards
 * Desktop (≥1024px): 3 cards
 */

const DEFAULT_SLIDES = [
  { src: "/slider1.png", alt: "Slide 1" },
  { src: "/slider2.png", alt: "Slide 2" },
  { src: "/slider3.png", alt: "Slide 3" },
  { src: "/slider1.png", alt: "Slide 4" },
  { src: "/slider3.png", alt: "Slide 5" },
];

function useVisibleCount() {
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 1024) setVisible(2);
      else setVisible(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return visible;
}

const CARD_HEIGHT = 213;
const CARD_RADIUS = 8;

export default function ImageSlider({
  slides = DEFAULT_SLIDES,
  interval = 3000,
  gap = 16,
  showDots = true,
  showArrows = true,
}) {
  const visibleCount = useVisibleCount();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timerRef = useRef(null);
  const total = slides.length;

  // Cloned list for infinite loop
  const cloned = [
    ...slides.slice(-visibleCount),
    ...slides,
    ...slides.slice(0, visibleCount),
  ];

  // Card width as percentage of track, accounting for gaps
  // e.g. 3 visible: each card = (100% - 2*gap) / 3
  const cardWidthPct = `calc((100% - ${
    gap * (visibleCount - 1)
  }px) / ${visibleCount})`;

  // Offset in percentage units: each step = 100%/visibleCount of the track
  const getOffsetPct = (idx) => {
    const stepsFromStart = visibleCount + idx;
    return -(stepsFromStart * (100 / visibleCount));
  };

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, interval);
  }, [interval]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  useEffect(() => {
    if (current === total) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(0);
      }, 400);
    } else if (current === -1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(total - 1);
      }, 400);
    } else {
      setIsTransitioning(true);
    }
  }, [current, total]);

  // Reset current index when visible count changes to avoid out-of-range
  useEffect(() => {
    setCurrent(0);
    setIsTransitioning(false);
  }, [visibleCount]);

  const prev = () => {
    setIsTransitioning(true);
    setCurrent((p) => p - 1);
    resetTimer();
  };

  const next = () => {
    setIsTransitioning(true);
    setCurrent((p) => p + 1);
    resetTimer();
  };

  const goTo = (idx) => {
    setIsTransitioning(true);
    setCurrent(idx);
    resetTimer();
  };

  const activeDot = ((current % total) + total) % total;

  return (
    <div className="flex flex-col items-center gap-5 w-full px-2 sm:px-4">
      {/* Track wrapper — full width, clips overflow */}
      <div
        className="relative w-full overflow-hidden mt-10"
        style={{ height: CARD_HEIGHT }}
      >
        {/* Sliding track */}
        <div
          className="flex h-full"
          style={{
            gap: `${gap}px`,
            // Each cloned card is cardWidthPct wide; offset by step count
            transform: `translateX(calc(${getOffsetPct(current)}% - ${
              // Adjust for gaps: each step also shifts by (gap * stepIndex / visibleCount)
              // We handle this by computing the full pixel offset for gaps separately
              ((visibleCount + current) * gap) / visibleCount
            }px))`,
            transition: isTransitioning
              ? "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
            willChange: "transform",
          }}
        >
          {cloned.map((slide, i) => (
            <div
              key={i}
              className="flex-shrink-0 overflow-hidden"
              style={{
                width: cardWidthPct,
                height: CARD_HEIGHT,
                borderRadius: CARD_RADIUS,
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={slide.src}
                  alt={slide.alt || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i < visibleCount * 2}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Arrow buttons */}
        {showArrows && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-110"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-110"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {showDots && total > visibleCount && (
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: activeDot === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: activeDot === i ? "#00462C" : "#D1D5DB",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const ChevronLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00462C"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00462C"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
