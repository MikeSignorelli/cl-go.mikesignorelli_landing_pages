import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "I bought this book after taking the Five-Fold Gift Quiz. I'm a Shepherd - but I've been living in bondage my whole life. Chapter 3 on spiritual warfare literally broke something in me during prayer. I'm different now.",
    name: "Rachel T.",
    detail: "Mom of 2, Georgia",
  },
  {
    quote:
      "Mike doesn't just talk about freedom - he gives you the TOOLS. The declarations, the prayers, the daily practices. This isn't a feel-good book. It's a manual for breakthrough.",
    name: "Anthony K.",
    detail: "New Believer, Illinois",
  },
  {
    quote:
      "I've read 50+ Christian books. This one is different. It's not theoretical - it's practical. I implemented the Chapter 4 daily rhythms and haven't missed a day in 60 days.",
    name: "Sandra W.",
    detail: "3-Year Christian, Michigan",
  },
];

const IYFDepthSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-6xl mx-auto space-y-12">
        <h2 className="heading-section text-foreground leading-snug text-center">
          What Readers Are Saying
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-sm border border-border bg-card p-8 space-y-5 flex flex-col"
            >
              <Quote
                size={28}
                style={{ color: "hsl(var(--gold))" }}
                strokeWidth={1.5}
              />
              <p
                className="text-foreground/80 leading-relaxed flex-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                "{t.quote}"
              </p>
              <div>
                <p
                  className="font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t.name}
                </p>
                <p className="text-sm text-muted-foreground">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IYFDepthSection;
