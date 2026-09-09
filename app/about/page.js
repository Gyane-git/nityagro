import React from "react";

//import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import PurposeSection from "./components/PurposeSection";
import CoreValues from "./components/CoreValues";
import StatsSection from "./components/StatSection";
import LeadershipSection from "./components/LeaderSection";
import TimelineSection from "./components/timeLineSection";
import CTASection from "./components/CtaSection";
//import Footer from "./components/Footer";

export default function page() {
  return (
    <div className="bg-[#f8f8f4] text-[#1c1c1c] overflow-hidden">
      {/* <Navbar /> */}
      <HeroSection />
      <PurposeSection />
      <CoreValues />
      <StatsSection />
      <LeadershipSection />
      <TimelineSection />
      <CTASection />
      {/* <Footer /> */}
    </div>
  );
}