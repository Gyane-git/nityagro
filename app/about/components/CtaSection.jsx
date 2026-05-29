import React from "react";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
      <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] bg-[#25411d] min-h-[180px] sm:min-h-[220px] lg:min-h-[260px] flex items-center px-6 sm:px-10 lg:px-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop" alt="" className="w-full h-full object-cover opacity-35" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center justify-between w-full gap-8 sm:gap-10">
          {/* Text */}
          <div className="max-w-full lg:max-w-[500px] text-center lg:text-left mt-2">
            <h3 className="text-white text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">Let's Grow a Sustainable Future Together</h3>

            <p className="text-white/80 text-sm sm:text-base lg:text-[18px] leading-[24px] sm:leading-[28px] lg:leading-[34px] mt-4 sm:mt-5 lg:mt-6">Partner with Nityagro for innovative and sustainable agricultural solutions.</p>
          </div>

          {/* Button */}
          <button className="bg-white text-[#25411d] whitespace-nowrap mb-4 sm:mb-0 md:mb-0 lg:mb-0 px-4 sm:px-4 lg:px-4 py-3 sm:py-2 lg:py-3 rounded-xl sm:rounded-2xl font-semibold flex items-center gap-2 sm:gap-2 shadow-lg text-sm sm:text-base">
            Get In Touch Today
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}