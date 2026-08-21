"use client";

import { Check, Leaf } from "lucide-react";

/* ---------- Small custom icons to match the source art exactly ---------- */

function MillstoneIcon({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <ellipse
        cx="32"
        cy="42"
        rx="22"
        ry="7"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <ellipse
        cx="32"
        cy="36"
        rx="22"
        ry="7"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M10 36v6M54 36v6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <ellipse
        cx="32"
        cy="30"
        rx="14"
        ry="4.5"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M18 30v6M46 30v6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M32 22v-8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}

function WheatIcon({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <path
        d="M20 6v28"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {[10, 15, 20, 25].map((y) => (
        <g key={y}>
          <path d={`M20 ${y} q-6 -1 -7 -6 q6 0 7 6`} fill="currentColor" />
          <path d={`M20 ${y} q6 -1 7 -6 q-6 0 -7 6`} fill="currentColor" />
        </g>
      ))}
      <path
        d="M20 34l-3 4M20 34l3 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpiceSprigIcon({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <path
        d="M14 30c-2-8 0-16 8-22"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M17 12c-3 1-5 4-4 8 4-1 6-4 4-8Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M13 18c-3 1-5 4-4 8 4-1 6-4 4-8Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M25 14c2 6 1 12-4 16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="27" cy="12" r="1.6" fill="currentColor" />
      <circle cx="30" cy="16" r="1.6" fill="currentColor" />
      <circle cx="26" cy="17.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

const BOTTOM_ITEMS = [
  { icon: Leaf, label: ["NATURAL", "INGREDIENTS"] },
  {
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path
          d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: ["MINIMAL", "PROCESSING"],
  },
  {
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path
          d="M6 13a6 6 0 0 0 12 0"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M12 13V4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M9.5 6.5 12 4l2.5 2.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 20h16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    label: ["TRADITIONAL", "METHODS"],
  },
  {
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path
          d="M12 20s-7-4.35-9.5-8.7C.9 8 2.4 4.5 6 4.5c2 0 3.5 1.2 4.2 2.7.7-1.5 2.2-2.7 4.2-2.7 3.6 0 5.1 3.5 3.5 6.8C19 15.65 12 20 12 20Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: ["MADE", "WITH CARE"],
  },
];

const CHECKLIST = [
  "Low heat generation",
  "Retains natural aroma",
  "Preserves authentic flavor & texture",
];

export default function OurProcess() {
  return (
    <section className="w-full bg-[#faf8f2] px-5 sm:px-10 lg:px-16 py-14 sm:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-semibold tracking-[0.22em] text-[#1c3a26]">
            OUR PROCESS
          </span>
        </div>
        <span className="block w-8 h-[2px] bg-[#1c3a26] mb-6" />

        {/* Headline */}
        <h2
          className="text-[36px] sm:text-[46px] lg:text-[52px] leading-[1.08] font-medium text-[#132b1c] mb-5"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Stone Ground.
          <br />
          The Traditional Way.
        </h2>

        {/* Sub copy */}
        <p className="text-[15px] sm:text-[16px] leading-[1.6] text-[#5c5a52] max-w-md mb-10">
          We use traditional stone processing to preserve the natural goodness
          in everything we make.
        </p>

        {/* Stone Ground panel */}
        <div className="bg-[#e6e4d6] rounded-[18px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1c3a26] flex items-center justify-center shrink-0">
            <MillstoneIcon className="w-11 h-11 sm:w-12 sm:h-12 text-[#e6e4d6]" />
          </div>

          <div className="flex-1">
            <h3 className="text-[19px] sm:text-[21px] font-bold tracking-tight text-[#132b1c] mb-2">
              STONE GROUND
            </h3>
            <span className="block w-8 h-[2px] bg-[#1c3a26] mb-3" />
            <p className="text-[13.5px] sm:text-[14.5px] leading-[1.7] text-[#5c5a52] max-w-sm">
              Our core method. Traditional stone processing that is gentle, slow
              and natural—just the way it has always been.
            </p>
          </div>

          <div className="hidden sm:block w-px self-stretch bg-[#c9c6b6]" />

          <ul className="flex flex-col gap-3 shrink-0">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-2.5 max-w-[210px]">
                <span className="mt-0.5 w-4 h-4 rounded-full border border-[#1c3a26] flex items-center justify-center shrink-0">
                  <Check
                    className="w-2.5 h-2.5 text-[#1c3a26]"
                    strokeWidth={3}
                  />
                </span>
                <span className="text-[13px] sm:text-[13.5px] leading-[1.4] text-[#3a3934]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Connector: PROCESSED INTO */}
        <div className="relative flex justify-center py-8">
          <svg
            className="absolute inset-x-0 top-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="14"
              stroke="#c9c6b6"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>
          <span className="relative z-10 bg-[#1c3a26] text-white text-[11px] font-semibold tracking-[0.14em] px-4 py-2 rounded-md">
            PROCESSED INTO
          </span>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* Whole Grains */}
          <div className="bg-white border border-[#ece9dd] rounded-[18px] p-7 sm:p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#dbe9f2] flex items-center justify-center mb-5">
              <WheatIcon className="w-8 h-8 text-[#132b1c]" />
            </div>
            <h4 className="text-[16px] sm:text-[17px] font-bold tracking-tight text-[#132b1c] mb-2">
              WHOLE GRAINS
            </h4>
            <span className="block w-8 h-[2px] bg-[#7fa9c9] mb-4" />
            <p className="text-[13px] sm:text-[13.5px] leading-[1.7] text-[#5c5a52] max-w-[220px]">
              Processed from carefully selected whole grains for better
              nutrition.
            </p>
          </div>

          {/* Whole Spices */}
          <div className="bg-white border border-[#ece9dd] rounded-[18px] p-7 sm:p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#f3e3c2] flex items-center justify-center mb-5">
              <SpiceSprigIcon className="w-8 h-8 text-[#132b1c]" />
            </div>
            <h4 className="text-[16px] sm:text-[17px] font-bold tracking-tight text-[#132b1c] mb-2">
              WHOLE SPICES
            </h4>
            <span className="block w-8 h-[2px] bg-[#d4a94a] mb-4" />
            <p className="text-[13px] sm:text-[13.5px] leading-[1.7] text-[#5c5a52] max-w-[220px]">
              Ground from whole spices to preserve their natural oils and strong
              flavor.
            </p>
          </div>
        </div>

        {/* Commitment banner */}
        <div className="relative mt-8 bg-[#e6e4d6] rounded-[18px] pl-8 sm:pl-9 pr-6 sm:pr-8 py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center gap-6 overflow-hidden">
          <span className="absolute left-0 top-0 h-full w-2.5 bg-[#1c3a26]" />

          <div className="w-16 h-16 rounded-full bg-[#1c3a26] flex items-center justify-center shrink-0 relative">
            <Leaf className="w-6 h-6 text-[#e6e4d6]" strokeWidth={1.5} />
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
            >
              <defs>
                <path
                  id="commitCircle"
                  d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text fill="#e6e4d6" fontSize="7.5" letterSpacing="1.5">
                <textPath href="#commitCircle" startOffset="0%">
                  OUR COMMITMENT • OUR COMMITMENT •
                </textPath>
              </text>
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-[17px] sm:text-[19px] font-bold tracking-tight text-[#132b1c] mb-2">
              NO ADDED PRESERVATIVES
            </h3>
            <span className="block w-8 h-[2px] bg-[#1c3a26] mb-3" />
            <p className="text-[13px] sm:text-[13.5px] leading-[1.7] text-[#5c5a52]">
              Nothing extra added.
              <br />
              Just pure, natural goodness in every pack.
            </p>
          </div>

          <div className="hidden sm:block w-px self-stretch bg-[#c9c6b6]" />

          <div className="flex flex-col items-center gap-2 shrink-0 pl-2">
            <Leaf className="w-6 h-6 text-[#1c3a26]" strokeWidth={1.5} />
            <p className="text-[11px] font-semibold tracking-wide text-[#132b1c] text-center leading-tight">
              PURE
              <br />
              NATURAL
              <br />
              HONEST
            </p>
          </div>
        </div>

        {/* Bottom icon row */}
        <div className="flex flex-wrap items-center border-t border-[#e2dfd2] mt-10 pt-7">
          {BOTTOM_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`group flex items-center gap-3 pr-7 sm:pr-10 mb-4 sm:mb-0 ${
                  index !== 0 ? "pl-7 sm:pl-10 border-l border-[#e2dfd2]" : ""
                }`}
              >
                <Icon
                  className="w-5 h-5 text-[#1c3a26] shrink-0 transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.6}
                />
                <p className="text-[11px] sm:text-[12px] font-semibold leading-tight tracking-wide text-[#132b1c] uppercase">
                  {item.label[0]}
                  <br />
                  {item.label[1]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
