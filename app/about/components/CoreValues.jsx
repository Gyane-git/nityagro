import React from "react";
import { coreValues } from "./data";

export default function CoreValues() {
  return (
    <section className="max-w-[1250px] mx-auto px-6 py-5 lg:py-20 md:py-1 sm:py-10">
      <div className="text-center">
        <p className="uppercase tracking-[3px] text-[#5c7e54] font-semibold text-sm">What Drives Us</p>

        <h3 className="text-[20px] sm:text-[30px] md:text-[40px] lg:text-[50px] font-bold mt-1 sm:mt-2 md:mt-3 lg:mt-4">Our Core Values</h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 sm:mt-8 md:mt-10 lg:mt-14 justify-center max-w-8xl mx-auto">
        {coreValues.map((item, i) => (
          <div key={i} className="rounded-[28px] px-4 py-4 sm:py-6 md:py-8 border border-[#ecece4]">
            <div className="w-10 h-10 rounded-full mx-auto bg-[#eef4ea] text-[#4d7c41] flex items-center justify-center">{item.icon}</div>

            <h4 className="text-[20px] md:text-[24px] text-center font-bold mt-4 md:mt-7">{item.title}</h4>

            <p className="text-[#666] text-center leading-6 md:leading-[30px] mt-2 md:mt-4">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}