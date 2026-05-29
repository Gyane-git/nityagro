import React from "react";
import { Link, ArrowRight } from "lucide-react";
import { leaders } from "./data";

export default function LeadershipSection() {
  return (
    <section className="max-w-[1250px] mx-auto px-6 py-10 sm:py-10 md:py-12 lg:py-14">
      <div className="text-center">
        <p className="uppercase tracking-[3px] text-[#5c7e54] font-bold text-sm sm:text-base md:text-lg lg:text-lg">Leadership That Inspires</p>

        <h3 className="text-[30px] sm:text-[30px] md:text-[40px] lg:text-[50px] font-bold mt-2 sm:mt-2 md:mt-3 lg:mt-4">The People Behind Nityagro</h3>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-10 sm:mt-12 md:mt-14 lg:mt-14">
        {leaders.map((leader, i) => (
          <div key={i} className="rounded-[30px] p-4 border border-[#ecece4] bg-white">
            <div className="flex items-stretch gap-5">
              {/* Image: 40% */}
              <img src={leader.img} alt="" className="w-[40%] h-60 shrink-0 self-stretch rounded-xl object-cover" />

              {/* Content: 60% */}
              <div className="w-[60%] pt-5">
                <h4 className="text-lg font-bold leading-tight">{leader.name}</h4>

                <p className="text-base text-[#4d7c41] font-semibold mt-2">{leader.role}</p>

                <p className="text-[#666] text-sm leading-[28px] mt-4">{leader.desc}</p>

                <Link className="text-[#4d7c41] mt-5" size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button className="text-[#4d7c41] font-semibold flex items-center gap-2">
          Meet Our Team
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}