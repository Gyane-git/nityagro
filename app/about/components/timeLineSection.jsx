import React from "react";
import { TrendingUp } from "lucide-react";
import { timeline } from "./data";

export default function TimelineSection() {
  return (
    <section className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-10 lg:py-8 rounded-lg bg-yellow-50">
      {/* Heading */}
      <div className="text-center">
        <p className="uppercase tracking-[2px] sm:tracking-[3px] text-[#5c7e54] font-semibold text-xs sm:text-sm">Our Journey</p>

        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[50px] font-bold mt-3 sm:mt-4 leading-tight">Growing Stronger Every Day</h3>
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-8 mt-10 sm:mt-12 md:mt-14 lg:mt-16">
        {timeline.map((item, i) => (
          <div key={i} className="text-center relative px-2 sm:px-1 bg-gray-100 rounded-2xl p-2">
            {/* Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto rounded-full bg-[#eef4ea] flex items-center justify-center text-[#4d7c41]">
              <TrendingUp size={20} className="sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
            </div>

            {/* Year */}
            <h4 className="font-bold text-xl sm:text-2xl lg:text-[28px] mt-4 sm:mt-5 lg:mt-6">{item.year}</h4>

            {/* Title */}
            <p className="font-semibold text-sm sm:text-base lg:text-base mt-2 sm:mt-3">{item.title}</p>

            {/* Description */}
            <p className="text-[#666] text-xs sm:text-sm lg:text-base mt-2 sm:mt-3 leading-[22px] sm:leading-[26px] lg:leading-[28px]">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}