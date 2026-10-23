import { PSAQuizProvider } from "@/context/PSAQuizContext";
import PSAHeader from "@/components/psa/PSAHeader";
import PSAHeroSection from "@/components/psa/PSAHeroSection";
import PSAProblemSection from "@/components/psa/PSAProblemSection";
import PSAAuditRevealSection from "@/components/psa/PSAAuditRevealSection";
import PSASystemsSection from "@/components/psa/PSASystemsSection";
import PSACredibilitySection from "@/components/psa/PSACredibilitySection";
import PSATestimonialsSection from "@/components/psa/PSATestimonialsSection";
import PSAWhoIsItForSection from "@/components/psa/PSAWhoIsItForSection";
import PSAFaqSection from "@/components/psa/PSAFaqSection";
import PSACtaSection from "@/components/psa/PSACtaSection";
import PSAFooter from "@/components/psa/PSAFooter";
import PSAQuizModal from "@/components/psa/quiz/PSAQuizModal";

const PastorSystemsAudit = () => {
  return (
    <PSAQuizProvider>
      <div className="min-h-screen flex flex-col">
        <PSAHeader />
        <main className="flex-1 pt-[80px]">
          <PSAHeroSection />
          <PSAProblemSection />
          <PSAAuditRevealSection />
          <PSASystemsSection />
          <PSACredibilitySection />
          <PSATestimonialsSection />
          <PSAWhoIsItForSection />
          <PSAFaqSection />
          <PSACtaSection />
        </main>
        <PSAFooter />
        <PSAQuizModal />
      </div>
    </PSAQuizProvider>
  );
};

export default PastorSystemsAudit;
