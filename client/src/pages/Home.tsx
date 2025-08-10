import Header from "@/components/Header";
import RatesDisplay from "@/components/RatesDisplay";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { CatalogImporter } from "@/components/CatalogImporter";
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
      
      {/* Catalog Import Section - for admin use */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <CatalogImporter />
        </div>
      </div>
      
      <ContactSection />
      <WhyChooseUs />
      <Footer />
      <ChatWidget />
      <CallButton />
    </div>
  );
}
