// components/PhilosophyHero.jsx

export default function PhilosophyHero() {
  return (
    <section className="relative w-full min-h-190 flex flex-col justify-center px-40 pt-25 pb-28 overflow-hidden">
      {/* Background image + dark overlay */}
      <div
        className="absolute inset-0 z-0 bg-center bg-cover"
        style={{ backgroundImage: "url('/images/hero-img.jpeg')" }}
      >
        <div className="absolute inset-0 bg-[#143c23]/45" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-white/18 border border-white/30 backdrop-blur-sm rounded-full px-4.5 py-1.5 mb-7">
          <div className="w-1.75 h-1.75 rounded-full bg-[#d4a82a] shrink-0" />
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white font-jost">
            Our Philosophy
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-[80px] font-normal leading-[1.08] text-[#F9F5EC] mb-8 max-w-225"
          style={{ fontFamily: "var(--font-garamond)" }}
        >
          Products made using
          <br />
          <em className="italic text-[#d4a82a]">traditional</em> methods.
        </h1>

        {/* Body */}
        <p
          className="text-[15px] font-light leading-[1.85] text-white/82 max-w-125"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          Long before machines sped things up, food was made slowly,
          <br />
          carefully, and with respect for nature. We are bringing that wisdom
          <br />
          back to your kitchen.
        </p>
      </div>

      {/* Wave cutout at bottom */}
      <div className="absolute bottom-0 left-0 w-full z-20 leading-none">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full block"
        >
          <path
            d="M0,20 C380,80 960,0 1440,40 L1440,80 L0,80 Z"
            fill="#f7f6f2"
          />
        </svg>
      </div>
    </section>
  );
}
