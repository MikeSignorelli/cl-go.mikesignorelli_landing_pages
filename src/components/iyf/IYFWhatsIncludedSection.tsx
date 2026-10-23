import { BookOpen, Play, HandHeart, ArrowRight } from "lucide-react";

const items = [
  {
    icon: BookOpen,
    title: "Inherit Your Freedom - Full Book",
    description: "Baker Books Published",
  },
  {
    icon: Play,
    title: 'Bonus Teaching Video: "The Five-Fold Freedom Framework"',
    description:
      "Exclusive to this bundle, connecting your Five-Fold Gift Quiz result to your freedom journey",
  },
  {
    icon: HandHeart,
    title: "Guided Prayer Companion",
    description: "7-day prayer guide aligned to each chapter theme",
  },
];

const IYFWhatsIncludedSection = () => {
  return (
    <section className="section-padding bg-primary">
      <div className="max-w-3xl mx-auto space-y-10 text-center">
        <h2 className="heading-section text-primary-foreground leading-snug">
          What's Included
        </h2>

        <div className="space-y-6 text-left">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex gap-5 items-start bg-primary-foreground/5 border border-primary-foreground/10 rounded-sm p-6"
            >
              <div
                className="flex-shrink-0 w-11 h-11 rounded-md flex items-center justify-center"
                style={{ backgroundColor: "hsl(var(--gold) / 0.15)" }}
              >
                <item.icon
                  size={22}
                  style={{ color: "hsl(var(--gold))" }}
                  strokeWidth={1.8}
                />
              </div>
              <div>
                <h3
                  className="font-bold text-primary-foreground text-lg"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>
                <p className="text-primary-foreground/65 text-sm mt-1" style={{ fontFamily: "var(--font-body)" }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p
          className="text-primary-foreground/80 text-lg font-semibold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          $47 + $6.99 shipping - Ships within 3-5 business days
        </p>

        <a
          href="/inherit-your-freedom/shop"
          className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body font-semibold uppercase tracking-widest text-sm transition-all duration-300"
        >
          Get Your Copy - $47
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};

export default IYFWhatsIncludedSection;
