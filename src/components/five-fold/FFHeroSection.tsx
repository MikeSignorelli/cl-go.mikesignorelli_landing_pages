import { useState } from "react";
import { Button } from "@/components/ui/button";
import mikeHero from "@/assets/five-fold/mike-hero-new.webp";
import FFQuizModal from "@/components/five-fold/FFQuizModal";

const FFHeroSection = () => {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <section className="relative bg-charcoal overflow-hidden pt-16">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-7 text-center lg:text-left">
            <h1 className="heading-display text-cream leading-[1.1]">
              Discover Your Five-Fold Gift - And Unlock the Calling You've Been Missing
            </h1>

            <p className="font-body text-lg md:text-xl leading-relaxed text-warm-gray max-w-xl mx-auto lg:mx-0">
              Discover which of the five-fold gifts God has placed in you by taking the free quiz in under 5 minutes. Get your personalized Five-Fold Identity Certificate to share with your community.
            </p>

            <div className="max-w-lg mx-auto lg:mx-0">
              <Button
                variant="hero"
                size="lg"
                className="h-auto min-h-12 py-3 px-6 w-full sm:w-auto text-sm sm:text-base whitespace-normal text-center leading-snug"
                onClick={() => setQuizOpen(true)}
              >
                Take the Free Quiz → Discover Your Gift
              </Button>
            </div>

            <div className="pt-5 border-t border-cream/20">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 justify-center lg:justify-start text-sm md:text-base font-body tracking-wide">
                <span className="text-secondary font-bold">1.6M YouTube Subscribers</span>
                <span className="text-cream/40">|</span>
                <span className="text-cream/90">TBN Weekly Show</span>
                <span className="text-cream/40">|</span>
                <span className="text-cream/90">Fastest-Growing Church in America - 5 Years</span>
                <span className="text-cream/40">|</span>
                <span className="text-cream/90">Baker Books Author</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 justify-center lg:justify-start">
              <span className="text-cream/90 text-sm md:text-base font-body font-medium">✓ Free - no credit card required</span>
              <span className="text-cream/90 text-sm md:text-base font-body font-medium">✓ Takes under 5 minutes</span>
              <span className="text-cream/90 text-sm md:text-base font-body font-medium">✓ Get your personalized certificate instantly</span>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px] overflow-hidden rounded-[10px]">
              <img
                src={mikeHero}
                alt="Mike Signorelli"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <FFQuizModal open={quizOpen} onOpenChange={setQuizOpen} />
    </section>
  );
};

export default FFHeroSection;
