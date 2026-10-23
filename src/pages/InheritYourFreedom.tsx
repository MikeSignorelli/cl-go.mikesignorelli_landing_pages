import { useEffect } from "react";
import IYFHeader from "@/components/iyf/IYFHeader";
import IYFHeroSection from "@/components/iyf/IYFHeroSection";
import IYFPainPointsSection from "@/components/iyf/IYFPainPointsSection";
import IYFAssessmentSection from "@/components/iyf/IYFAssessmentSection";
import IYFVideoSection from "@/components/iyf/IYFVideoSection";
import IYFDepthSection from "@/components/iyf/IYFDepthSection";
import IYFTestimonialsSection from "@/components/iyf/IYFTestimonialsSection";
import IYFPrioritiesSection from "@/components/iyf/IYFPrioritiesSection";
import IYFWhatsIncludedSection from "@/components/iyf/IYFWhatsIncludedSection";
import IYFGreeceTourSection from "@/components/iyf/IYFGreeceTourSection";
import IYFGuaranteeSection from "@/components/iyf/IYFGuaranteeSection";
import IYFFaqSection from "@/components/iyf/IYFFaqSection";
import IYFFinalCtaSection from "@/components/iyf/IYFFinalCtaSection";
import IYFFooter from "@/components/iyf/IYFFooter";

const InheritYourFreedom = () => {
  useEffect(() => {
    document.title = "Inherit Your Freedom | Mike Signorelli";
  }, []);

  return (
    <div className="min-h-screen">
      <IYFHeader />
      <main>
        <IYFHeroSection />
        <IYFPainPointsSection />
        <IYFAssessmentSection />
        <IYFVideoSection />
        <IYFDepthSection />
        <IYFTestimonialsSection />
        <IYFPrioritiesSection />
        <IYFWhatsIncludedSection />
        <IYFGreeceTourSection />
        <IYFGuaranteeSection />
        <IYFFaqSection />
        <IYFFinalCtaSection />
      </main>
      <IYFFooter />
    </div>
  );
};

export default InheritYourFreedom;
