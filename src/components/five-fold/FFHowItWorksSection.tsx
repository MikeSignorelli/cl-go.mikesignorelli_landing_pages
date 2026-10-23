import { Button } from "@/components/ui/button";
import { Compass, FileText, Map, Award } from "lucide-react";

const deliverables = [
  {
    icon: Compass,
    num: "01",
    title: "Your Primary Five-Fold Gift",
    desc: "Are you an Apostle (pioneering, planting, building new things)? A Prophet (hearing God, discerning truth, speaking boldly)? An Evangelist (sharing faith, drawing people in)? A Shepherd (caring for people, nurturing growth)? A Teacher (explaining Scripture, building understanding)? You'll know definitively.",
  },
  {
    icon: FileText,
    num: "02",
    title: "Your Gift Profile",
    desc: "A detailed explanation of what your gift means, how it manifests in daily life, what environments you thrive in, and how to develop it intentionally.",
  },
  {
    icon: Map,
    num: "03",
    title: "Your Activation Roadmap",
    desc: "Specific next steps for walking in your gift - including recommended Scripture study, serving opportunities, and growth practices aligned to YOUR gifting.",
  },
  {
    icon: Award,
    num: "04",
    title: "Your Five-Fold Identity Certificate",
    desc: "A personalized, shareable certificate confirming your five-fold gift. Download it, print it, share it with your community. Celebrate what God has placed in you.",
  },
];

interface FFHowItWorksSectionProps {
  onQuizOpen: () => void;
}

const FFHowItWorksSection = ({ onQuizOpen }: FFHowItWorksSectionProps) => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          Your Personalized Five-Fold Identity Results Include:
        </h2>
        <div className="w-16 h-0.5 bg-secondary mx-auto mb-16" />

        <div className="space-y-12 md:space-y-0 mb-16">
          {deliverables.map((d, i) => {
            const Icon = d.icon;
            const isEven = i % 2 === 0;
            return (
              <div
                key={d.num}
                className={`flex flex-col md:flex-row items-stretch ${!isEven ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`md:w-2/5 flex items-center justify-center py-10 md:py-16 bg-cream ${isEven ? 'md:rounded-l-lg' : 'md:rounded-r-lg'}`}>
                  <div className="text-center">
                    <span className="font-heading text-6xl md:text-7xl font-bold text-foreground/10 block leading-none">
                      {d.num}
                    </span>
                    <div className="w-14 h-14 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center mx-auto mt-4">
                      <Icon className="text-secondary" size={26} strokeWidth={1.6} />
                    </div>
                  </div>
                </div>
                <div className={`md:w-3/5 flex items-center p-8 md:p-12 border border-border ${isEven ? 'md:rounded-r-lg md:border-l-0' : 'md:rounded-l-lg md:border-r-0'}`}>
                  <div>
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-3">
                      {d.title}
                    </h3>
                    <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                      {d.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg" className="h-14 px-6 sm:px-10 text-sm sm:text-base w-full sm:w-auto" onClick={onQuizOpen}>
            <span className="hidden sm:inline">Take the Quiz Now - It's Free →</span>
            <span className="sm:hidden">Take the Quiz - Free →</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FFHowItWorksSection;
