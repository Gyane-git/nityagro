import Image from "next/image";
import outVision from "@/public/images/our_vision.jpeg";

export default function Vision() {
  return (
    <div className="w-full bg-white pb-8 sm:pb-12 lg:pb-16">
      <section className="w-full bg-[#2d6a3f] flex flex-col lg:flex-row items-center px-5 sm:px-10 md:px-16 lg:px-20 py-10 sm:py-12 gap-8 lg:gap-14" aria-label="Our Vision">
        {/* Left: Image */}
        <div className="w-full lg:w-[44%] shrink-0">
          <Image src={outVision} alt="Farmers planting rice in terraced fields" width={700} height={500} className="w-full h-56 sm:h-72 md:h-80 lg:h-105 object-cover rounded-xl" />
        </div>

        {/* Right: Content */}
        <div className="flex-1 text-white w-full">
          <p className="text-[13px] sm:text-[14px] lg:text-[16px] font-bold tracking-[0.2em] uppercase text-[#c9963a] mb-2" style={{ fontFamily: "var(--font-jost)" }}>
            02 — Our Vision
          </p>
          <div className="h-[1.5px] w-full bg-[#c9963a] opacity-80 mb-5 lg:mb-6" />

          <h2 className="text-[26px] sm:text-[30px] lg:text-[36px] font-normal leading-tight text-white" style={{ fontFamily: "var(--font-garamond)" }}>
            The kitchen, once again
            <br />a place of
          </h2>
          <span className="block text-[26px] sm:text-[30px] lg:text-[36px] italic font-extralight text-[#c9963a] mb-5 lg:mb-6 leading-tight" style={{ fontFamily: "var(--font-garamond)" }}>
            uncompromised health.
          </span>

          <p className="text-[13px] sm:text-[14px] font-light leading-[1.85] text-white/85 mb-4 max-w-full" style={{ fontFamily: "var(--font-jost)" }}>
            We are building a world where clean, chemical-free nourishment is a standard for every family — not a luxury. By bridging ancient wisdom and modern needs, we ensure that when the method is honest, the food is healing.
          </p>
          <p className="text-[13px] sm:text-[14px] font-light leading-[1.85] text-white/85 max-w-full" style={{ fontFamily: "var(--font-jost)" }}>
            Our journey starts at the roots: connecting the farm directly to your kitchen, while supporting the women who work our fields and lead our homes.
          </p>

          <blockquote className="border-l-[2.5px] border-[#c9963a] pl-4 sm:pl-5 mt-6 lg:mt-7">
            <p className="text-[16px] sm:text-[17px] lg:text-[19px] italic font-normal text-white/90 leading-[1.55]" style={{ fontFamily: "var(--font-garamond)" }}>
              "The first step to health begins in the kitchen."
            </p>
          </blockquote>
        </div>
      </section>
    </div>
  );
}