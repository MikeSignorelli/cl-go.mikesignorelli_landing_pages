import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CredibilityBar from "@/components/CredibilityBar";
import InvitationSection from "@/components/InvitationSection";
import ItinerarySection from "@/components/ItinerarySection";
import PricingSection from "@/components/PricingSection";
import ValueSection from "@/components/ValueSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FinalCTASection from "@/components/FinalCTASection";
import FAQSection from "@/components/FAQSection";
import ClosingCTASection from "@/components/ClosingCTASection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <CredibilityBar />
      <InvitationSection />
      <ItinerarySection />
      <PricingSection />
      <ValueSection />
      <TestimonialsSection />
      <FinalCTASection />
      <FAQSection />
      <ClosingCTASection />
      <Footer />
    </div>
  );
};

export default Index;
