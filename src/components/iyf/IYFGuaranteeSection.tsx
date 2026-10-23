import { ShieldCheck } from "lucide-react";

const IYFGuaranteeSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <ShieldCheck
          size={48}
          style={{ color: "hsl(var(--gold))" }}
          strokeWidth={1.5}
          className="mx-auto"
        />
        <h2 className="heading-section text-foreground leading-snug">
          100% Satisfaction Guarantee
        </h2>
        <p className="body-text max-w-2xl mx-auto">
          Read the book. If it doesn't change how you think about your spiritual freedom, email our team within 30 days for a full refund. No questions asked.
        </p>
      </div>
    </section>
  );
};

export default IYFGuaranteeSection;
