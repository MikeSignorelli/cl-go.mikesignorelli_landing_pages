import { ArrowRight, Calendar, Users, Crown, MapPin } from "lucide-react";
import greeceTourImage from "@/assets/greece-tour.webp";

const details = [
  { icon: Calendar, text: "10 days | Mars Hill, Corinth, Philippi, Thessalonica" },
  { icon: Users, text: "20 people maximum" },
  { icon: Crown, text: "VIP tier: Private dinners with Mike + Legacy Consultation" },
  { icon: MapPin, text: "Next tour: August 2026" },
];

const IYFGreeceTourSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={greeceTourImage}
          alt="Ancient ruins of Mars Hill in Athens, Greece at golden hour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/75" />
      </div>

      <div className="relative section-padding">
        <div className="max-w-4xl mx-auto space-y-10 text-center">
          <h2
            className="heading-section leading-snug"
            style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-heading)" }}
          >
            Don't Read About Where Paul Walked. Stand There. Study There. Be Transformed There.
          </h2>

          <p
            className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
            style={{ color: "hsl(40 20% 90%)", fontFamily: "var(--font-body)" }}
          >
            After taking your Spiritual Depth Assessment, you may discover that what you need
            isn't more content - it's an immersive experience. The Greece Biblical Tour is 10
            days studying Scripture where it was written, with teaching at your intellectual
            level, in a group of 20 people seeking the same depth.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            {details.map((d, i) => (
              <div key={i} className="flex gap-3 items-center">
                <d.icon
                  size={18}
                  className="flex-shrink-0"
                  style={{ color: "hsl(var(--gold))" }}
                  strokeWidth={1.8}
                />
                <span
                  className="text-sm md:text-base"
                  style={{ color: "hsl(40 20% 85%)" }}
                >
                  {d.text}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-6 pt-4">
            <a
              href="https://go.mikesignorelli.com/greece-turkey-tour"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-sm text-lg font-bold border-2 transition-all duration-300 hover:bg-white/10"
              style={{
                fontFamily: "var(--font-heading)",
                borderColor: "hsl(var(--gold))",
                color: "hsl(var(--gold))",
              }}
            >
              Learn About the Greece Tour
              <ArrowRight size={20} />
            </a>

            <p
              className="text-base italic"
              style={{ color: "hsl(40 20% 70%)", fontFamily: "var(--font-body)" }}
            >
              Start with the free assessment. See where your depth gap is. Then decide how
              deep you want to go.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IYFGreeceTourSection;
