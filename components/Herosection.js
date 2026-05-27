"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { apiGetRequest } from "@/apihelper/apiHelper";

export default function HeroSection({
  imageSrc = "",
  imageAlt = "",
  objectPosition = "center",
}) {
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    const fetchHeroBanner = async () => {
      const response = await apiGetRequest("/banners");
      const rows = Array.isArray(response?.data?.banners)
        ? response.data.banners
        : [];
      const active = rows.filter((item) => item.isActive !== false);
      const selected = active[0] || rows[0] || null;
      setHeroImage(selected?.bannerImageforWeb || selected?.imageUrl || "");
    };
    fetchHeroBanner();
  }, []);

  const resolvedImage = useMemo(() => {
    const source = imageSrc || heroImage || "/herosection.jpg";
    if (/^https?:\/\//i.test(source)) return source;
    return source.startsWith("/") ? source : `/${source}`;
  }, [heroImage, imageSrc]);

  return (
    <>
      <style>{`
        .hero-section {
          width: 100vw;
          position: relative;
          left: 50%;
          margin-left: -50vw;
        }

        .hero-section img {
          width: 100% !important;
          height: auto !important;
          display: block;
        }
      `}</style>

      <section className="hero-section overflow-hidden" aria-label="Hero">
        <Image
          src={resolvedImage}
          alt={imageAlt}
          width={1440}
          height={731}
          sizes="100vw"
          className="w-full h-auto"
          style={{ objectPosition }}
          priority
          quality={95}
          unoptimized={resolvedImage.startsWith("/banners/")}
        />
      </section>
    </>
  );
}
