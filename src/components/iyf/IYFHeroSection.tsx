import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bookCover from "@/assets/inherit-your-freedom-book.webp";

const trustItems = [
  "Baker Books Published",
  "Ships within 3-5 business days",
  "Bonus teaching video included",
  "100% satisfaction guarantee",
];

const IYFHeroSection = () => {
  const navigate = useNavigate();
  const handleBuyNow = () => {
    navigate("/inherit-your-freedom/shop");
  };

  return (
    <section className="relative pt-36 md:pt-40 section-padding bg-background">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="space-y-6 opacity-0 animate-fade-up">
          <h1 className="heading-display text-foreground font-bold">
            Your Gift Is Discovered. Now It's Time to Inherit Your Freedom.
          </h1>

          <div className="space-y-4">
            <p className="body-text max-w-xl">
              You've taken the Five-Fold Gift Quiz. You know your five-fold gift. But knowing your gift isn't enough - you need the complete framework for walking in spiritual freedom, breaking generational patterns, and stepping into the life God designed for you.
            </p>
            <p className="text-lg text-foreground/90 italic font-normal" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Inherit Your Freedom by Pastor Mike Signorelli is your next step.
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-2xl md:text-3xl text-secondary font-normal tracking-tight" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              $47 <span className="text-base font-normal text-muted-foreground">- Special Ministry Bundle</span>
            </p>
            <p className="text-sm text-muted-foreground font-normal" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Includes bonus teaching video + guided prayer companion
            </p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-normal" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              Baker Books Published - Available Now
            </p>
          </div>

          <Button
            onClick={handleBuyNow}
            variant="hero"
            size="lg"
            className="h-auto min-h-14 py-3 px-5 sm:px-10 w-full sm:w-auto text-sm sm:text-base whitespace-normal text-center leading-snug gap-2"
          >
            Get Your Copy - $47 <ArrowRight size={18} className="shrink-0" />
          </Button>

          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
            {trustItems.map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                <Check size={14} className="text-secondary shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="opacity-0 animate-fade-up flex justify-center" style={{ animationDelay: "0.2s" }}>
          <div className="relative">
            <img
              src={bookCover}
              alt="Inherit Your Freedom by Pastor Mike Signorelli - 3D book mockup"
              className="w-full max-w-md drop-shadow-2xl"
            />
            <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground font-heading text-xs uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-lg">
              Baker Books Published
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IYFHeroSection;
