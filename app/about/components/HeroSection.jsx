import { Leaf, FlaskConical, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-background overflow-hidden">
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <p className="uppercase tracking-[3px] text-[#5c7e54] font-semibold text-xs sm:text-sm mb-4 sm:mb-5">About Nityagro</p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] leading-tight text-gray-800 font-bold tracking-tight">
              Empowering Agriculture.
              <br />
              <span className="text-[#4d7c41]">Enriching Tomorrow.</span>
            </h1>

            <p className="mt-5 sm:mt-6 text-sm sm:text-base leading-relaxed text-muted-foreground max-w-[520px] mx-auto lg:mx-0">Nityagro is on a mission to build a sustainable agricultural ecosystem by delivering innovative, science-backed solutions that help farmers improve productivity, profitability and soil health.</p>

            {/* Feature Items */}
            <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-5 md:gap-8 mt-8 sm:mt-10 justify-center lg:justify-start">
              {[
                { icon: Leaf, title: "Sustainable", subtitle: "by Nature" },
                { icon: FlaskConical, title: "Innovation", subtitle: "at Heart" },
                { icon: Users, title: "Farmers", subtitle: "at the Core" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-[#eef5e9] flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-[#4d7c41]" size={18} />
                  </div>

                  <div className="text-left leading-tight">
                    <h4 className="font-semibold text-gray-700 text-sm">{item.title}</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative hidden md:flex justify-center lg:justify-end">
            {/* RESPONSIVE WRAPPER (KEY FIX) */}
            <div className="relative w-[220px] sm:w-[280px] md:w-[340px] lg:w-[420px] aspect-square">
              {/* SVG Clip Path */}
              <svg className="absolute w-0 h-0">
                <defs>
                  <clipPath id="blobClip" clipPathUnits="objectBoundingBox">
                    <path d="M0.5,0 C0.75,0 0.95,0.15 0.98,0.35 C1,0.5 0.95,0.7 0.85,0.85 C0.7,1 0.5,1 0.35,0.98 C0.15,0.95 0.05,0.8 0.02,0.6 C0,0.4 0.05,0.2 0.2,0.08 C0.35,0 0.45,0 0.5,0" />
                  </clipPath>
                </defs>
              </svg>

              {/* BACKGROUND BLOB (FULL SIZE OF WRAPPER) */}
              <div className="absolute inset-0 bg-[#e8f0e3]" style={{ clipPath: "url(#blobClip)" }} />

              {/* IMAGE (SAME SIZE AS BLOB) */}
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: "url(#blobClip)" }}>
                <img src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800&auto=format&fit=crop" alt="Farmer" className="w-full h-full object-cover" />
              </div>

              {/* Decorative Leaf */}
              <div className="absolute -bottom-4 -right-4 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#5c8a4d]" fill="currentColor">
                  <path d="M85 15C65 5 40 10 25 30C10 50 10 75 25 85C35 92 50 90 60 80C55 75 52 68 52 60C52 45 65 32 80 32C82 32 84 32 86 33C90 27 92 20 85 15Z" />
                  <path d="M55 55C60 45 70 40 80 42" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M45 70C50 55 60 48 72 50" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}