import { useState } from "react";
import FFHeader from "@/components/five-fold/FFHeader";
import FFHeroSection from "@/components/five-fold/FFHeroSection";
import FFProblemSection from "@/components/five-fold/FFProblemSection";
import FFSolutionSection from "@/components/five-fold/FFSolutionSection";
import FFHowItWorksSection from "@/components/five-fold/FFHowItWorksSection";
import FFAboutSection from "@/components/five-fold/FFAboutSection";
import FFCredibilitySection from "@/components/five-fold/FFCredibilitySection";
import FFFAQSection from "@/components/five-fold/FFFAQSection";
import FFFinalCTASection from "@/components/five-fold/FFFinalCTASection";
import FFFooter from "@/components/five-fold/FFFooter";
import FFQuizModal from "@/components/five-fold/FFQuizModal";

const FiveFoldGift = () => {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <FFHeader />
      <main>
        <FFHeroSection />
        <FFProblemSection />
        <FFSolutionSection />
        <FFHowItWorksSection onQuizOpen={() => setQuizOpen(true)} />
        <FFAboutSection />
        <FFCredibilitySection />
        <FFFAQSection />
        <FFFinalCTASection onQuizOpen={() => setQuizOpen(true)} />
      </main>
      <FFFooter />
      <FFQuizModal open={quizOpen} onOpenChange={setQuizOpen} />
    </div>
  );
};

export default FiveFoldGift;
