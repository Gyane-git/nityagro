"use client";

import Image from "next/image";

export default function HeroSection({
  imageSrc = "/herosection.jpg",
  imageAlt = "",
  objectPosition = "center",
}) {
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
          src={imageSrc}
          alt={imageAlt}
          width={1920}
          height={1080}
          sizes="100vw"
          className="w-full h-auto"
          style={{ objectPosition }}
          priority
          quality={95}
        />
      </section>
    </>
  );
}
