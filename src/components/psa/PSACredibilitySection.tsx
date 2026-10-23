import { CheckCircle } from "lucide-react";
import mikePhoto from "@/assets/psa/mike-signorelli.webp";

const stats = [
  "Fastest-growing church in America - 5 consecutive years",
  "Multi-campus operation - 100-person staff",
  "200+ volunteers - 98% retention rate",
  "Work 45 hours/week - not 75",
  "Thriving marriage - weekly date nights, non-negotiable",
  "1.6M YouTube subscribers - organic proof of teaching quality",
  "TBN weekly show - reaching 3 million viewers",
  "Baker Books published - Inherit Your Freedom, Fire Starters",
];

const PSACredibilitySection = () => {
  return (
    <section className="bg-primary section-padding">
      <div className="container mx-auto max-w-6xl">
        <h2 className="heading-section text-primary-foreground text-center mb-14 max-w-3xl mx-auto">
          I'm Not a Consultant.{" "}
          <span className="text-secondary">I Built What I Teach.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden border-2 border-secondary/30">
              <img
                src={mikePhoto}
                alt="Pastor Mike Signorelli"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <p className="font-body text-primary-foreground/70 text-lg leading-relaxed mb-2">
              Most church growth consultants either never pastored or pastored a church of 75. They teach theory.
            </p>
            <p className="font-heading text-secondary text-xl font-bold mb-6">
              I teach practice.
            </p>

            <ul className="space-y-3 mb-8">
              {stats.map((stat) => (
                <li key={stat} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="font-body text-primary-foreground/80 text-sm leading-relaxed">
                    {stat}
                  </span>
                </li>
              ))}
            </ul>

            <p className="font-body text-primary-foreground/70 text-base leading-relaxed mb-6">
              The Guest Experience Engine? I built it. The Volunteer Pipeline? I scaled it. The Leadership Pathway? I developed it. The Church Calendar Strategy? I used it every single year.
            </p>

            <p className="font-body text-primary-foreground/90 text-base leading-relaxed italic border-l-2 border-secondary pl-4">
              The Systems Audit is based on the exact diagnostic I run on my own church quarterly. Now it's available to you - free.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PSACredibilitySection;
