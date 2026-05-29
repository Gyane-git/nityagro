import React from "react";
import { Users, Sprout, MapPin, FlaskConical } from "lucide-react";

export default function StatsSection() {
  const stats = [
    { icon: <Users size={30} />, value: "10,000+", label: "Happy Farmers" },
    { icon: <Sprout size={30} />, value: "1M+", label: "Acres Impacted" },
    { icon: <MapPin size={30} />, value: "20+", label: "States Reached" },
    { icon: <FlaskConical size={30} />, value: "50+", label: "Innovative Products" },
  ];

  return (
    <section className="border-y border-[#e9e9df] bg-white mb-5 py-12 sm:py-8 md:py-10 lg:py-12">
      <div className="max-w-[1250px] mx-auto">
        {/* SCROLL CONTAINER */}
        <div className="flex overflow-x-auto scrollbar-hide lg:grid lg:grid-cols-4">
          {stats.map((item, i) => (
            <div
              key={i}
              className="
                min-w-[260px] lg:min-w-0
                py-10 lg:py-14
                px-6
                border-r last:border-r-0 border-[#ecece4]
                flex items-center justify-center gap-5
                flex-shrink-0
              "
            >
              <div className="text-[#4d7c41]">{item.icon}</div>

              <div>
                <h4 className="text-[34px] lg:text-[42px] font-bold leading-none">{item.value}</h4>
                <p className="text-[#666] mt-2">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}