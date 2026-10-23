import CSSKHeader from "@/components/cssk/CSSKHeader";
import CSSKHeroSection from "@/components/cssk/CSSKHeroSection";
import CSSKSystemsSection from "@/components/cssk/CSSKSystemsSection";
import CSSKInvestmentSection from "@/components/cssk/CSSKInvestmentSection";
import CSSKTestimonialsSection from "@/components/cssk/CSSKTestimonialsSection";
import CSSKGuaranteeSection from "@/components/cssk/CSSKGuaranteeSection";
import CSSKFinalCtaSection from "@/components/cssk/CSSKFinalCtaSection";
import CSSKFooter from "@/components/cssk/CSSKFooter";

const ChurchSystemsStarterKit = () => {
  return (
    <div className="min-h-screen">
      <CSSKHeader />
      <CSSKHeroSection />
      <CSSKSystemsSection />
      <CSSKInvestmentSection />
      <CSSKTestimonialsSection />
      <CSSKGuaranteeSection />
      <CSSKFinalCtaSection />
      <CSSKFooter />
    </div>
  );
};

export default ChurchSystemsStarterKit;
