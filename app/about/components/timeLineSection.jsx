"use client";

import Image from "next/image";
//import revolutionImg from "./assets/timeline.png"; // replace with your actual image path

export default function JoinTheMovement() {
  return (
    <section className="relative w-full mt-5 bg-[#2d5f4f] overflow-hidden">
      {/* Header */}
      <div className="text-center pt-10 pb-2 px-4">
        <h2 className="text-[#c8a951] font-serif italic text-[32px] sm:text-[38px] md:text-[44px] font-semibold leading-tight">Join the Movement</h2>
        <p className="text-white text-sm sm:text-base leading-[1.8] mt-3 max-w-[780px] mx-auto">
          Switch to clean staples. Try ghee that tastes like your nani made it. Use oils that don&apos;t just sizzle, but nourish.
          <br className="hidden sm:block" />
          Let&apos;s rebuild the food system. One conscious kitchen at a time.
        </p>
      </div>

      {/* Full banner image */}
      <div className="relative w-full sm:-mt-10 md:-mt-20 lg:-mt-20 ">
        <Image src="/assets/timeline.png" alt="Join the Movement — Anveshan products" width={1280} height={520} className="w-full h-auto object-cover object-bottom" priority />
      </div>
    </section>
  );
}