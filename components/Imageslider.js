"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * ImageSlider
 *
 * Shows 3 cards at a time, auto-slides every `interval` ms.
 * Each card: width 442px · height 213px · border-radius 8px · image only.
 *
 * Props:
 *  - slides       {Array}   Array of { src, alt } objects
 *  - interval     {number}  Auto-slide interval in ms  (default: 3000)
 *  - gap          {number}  Gap between cards in px    (default: 24)
 *  - showDots     {boolean} Show dot indicators        (default: true)
 *  - showArrows   {boolean} Show prev/next arrows      (default: true)
 */

const CARD_WIDTH = 500;
const CARD_HEIGHT = 230;
const CARD_RADIUS = 8;

const DEFAULT_SLIDES = [
  { src: "/slider1.png", alt: "Slide 1" },
  { src: "/slider2.png", alt: "Slide 2" },
  { src: "/slider3.png", alt: "Slide 3" },
  { src: "/slider1.png", alt: "Slide 4" },
  { src: "/slider3.png", alt: "Slide 5" },
];


export default function ImageSlider({
  slides = DEFAULT_SLIDES,
  interval = 3000,
  gap = 24,
  showDots = true,
  showArrows = true,
}) {
  const VISIBLE = 3;
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timerRef = useRef(null);
  const total = slides.length;

  // Cloned list for infinite feel: [...last, ...all, ...first]
  const cloned = [
    ...slides.slice(-VISIBLE),
    ...slides,
    ...slides.slice(0, VISIBLE),
  ];

  const trackWidth = CARD_WIDTH * VISIBLE + gap * (VISIBLE - 1);
  // Offset: skip the cloned prefix (VISIBLE cards)
  const getOffset = (idx) =>
    -(VISIBLE * (CARD_WIDTH + gap)) - idx * (CARD_WIDTH + gap);

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

  // Infinite loop: when we hit the cloned boundary, jump silently
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
    <div className="flex flex-col items-center gap-5 w-full ">
      {/* ── Slider track wrapper ── */}
      <div
        className="relative overflow-hidden top-10"
        style={{ width: trackWidth, height: CARD_HEIGHT }}
      >
        {/* Track */}
        <div
          className="flex"
          style={{
            gap: `${gap}px`,
            transform: `translateX(${getOffset(current)}px)`,
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
                width: CARD_WIDTH,
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
                  sizes={`${CARD_WIDTH}px`}
                  priority={i < VISIBLE * 2}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Arrow buttons ── */}
        {showArrows && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-110"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-110"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>

      {/* ── Dot indicators ── */}
      {showDots && total > VISIBLE && (
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

// Icons
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00462C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00462C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);