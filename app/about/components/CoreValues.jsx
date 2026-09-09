import React from "react";
import { coreValues, coreValuesSection } from "./data";

export default function CoreValues() {
  return (
    <section className="max-w-[1250px] mx-auto px-6 py-10 sm:py-12 md:py-16 lg:py-20">
      {/* HEADER */}
      <div className="text-center max-w-[850px] mx-auto">
        <p className="uppercase tracking-[3px] text-[#5c7e54] font-semibold text-[11px] sm:text-xs md:text-sm">
          {coreValuesSection.eyebrow}
        </p>

        <h3 className="text-[28px] sm:text-[34px] md:text-[42px] lg:text-[50px] font-bold mt-2 sm:mt-3 lg:mt-4 leading-tight text-[#1e5c34]">
          {coreValuesSection.title}
        </h3>

        <p className="text-[#666] text-[13px] sm:text-[14px] md:text-[15px] leading-[1.8] mt-3 sm:mt-4 max-w-[760px] mx-auto">
          {coreValuesSection.description}
        </p>
      </div>

      {/* CORE VALUE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-4 mt-8 sm:mt-10 lg:mt-14 max-w-[1250px] mx-auto">
        {coreValues.map((item, i) => (
          <div
            key={i}
            className="
              group
              rounded-[24px]
              sm:rounded-[28px]
              px-5
              py-6
              sm:px-5
              sm:py-7
              lg:px-4
              lg:py-7
              border
              border-[#ecece4]
              bg-white
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-md
            "
          >
            {/* ICON */}
            <div
              className="
                w-11
                h-11
                sm:w-12
                sm:h-12
                rounded-full
                mx-auto
                bg-[#eef4ea]
                text-[#4d7c41]
                flex
                items-center
                justify-center
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              {item.icon}
            </div>

            {/* TITLE */}
            <h4
              className="
                text-[19px]
                sm:text-[21px]
                lg:text-[20px]
                text-center
                font-bold
                text-[#1e5c34]
                mt-4
                sm:mt-5
                lg:mt-6
                leading-tight
              "
            >
              {item.title}
            </h4>

            {/* TAGLINE */}
            <p
              className="
                text-[#c9963a]
                text-[13px]
                sm:text-[14px]
                text-center
                font-semibold
                mt-2
                leading-snug
              "
            >
              {item.tagline}
            </p>

            {/* DESCRIPTION */}
            <p
              className="
                text-[#666]
                text-[13px]
                sm:text-[14px]
                text-center
                leading-[1.7]
                mt-3
              "
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}