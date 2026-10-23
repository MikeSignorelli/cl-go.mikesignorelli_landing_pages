import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "I took the Systems Audit thinking I'd score decently. I scored 12 out of 45. I was missing ALL THREE core systems. Six months later, after implementing the action plan: 175 to 265 attendance, 48-hour work weeks, and my wife says I'm a different person.",
    name: "Pastor Marcus",
    detail: "Rural Ohio, Church of 175",
  },
  {
    quote:
      "I found Mike through his marriage content. Took the audit because my wife was ready to leave. The audit revealed I was the bottleneck for everything - doing EVERYTHING myself. The 90-day action plan freed me to be a husband again. Church grew as a result.",
    name: "Pastor David",
    detail: "Suburban Texas, Church of 220",
  },
  {
    quote:
      "400 pastors flew to Mike's events last year. The Systems Audit is the free version of what we got in person. Take it. Be honest. Let it show you what you're missing. It's uncomfortable - and it's exactly what you need.",
    name: "Pastor Sarah",
    detail: "Urban California, Church Plant",
  },
];

const PSATestimonialsSection = () => {
  return (
    <section className="bg-background section-padding">
      <div className="container mx-auto max-w-6xl">
        <h2 className="heading-section text-primary text-center mb-14">
          What Pastors Are Saying
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-card border border-border rounded-xl p-8 flex flex-col"
            >
              <Quote className="w-8 h-8 text-secondary/30 mb-3 shrink-0" />
              <p className="font-body text-foreground/80 text-base leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div className="mt-auto pt-4 border-t border-border">
                <p className="font-heading text-primary font-bold text-sm">
                  {t.name}
                </p>
                <p className="font-body text-muted-foreground text-xs">
                  {t.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PSATestimonialsSection;
