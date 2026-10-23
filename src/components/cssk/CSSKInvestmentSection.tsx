import { X, Check, TrendingUp } from "lucide-react";

const CSSKInvestmentSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="heading-section text-foreground text-center mb-16">
          Why $97 Is the Best Investment Your Church Makes This Year
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8">
            <h3 className="font-heading text-xl font-bold text-foreground mb-6">
              Without these templates, you'll spend:
            </h3>
            <ul className="space-y-4">
              {[
                "40+ hours creating documents from scratch",
                "$2,000-$5,000 hiring a consultant to build them",
                "Months of trial and error figuring out what works",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span className="font-body text-sm md:text-base text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-gold/30 bg-gold/5 p-8">
            <h3 className="font-heading text-xl font-bold text-foreground mb-6">
              With the Starter Kit ($97):
            </h3>
            <ul className="space-y-4">
              {[
                "Download and customize in a weekend",
                "Start implementing Monday morning",
                "Built by the pastor behind the fastest-growing church - proven at scale",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span className="font-body text-sm md:text-base text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rounded-lg bg-brand p-8 md:p-10 text-center">
          <TrendingUp className="w-8 h-8 text-gold mx-auto mb-4" />
          <p className="font-heading text-lg md:text-xl font-semibold text-primary-foreground leading-relaxed max-w-3xl mx-auto">
            <span className="text-gold">The ROI:</span> If ONE new guest returns because of your follow-up system, and that person tithes $50/week - that's{" "}
            <span className="text-gold font-bold">$2,600/year</span> from a $97 investment. The kit pays for itself in the first month.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CSSKInvestmentSection;
