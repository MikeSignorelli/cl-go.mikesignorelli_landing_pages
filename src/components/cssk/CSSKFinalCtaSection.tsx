import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CSSKFinalCtaSection = () => {
  return (
    <section id="get-kit" className="section-padding bg-brand">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="heading-section text-primary-foreground mb-8">
          Stop Building from Scratch. Start Building from <span className="text-gold">Proven Templates.</span>
        </h2>
        <Button
          size="lg"
          className="bg-gold hover:bg-gold/90 text-brand font-heading font-bold text-lg px-8 py-6 mb-6"
        >
          Get the Church Systems Starter Kit - $97
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <p className="font-body text-sm text-primary-foreground/70">
          Instant access | Lifetime updates | Used by 300+ pastors | 100% money-back guarantee
        </p>
      </div>
    </section>
  );
};

export default CSSKFinalCtaSection;
