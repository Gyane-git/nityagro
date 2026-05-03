import React from "react";
import HeroSection from "@/components/Herosection";
import ImageSlider from "@/components/Imageslider";
import ProductSection from "@/components/Productsection";
import ComboPackSection from "../../components/ComboPackSection";
import WhyChooseNityagro from "@/components/Whychoosenityagro";
import Customerreviews from "@/components/Customerreviews";
import Faq from "@/components/Faq";
import Shopctabanner from "@/components/Shopctabanner";

function home() {
  return (
    <div>
      <HeroSection />
      <ImageSlider />
      <ProductSection />
      <ComboPackSection />
      <WhyChooseNityagro />
      <Customerreviews />
      <Faq />
      <Shopctabanner />
    </div>
  );
}

export default home;
