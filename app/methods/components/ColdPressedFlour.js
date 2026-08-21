// components/ColdPressedFlour.jsx
"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import OurProcess from "./OurProcess";

export default function ColdPressedFlour({ data }) {
  const params = useParams();

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef(null);

  const videos = {
    "stone-pressed": "/videos/stone-pressed.mp4",
    "wood-pressed": "/videos/wood-pressed.mp4",
  };

  const videoSrc = videos[params?.id];

  const openVideo = () => {
    setIsVideoOpen(true);
    setIsPlaying(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);

    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  return (
    <>
      <div
        className="w-full bg-white"
        style={{ fontFamily: "var(--font-jost)" }}
      >
        {/* ── Centered page header ── */}
        <div className="text-center px-5 sm:px-10 lg:px-16 pt-10 sm:pt-12 pb-8 sm:pb-10">
          <h1 className="text-[20px] sm:text-[22px] lg:text-[26px] font-bold text-[#1e5c34] tracking-[0.01em] mb-1.5">
            {data?.title}
          </h1>
          <p className="text-[16px] sm:text-[18px] lg:text-[22px] font-normal text-[#1e5c34]">
            {data?.description}
          </p>
        </div>
        {/* ── Main two-column layout ── */}
        <div className="flex flex-col lg:flex-row items-start px-5 sm:px-10 md:px-14 lg:pl-20 lg:pr-16 pb-12 sm:pb-16 lg:pb-20 gap-10 lg:gap-0">
          {/* LEFT */}
          <div className="w-full lg:w-[48%] shrink-0 pt-4 lg:pt-8 lg:pr-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#fdf0d0] rounded-full px-4 py-2 mb-6 lg:mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4a82a] shrink-0" />
              <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-[#5a4a1a]">
                {data?.badge}
              </span>
            </div>

            {/* Headline */}
            <h2
              className="text-[38px] sm:text-[50px] md:text-[58px] lg:text-[68px] font-semibold leading-[1.08] text-[#1e5c34] mb-5 lg:mb-7"
              style={{ fontFamily: "var(--font-garamond)" }}
            >
              {data?.headline1}
              <br />
              {data?.headline2}{" "}
              <span className="text-[#d4a82a]">{data?.headlineGold}.</span>
            </h2>

            {/* Body */}
            <p className="text-[14px] sm:text-[15px] font-light leading-[1.82] text-[#4a4a46] mb-7 lg:mb-9 max-w-full lg:max-w-120">
              {data?.desc || "No description"}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap justify-between sm:justify-start items-center gap-5 sm:gap-4 mb-10 lg:mb-14">
              {/* Open Video Button */}
              <button
                onClick={openVideo}
                className="inline-flex items-center gap-2.5 bg-[#1e5c34] rounded-full px-6 sm:px-7 py-3 sm:py-3.5 text-[12px] sm:text-[13px] font-medium text-white"
              >
                {data?.btnPrimary}

                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className="inline-flex items-center bg-transparent border-[1.5px] border-[#1e5c34] rounded-full px-6 sm:px-7 py-3 sm:py-3.5 text-[12px] sm:text-[13px] font-medium text-[#1e5c34]">
                {data?.btnSecondary}
              </button>
            </div>
            {/* Video Modal */}
            {isVideoOpen && (
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
                onClick={closeVideo}
              >
                {/* 80vw × 80vh Video Container */}
                <div
                  className="relative w-[60vw] h-[80vh] overflow-hidden rounded-2xl bg-black"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Video */}
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    autoPlay
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full h-full object-contain"
                  />

                  {/* Center Play / Pause Button */}
                  <button
                    onClick={togglePlay}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:scale-110 hover:bg-black/75"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? (
                      /* Pause */
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7 5V19M17 5V19"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      /* Play */
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M8 5v14l11-7L8 5z" />
                      </svg>
                    )}
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={closeVideo}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
                    aria-label="Close video"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 6L18 18M18 6L6 18"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            {/* <div className="flex flex-wrap items-start">
            {data?.stats?.map((stat, index) => (
              <div
                key={index}
                className={`group pr-7 sm:pr-10 mb-5 sm:mb-0 ${
                  index !== 0 ? "pl-7 sm:pl-10 border-l border-[#d6d2ca]" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="block w-5 h-[2px] bg-[#00462C] transition-all duration-300 group-hover:w-8" />
                  <span className="text-[10px] font-medium tracking-[0.15em] text-[#9a968e]">
                    0{index + 1}
                  </span>
                </div>

                <p className="text-[25px] sm:text-[29px] lg:text-[28px] font-bold leading-tight tracking-tight text-[#1e2a1e]">
                  {stat.value}
                </p>

                <p className="mt-1.5 text-[11px] sm:text-[12px] lg:text-[13px] leading-5 text-[#77736c] max-w-[180px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div> */}
          </div>

          {/* RIGHT */}
          <div className="flex-1 w-full flex justify-center lg:justify-end items-start pt-0 lg:pt-4">
            <div
              className="relative w-full rounded-[24px] sm:rounded-[36px] p-4 sm:p-5"
              style={{
                background:
                  "0 0 60px 30px rgba(235,185,70,0.35), 0 0 100px 50px rgba(235,185,70,0.15)",
              }}
            >
              <div
                className="rounded-[16px] sm:rounded-[22px] overflow-hidden w-full"
                style={{ boxShadow: "0 0 30px 15px rgba(201,150,58,0.20)" }}
              >
                <Image
                  src="/methods/mill.png"
                  alt="Stone grinding flour"
                  width={700}
                  height={875}
                  className="w-full object-cover rounded-[16px] sm:rounded-[22px]"
                  style={{ height: "clamp(280px, 50vw, 600px)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {params?.id === "stone-pressed" && <OurProcess />}
    </>
  );
}
