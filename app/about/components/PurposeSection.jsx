import React from "react";
import { ArrowRight } from "lucide-react";

export default function PurposeSection() {
  return (
    <section className="max-w-[1250px] mx-auto px-6 py-14 md:py-1 sm:py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
        {/* LEFT - CIRCLE IMAGE */}
        <div className="flex justify-center lg:justify-start">
          <div className="w-[260px] h-[260px] md:h-[300px] rounded-full sm:rounded-lg sm:w-full md:w-full overflow-hidden">
            <img src="https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?q=80&w=1200&auto=format&fit=crop" alt="plant" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* MIDDLE - TEXT */}
        <div className="text-center lg:text-left sm:w-full">
          <p className="uppercase tracking-[3px] text-[#5c7e54] font-semibold text-sm mb-4">OUR PURPOSE</p>

          <h2 className="text-3xl md:text-4xl lg:text-3xl font-bold text-gray-800">Why We Exist</h2>

          <p className="mt-5 text-sm md:text-base leading-relaxed text-gray-600 max-w-full lg:max-w-[330px] mx-auto lg:mx-0">We believe farming is not just an occupation—it’s the foundation of life. Our purpose is to empower every farmer with the right solutions, knowledge and care to create a prosperous and sustainable future.</p>

          <button className="mt-6 text-[#4d7c41] font-semibold flex items-center gap-2 mx-auto lg:mx-0">
            Our Mission & Vision
            <span className="text-lg">→</span>
          </button>
        </div>

        {/* RIGHT - QUOTE CARD */}
        <div className="flex justify-center lg:justify-end items-center">
          <div className="relative bg-[#f4f6ef] rounded-[28px] p-14 md:p-6 sm:w-full">
            {/* quote mark */}
            <div className="text-[#4d7c41] text-4xl font-bold">“</div>

            <p className="text-[#5c7e54] leading-relaxed">At Nityagro, we are committed to nurturing crops, conserving soil and strengthening communities for generations to come.</p>

            {/* small leaf icon bottom right */}
            <div className="absolute bottom-4 right-4 text-[#5c7e54]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8 6 6 10 6 14a6 6 0 0012 0c0-4-2-8-6-12z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}