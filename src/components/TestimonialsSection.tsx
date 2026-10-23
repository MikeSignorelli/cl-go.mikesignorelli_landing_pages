import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Standing on Mars Hill while Mike taught Acts 17 was the single most powerful biblical experience of my life. I have read that chapter a hundred times. I will never read it the same way again. This trip changed everything.",
  },
  {
    quote:
      "My husband and I were nervous about the cost. It was worth every penny and more. The hotels were beautiful, the cruise was incredible, and the biblical teaching at each site gave us a deeper understanding of Scripture we could not have gotten any other way. We are already planning to go again.",
  },
  {
    quote:
      "The moment we stood at the river in Philippi where Lydia was baptized, I wept. The Holy Spirit met us there in a way I cannot describe. If you are on the fence, get off it. This trip will mark your life.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-muted">
      <div className="max-w-5xl mx-auto">
        <h2 className="heading-section text-foreground text-center mb-16">
          What Past Tour Travelers Are Saying
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-card rounded-sm p-8 shadow-md border border-border relative"
            >
              <Quote size={28} className="text-gold/30 mb-4" />
              <p className="font-body text-foreground/80 text-sm leading-relaxed italic mb-6">
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-xs font-body mt-10 italic">
          Note: Replace placeholder names with actual testimonials from Mike's previous tour participants.
        </p>
      </div>
    </section>
  );
};

export default TestimonialsSection;
