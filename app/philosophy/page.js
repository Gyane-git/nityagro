// import React from "react";
// import ProductSection from "@/components/Productsection";
// import ComboPackSection from "../../components/ComboPackSection";
// import WhyChooseNityagro from "@/components/Whychoosenityagro";
// import CustomerReviews from "@/components/Customerreviews";
// import Faq from "@/components/Faq";
// import Shopctabanner from "@/components/Shopctabanner";
import HeroSection from "./components/Herosection";
import Belief from "./components/Belief";
import OurVision from "./components/OurVision"
import OurApproach from "./components/OurApproach";
import Sustainability from "./components/Sustainability";
import ExploreMore from "./components/ExploreMore";

function philosophy() {
  return (
    <div>
      <HeroSection />
      <Belief />
      <OurVision/>
      <OurApproach/>
      <Sustainability/>
      <ExploreMore/>
    </div>
  );
}

export default philosophy;
