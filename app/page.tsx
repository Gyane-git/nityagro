import HeroSection from "@/components/Herosection";
import ImageSlider from "@/components/Imageslider";
import ProductSection from "@/components/Productsection";
import ComboPackSection from "@/components/ComboPackSection";
import WhyChooseNityagro from "@/components/Whychoosenityagro";
import Faq from "@/components/Faq";
import Shopctabanner from "@/components/Shopctabanner";
import CustomerReviews from "@/components/Customerreviews";

function page() {
  return (
    <>
      <HeroSection />
      <ImageSlider />
      <ProductSection />
      <ComboPackSection />
      <WhyChooseNityagro />
      <CustomerReviews />
      <Faq />
      <Shopctabanner />
    </>
  );
}

export default page;
