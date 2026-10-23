import heroPastor from "@/assets/psa/hero-pastor.webp";
import { usePSAQuiz } from "@/context/PSAQuizContext";

const PSAHeroSection = () => {
  const { openQuiz } = usePSAQuiz();
  return (
    <section id="audit" className="bg-primary relative overflow-hidden">
      <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="heading-display text-primary-foreground mb-6">
              Is Your Church Built to Scale?{" "}
              <span className="text-secondary">Take the Free Systems Audit</span>{" "}
              and Find Out in 5 Minutes.
            </h1>
            <p className="font-body text-base md:text-lg leading-relaxed text-primary-foreground/70 mb-8 max-w-xl">
              The Church Systems Diagnostic reveals exactly which of the 3 Core Systems your church is missing - and gives you a prioritized action plan for breaking through your growth plateau. From the pastor who built the fastest-growing church in America 5 years running.
            </p>
            <button onClick={openQuiz} className="btn-cta text-base mb-8 inline-block">
              Take the Free Systems Audit →
            </button>

            <div className="grid grid-cols-2 gap-3 max-w-md">
              {[
                "Free - no credit card",
                "Takes under 5 minutes",
                "Personalized results + action plan",
                "Used by 400+ pastors",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5 text-sm">✓</span>
                  <span className="font-body text-xs text-primary-foreground/60">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src={heroPastor}
                alt="Confident pastor with organized church systems"
                width={896}
                height={1152}
                className="w-full h-72 md:h-96 lg:h-[28rem] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 bg-primary/30">
        <div className="container mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
            {[
              "Fastest-Growing Church in America - 5 Consecutive Years",
              "100-Person Staff",
              "Multi-Campus",
              "1.6M YouTube",
              "TBN Weekly",
              "Thriving Marriage",
            ].map((item, i) => (
              <span key={item} className="flex items-center gap-3">
                <span className="font-heading text-xs md:text-sm text-primary-foreground/50 font-medium tracking-wide">
                  {item}
                </span>
                {i < 5 && <span className="text-secondary/40 hidden md:inline">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PSAHeroSection;
