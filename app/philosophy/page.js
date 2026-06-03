// import HeroSection from "./components/Herosection";
// import Belief from "./components/Belief";
// import OurVision from "./components/OurVision";
// import OurApproach from "./components/OurApproach";
// import Sustainability from "./components/Sustainability";
// import ExploreMore from "./components/ExploreMore";

// export default function philosophy() {
//   return (
//     <div>
//       <HeroSection />
//       <Belief />
//       <OurVision />
//       <OurApproach />
//       <Sustainability />
//       <ExploreMore />
//     </div>
//   );
// }

import { Suspense } from "react";

import HeroSection from "./components/Herosection";
import Belief from "./components/Belief";
import OurVision from "./components/OurVision";
import OurApproach from "./components/OurApproach";
import Sustainability from "./components/Sustainability";
import ExploreMore from "./components/ExploreMore";

function PhilosophyContent() {
  return (
    <>
      <HeroSection />
      <Belief />
      <OurVision />
      <OurApproach />
      <Sustainability />
      <ExploreMore />
    </>
  );
}

export default function Philosophy() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse">
          {/* Hero Skeleton */}
          <div className="h-[500px] bg-gray-200 rounded-lg" />

          {/* Content Sections */}
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="max-w-7xl mx-auto px-4 py-16">
              <div className="h-8 w-64 bg-gray-200 rounded mb-6" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-11/12" />
                <div className="h-4 bg-gray-200 rounded w-9/12" />
              </div>

              <div className="mt-8 h-64 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      }
    >
      <PhilosophyContent />
    </Suspense>
  );
}
