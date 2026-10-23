import { ShieldCheck } from "lucide-react";

const CSSKGuaranteeSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <ShieldCheck className="w-12 h-12 text-gold mx-auto mb-6" />
        <h2 className="heading-section text-foreground mb-6">Guarantee</h2>
        <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
          <span className="font-heading font-bold text-foreground">100% Money-Back Guarantee:</span>{" "}
          Download the kit. Use the templates. If they don't help you build at least one system within 30 days, email us for a full refund.
        </p>
      </div>
    </section>
  );
};

export default CSSKGuaranteeSection;
