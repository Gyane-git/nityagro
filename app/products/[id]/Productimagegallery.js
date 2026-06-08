"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const PlayIcon = () => (
  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.85)" }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#00462C">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  </div>
);

export default function ProductImageGallery({ images = [] }) {
  const [selected, setSelected] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [failedImages, setFailedImages] = useState({});

  const fallback = ["/products/mustard-oil.png", "/products/red-chilli.png", "/products/chickpea-flour.png", "/products/jaggery.png", "/products/red-chilli-2.png"];

  const imgs = images.length > 0 ? images : fallback;
  const selectedImageUrl = imgs[selected] || imgs[0];
  const displayImageUrl = failedImages[selectedImageUrl] ? "/no-image.png" : selectedImageUrl;

  const markImageFailed = (src) => {
    if (!src || src === "/no-image.png") return;
    setFailedImages((prev) => ({ ...prev, [src]: true }));
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (zoomActive) {
      document.body.classList.add("product-zoom-active");
    } else {
      document.body.classList.remove("product-zoom-active");
    }
    return () => {
      document.body.classList.remove("product-zoom-active");
    };
  }, [zoomActive]);

  return (
    // <div className="relative flex gap-3" style={{ width: "420px", flexShrink: 0, overflow: "visible" }}>
    //   {/* ── Thumbnail strip (left column) ── */}
    //   <div className="flex flex-col gap-2" style={{ width: "90px" }}>
    //     {imgs.map((src, i) => (
    //       <button
    //         key={i}
    //         onClick={() => setSelected(i)}
    //         className="relative overflow-hidden border-2 transition-all duration-200 flex-shrink-0"
    //         style={{
    //           width: "90px",
    //           height: "80px",
    //           borderRadius: "6px",
    //           borderColor: selected === i ? "#00462C" : "#E5E7EB",
    //           background: "#F9FAFB",
    //         }}
    //       >
    //         <Image src={src} alt={`Thumbnail ${i + 1}`} fill className="object-contain p-2" sizes="90px" />
    //         {/* Video play icon on 2nd thumbnail (like screenshot) */}
    //         {i === 1 && (
    //           <div className="absolute inset-0 flex items-center justify-center bg-black/20">
    //             <PlayIcon />
    //           </div>
    //         )}
    //       </button>
    //     ))}
    //   </div>

    //   {/* ── Main image ── */}
    //   <div
    //     className="relative flex-1 overflow-hidden border border-gray-200"
    //     style={{ height: "350px", borderRadius: "8px", background: "#F9FAFB" }}
    //     onMouseEnter={() => setZoomActive(true)}
    //     onMouseLeave={() => setZoomActive(false)}
    //     onMouseMove={(e) => {
    //       const rect = e.currentTarget.getBoundingClientRect();
    //       const x = ((e.clientX - rect.left) / rect.width) * 100;
    //       const y = ((e.clientY - rect.top) / rect.height) * 100;
    //       setZoomPosition({
    //         x: Math.max(0, Math.min(100, x)),
    //         y: Math.max(0, Math.min(100, y)),
    //       });
    //     }}
    //   >
    //     <Image src={selectedImageUrl} alt="Product main" fill className={`object-contain p-6 transition-transform duration-500 ${zoomActive ? "scale-110" : "scale-100"}`} sizes="310px" priority />

    //     {zoomActive && (
    //       <div
    //         className="hidden lg:block absolute w-20 h-20 border-2 border-orange-500/70 bg-white/20 pointer-events-none"
    //         style={{
    //           left: `calc(${zoomPosition.x}% - 56px)`,
    //           top: `calc(${zoomPosition.y}% - 56px)`,
    //         }}
    //       />
    //     )}

    //     {/* Sparkle / badge icon bottom right (like screenshot) */}
    //     <div className="absolute bottom-3 right-3 opacity-30">
    //       <svg width="20" height="20" viewBox="0 0 24 24" fill="#00462C">
    //         <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    //       </svg>
    //     </div>
    //   </div>

    //   {zoomActive && (
    //     <div
    //       className="hidden lg:block absolute top-0 left-[calc(100%+24px)] w-[500px] h-[320px] border border-orange-300 rounded-lg bg-white shadow-lg pointer-events-none z-40"
    //       style={{
    //         backgroundImage: `url(${selectedImageUrl})`,
    //         backgroundRepeat: "no-repeat",
    //         backgroundSize: "140%",
    //         backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
    //       }}
    //     />
    //   )}
    //   <style jsx global>{`
    //     body.product-zoom-active .product-info-panel {
    //       opacity: 0.1;
    //       filter: blur(1px);
    //       pointer-events: none;
    //       user-select: none;
    //       transition: opacity 0.2s ease, filter 0.2s ease;
    //     }
    //   `}</style>
    // </div>
  <div className="relative w-full lg:w-[420px] lg:flex-shrink-0" style={{ overflow: "visible" }}>
      <div className="flex gap-3">
        {/* ── Thumbnail strip — vertical on lg+, hidden below ── */}
        <div className="hidden lg:flex flex-col gap-2 flex-shrink-0" style={{ width: "90px" }}>
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
              <Image src={failedImages[src] ? "/no-image.png" : src} alt={`Thumbnail ${i + 1}`} fill className="object-contain p-2" sizes="90px" onError={() => markImageFailed(src)} />
              {i === 1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <PlayIcon />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* main image  */}
        <div
          className="relative w-full lg:flex-1 overflow-hidden border border-gray-200"
          style={{ height: "clamp(260px, 48vw, 350px)", borderRadius: "8px", background: "#F9FAFB" }}
          onMouseEnter={() => setZoomActive(true)}
          onMouseLeave={() => setZoomActive(false)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomPosition({
              x: Math.max(0, Math.min(100, x)),
              y: Math.max(0, Math.min(100, y)),
            });
          }}
        >
          <Image src={displayImageUrl} alt="Product main" fill className={`object-contain sm:object-contain md:object-contain lg:object-contain p-2 transition-transform duration-500 ${zoomActive ? "scale-110" : "scale-100"}`} sizes="(max-width: 1024px) 100vw, 310px" priority onError={() => markImageFailed(selectedImageUrl)} />

          {zoomActive && (
            <div
              className="hidden lg:block absolute w-20 h-20 border-2 border-orange-500/70 bg-white/20 pointer-events-none"
              style={{
                left: `calc(${zoomPosition.x}% - 56px)`,
                top: `calc(${zoomPosition.y}% - 56px)`,
              }}
            />
          )}

          <div className="absolute bottom-3 right-3 opacity-30"></div>
        </div>
      </div>

      {/* ── Thumbnail strip — horizontal below main image on xs, sm, md ── */}
      <div className="flex lg:hidden flex-row justify-center gap-4 overflow-x-auto pb-1 mt-2 w-full">
        {imgs.map((src, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="relative overflow-hidden border-2 transition-all duration-200 flex-shrink-0"
            style={{
              width: "72px",
              height: "66px",
              borderRadius: "6px",
              borderColor: selected === i ? "#00462C" : "#E5E7EB",
              background: "#F9FAFB",
            }}
          >
            <Image src={failedImages[src] ? "/no-image.png" : src} alt={`Thumbnail ${i + 1}`} fill className="object-contain p-2" sizes="72px" onError={() => markImageFailed(src)} />
            {i === 1 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <PlayIcon />
              </div>
            )}
          </button>
        ))}
      </div>

      {zoomActive && (
        <div
          className="hidden lg:block absolute top-0 left-[calc(100%+24px)] w-[500px] h-[320px] border border-orange-300 rounded-lg bg-white shadow-lg pointer-events-none z-40"
          style={{
            backgroundImage: `url(${displayImageUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "140%",
            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        />
      )}

      <style jsx global>{`
        body.product-zoom-active .product-info-panel {
          opacity: 0.1;
          filter: blur(1px);
          pointer-events: none;
          user-select: none;
          transition: opacity 0.2s ease, filter 0.2s ease;
        }
      `}</style>
    </div>
  );
}
