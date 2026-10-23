import { ArrowRight } from "lucide-react";

const IYFFinalCtaSection = () => {
  return (
    <section className="section-padding" style={{ backgroundColor: "hsl(30 10% 20%)" }}>
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h2
          className="heading-section leading-snug"
          style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-heading)" }}
        >
          Your Gift Is Discovered. Your Freedom Is Next.
        </h2>

        <a
          href="/inherit-your-freedom/shop"
          className="inline-flex items-center justify-center gap-2 min-h-14 h-auto py-3 px-5 sm:px-10 w-full sm:w-auto max-w-full rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body font-semibold uppercase tracking-widest text-xs sm:text-sm leading-snug text-center whitespace-normal transition-all duration-300"
        >
          Inherit Your Freedom - $47
          <ArrowRight size={18} className="shrink-0" />
        </a>
      </div>
    </section>
  );
};

export default IYFFinalCtaSection;
