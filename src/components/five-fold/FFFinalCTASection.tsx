import { Button } from "@/components/ui/button";

interface FFFinalCTASectionProps {
  onQuizOpen: () => void;
}

const FFFinalCTASection = ({ onQuizOpen }: FFFinalCTASectionProps) => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="heading-display mb-6 text-foreground">You Were Created With a Gift. It's Time to Discover It.</h2>
        <p className="font-body text-lg mb-10 text-muted-foreground">
          20 questions. Under 5 minutes. Your five-fold gift revealed - plus your personalized Five-Fold Identity Certificate.
        </p>
        <Button
          variant="hero"
          size="lg"
          className="h-auto min-h-12 py-3 px-4 sm:px-10 w-full sm:w-auto text-sm sm:text-base whitespace-normal text-center leading-snug"
          onClick={onQuizOpen}
        >
          Take the Five-Fold Gift Quiz - Free →
        </Button>
        <p className="font-body text-sm text-muted-foreground mt-6">
          Join 10,000+ Christians who've already discovered their gift
        </p>
      </div>
    </section>
  );
};

export default FFFinalCTASection;
