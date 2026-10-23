import { Quote } from "lucide-react";
import richardImg from "@/assets/testimonial-richard.webp";
import markImg from "@/assets/testimonial-mark.webp";
import sarahImg from "@/assets/testimonial-sarah.webp";

const testimonials = [
  {
    name: "Dr. Richard",
    title: "Neurosurgeon, Stanford MBA",
    image: richardImg,
    quote:
      "30 years as a Christian, 5 biblical tours, hundreds of theology books. Mike's teaching was the most intellectually rigorous biblical experience I've ever had. The depth was unmatched.",
  },
  {
    name: "Mark",
    title: "CFO, Fortune 500",
    image: markImg,
    quote:
      "I've built a portfolio worth $200M but had zero biblical framework for stewardship. Mike's Legacy Architecture Framework completely restructured my giving strategy. One conversation was worth more than 10 years of Sunday sermons.",
  },
  {
    name: "Sarah",
    title: "Real Estate Developer",
    image: sarahImg,
    quote:
      "Finally found other high-performers who take faith seriously. The peer community alone transformed how I engage my faith. I'm not alone anymore.",
  },
];

const IYFTestimonialsSection = () => {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto space-y-12">
        <h2 className="heading-section text-primary-foreground leading-snug text-center max-w-4xl mx-auto">
          Where Successful Professionals Go When Sunday Sermons Stop Challenging Them
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-sm border border-border bg-background p-8 flex flex-col items-center text-center space-y-6 shadow-lg"
            >
              <div
                className="w-24 h-24 rounded-full overflow-hidden"
                style={{ boxShadow: "0 0 0 2px hsl(var(--gold) / 0.4)" }}
              >
                <img
                  src={t.image}
                  alt={`${t.name} silhouette`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3
                  className="text-xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t.name}
                </h3>
                <p
                  className="text-sm font-medium mt-1"
                  style={{ color: "hsl(var(--gold))" }}
                >
                  {t.title}
                </p>
              </div>

              <div className="relative flex-1">
                <Quote
                  size={20}
                  className="mx-auto mb-3 opacity-30"
                  style={{ color: "hsl(var(--gold))" }}
                />
                <p className="body-text italic leading-relaxed">"{t.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IYFTestimonialsSection;
