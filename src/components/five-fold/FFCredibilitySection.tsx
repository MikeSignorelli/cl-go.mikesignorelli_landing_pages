import churchCrowd from "@/assets/five-fold/church-crowd.webp";

const testimonials = [
  {
    quote: "I took this quiz thinking I already knew my gift. I was wrong. Turns out I've been trying to operate as an evangelist when I'm actually a teacher. Everything clicked. I finally understand why certain things felt so forced.",
    author: "Jessica M., Mom of 3, Ohio",
  },
  {
    quote: "The Five-Fold Identity Certificate is hanging on my wall. It sounds small, but having it in writing - 'You are a Prophet' - changed how I see myself and my faith. I'm not weird. I'm gifted.",
    author: "David R., Recent Convert, Texas",
  },
  {
    quote: "My husband and I both took the quiz. He's a Shepherd, I'm an Apostle. For the first time, we understand why we approach faith differently - and how we complement each other. This should be required for every Christian.",
    author: "Maria L., Married 8 Years, Florida",
  },
];

const FFCredibilitySection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
          What People Are Saying
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          <div className="relative rounded-[10px] overflow-hidden">
            <img
              src={churchCrowd}
              alt="Mike Signorelli leading a packed church service"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            {testimonials.map((t) => (
              <blockquote
                key={t.author}
                className="bg-cream rounded-lg p-6 md:p-8 border-l-4 border-secondary"
              >
                <p className="font-body text-sm md:text-base text-foreground/90 italic leading-relaxed mb-4">
                  "{t.quote}"
                </p>
                <cite className="font-body text-sm font-semibold text-secondary not-italic">
                  - {t.author}
                </cite>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FFCredibilitySection;
