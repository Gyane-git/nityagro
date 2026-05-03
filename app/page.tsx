import React from 'react'
import HeroSection from "@/components/Herosection"
import ImageSlider from "@/components/Imageslider"
import ProductSection from "@/components/Productsection"
import ComboPacSection from "@/components/ComboPackSection"
import WhyChooseNityagro from "@/components/Whychoosenityagro"
import Customerreviews from "@/components/Customerreviews"
import Faq from "@/components/Faq"
import Shopctabanner from "@/components/Shopctabanner"

function page() {
  return (
    <>
      <HeroSection/>
      <ImageSlider/>
      <ProductSection/>
      <ComboPacSection/>
      <WhyChooseNityagro/>
      <Customerreviews />
      <Faq/>
      <Shopctabanner/>
    </>
  )
}

export default page