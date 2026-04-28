"use client";

import Image from "next/image";
import { useState } from "react";

const PlayIcon = () => (
  <div
    className="w-9 h-9 rounded-full flex items-center justify-center"
    style={{ background: "rgba(255,255,255,0.85)" }}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#00462C">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  </div>
);

export default function ProductImageGallery({ images = [] }) {
  const [selected, setSelected] = useState(0);

  const fallback = [
    "/products/mustard-oil.png",
    "/products/red-chilli.png",
    "/products/chickpea-flour.png",
    "/products/jaggery.png",
    "/products/red-chilli-2.png",
  ];

  const imgs = images.length > 0 ? images : fallback;

  return (
    <div className="flex gap-3" style={{ width: "420px", flexShrink: 0 }}>
      {/* ── Thumbnail strip (left column) ── */}
      <div className="flex flex-col gap-2" style={{ width: "90px" }}>
        {imgs.map((src, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="relative overflow-hidden border-2 transition-all duration-200 flex-shrink-0"
            style={{
              width: "90px",
              height: "80px",
              borderRadius: "6px",
              borderColor: selected === i ? "#00462C" : "#E5E7EB",
              background: "#F9FAFB",
            }}
          >
            <Image
              src={src}
              alt={`Thumbnail ${i + 1}`}
              fill
              className="object-contain p-2"
              sizes="90px"
            />
            {/* Video play icon on 2nd thumbnail (like screenshot) */}
            {i === 1 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <PlayIcon />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* ── Main image ── */}
      <div
        className="relative flex-1 overflow-hidden border border-gray-200"
        style={{ height: "350px", borderRadius: "8px", background: "#F9FAFB" }}
      >
        <Image
          src={imgs[selected]}
          alt="Product main"
          fill
          className="object-contain p-6"
          sizes="310px"
          priority
        />
        {/* Sparkle / badge icon bottom right (like screenshot) */}
        <div className="absolute bottom-3 right-3 opacity-30">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#00462C">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
        </div>
      </div>
    </div>
  );
}