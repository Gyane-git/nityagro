"use client";

import Image from "next/image";

/**
 * HeroSection
 *
 * Props:
 *  - imageSrc       {string}  Path to hero image         (default: "/hero.jpg")
 *  - imageAlt       {string}  Alt text                   (default: "")
 *  - height         {string}  Any CSS height value       (default: "100vh")
 *  - objectPosition {string}  CSS object-position        (default: "center")
 */
export default function HeroSection({
  imageSrc = "/herosection.jpg",
  imageAlt = "",
  height = "100vh",
  objectPosition = "center",
}) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height }}
      aria-label="Hero"
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        style={{ objectPosition }}
        priority
        quality={95}
      />
    </section>
  );
}