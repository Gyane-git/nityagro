"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { apiGetRequest } from "@/apihelper/apiHelper";

const DEFAULT_SLIDES = [
  { src: "/slider1.png", alt: "Slide 1" },
  { src: "/slider2.png", alt: "Slide 2" },
  { src: "/slider3.png", alt: "Slide 3" },
];

const CARD_HEIGHT = 250;
const CARD_RADIUS = 8;

export default function ImageSlider({ slides = DEFAULT_SLIDES, gap = 16 }) {
  const [dynamicSlides, setDynamicSlides] = useState(slides);

  useEffect(() => {
    const fetchCardBanners = async () => {
      try {
        const response = await apiGetRequest("/banners");
        const rows = Array.isArray(response?.data?.banners)
          ? response.data.banners
          : [];

        const activeRows = rows.filter((item) => item.isActive !== false);
        const picked = activeRows.length ? activeRows : rows;

        const mapped = picked
          .map((item, index) => ({
            src: item.cardImage,
            alt: item.bannerName || `Slide ${index + 1}`,
          }))
          .filter((item) => Boolean(item.src))
          .map((item) => ({
            ...item,
            src: /^https?:\/\//i.test(item.src)
              ? item.src
              : item.src.startsWith("/")
                ? item.src
                : `/${item.src}`,
          }));

        if (mapped.length > 0) {
          setDynamicSlides(mapped.slice(0, 3));
        } else {
          setDynamicSlides(slides.slice(0, 3));
        }
      } catch {
        setDynamicSlides(slides.slice(0, 3));
      }
    };

    fetchCardBanners();
  }, [slides]);

  const fixedSlides = (dynamicSlides.length ? dynamicSlides : slides).slice(0, 3);

  return (
    <div className="flex flex-col items-center gap-5 w-full px-2 sm:px-4">
      <div
        className="relative w-full overflow-hidden mt-10"
        style={{ height: CARD_HEIGHT }}
      >
        <div className="flex h-full" style={{ gap: `${gap}px` }}>
          {fixedSlides.map((slide, i) => (
            <div
              key={`${slide.src}-${i}`}
              className="flex-1 overflow-hidden"
              style={{
                height: CARD_HEIGHT,
                borderRadius: CARD_RADIUS,
                minWidth: 0,
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={slide.src}
                  alt={slide.alt || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={i < 3}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
