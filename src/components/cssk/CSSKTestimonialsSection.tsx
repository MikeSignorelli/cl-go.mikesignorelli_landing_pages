import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "I scored 14/45 on the audit. Bought the Starter Kit on the same day. Had the guest follow-up system running by the following Sunday. Three guests returned that week who would have disappeared. $97 was the best money I've spent on ministry in years.",
    author: "Pastor Chris",
    church: "Church of 130",
  },
  {
    quote:
      "The volunteer role descriptions alone saved me 20 hours. I used to spend a week trying to figure out what to put in them. Mike's templates were plug-and-play. Customized them in an afternoon.",
    author: "Pastor Angela",
    church: "Church of 190",
  },
  {
    quote:
      "The Church Calendar Strategy template changed how I plan my entire year. Instead of random sermon topics, I now have a seasonal rhythm. Fall attendance is up 30% since I started using it.",
    author: "Pastor James",
    church: "Church of 250",
  },
];

const CSSKTestimonialsSection = () => {
  return (
    <section className="section-padding bg-cream">
      <div className="max-w-6xl mx-auto">
        <h2 className="heading-section text-foreground text-center mb-16">
          What Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-background rounded-lg border border-border p-8 flex flex-col"
            >
              <Quote className="w-8 h-8 text-gold mb-4 shrink-0" />
              <p className="font-body text-sm md:text-base text-muted-foreground italic leading-relaxed flex-1 mb-6">
                "{t.quote}"
              </p>
              <div>
                <p className="font-heading font-bold text-foreground">{t.author}</p>
                <p className="font-body text-sm text-muted-foreground">{t.church}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CSSKTestimonialsSection;
