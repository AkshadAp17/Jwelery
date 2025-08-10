import Header from "@/components/Header";
import RatesDisplay from "@/components/RatesDisplay";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

import ChatWidget from "@/components/ChatWidget";
import CallButton from "@/components/CallButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <Header />
      <RatesDisplay />
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
      

      
      <ContactSection />
      <WhyChooseUs />
      <Footer />
      <ChatWidget />
      <CallButton />
    </div>
  );
}
