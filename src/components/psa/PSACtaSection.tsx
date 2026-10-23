import { usePSAQuiz } from "@/context/PSAQuizContext";

const PSACtaSection = () => {
  const { openQuiz } = usePSAQuiz();

  return (
    <section className="bg-primary section-padding">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="heading-section text-primary-foreground mb-6">
          Systems Over Hustle.{" "}
          <span className="text-secondary">Structure Over Burnout.</span>{" "}
          Both/And Over Either/Or.
        </h2>

        <p className="font-body text-primary-foreground/70 text-lg leading-relaxed mb-10">
          30 questions. 5 minutes. Your church's growth barriers - identified, prioritized, and addressed.
        </p>

        <button onClick={openQuiz} className="btn-cta text-base mb-6 inline-flex">
          Take the Free Systems Audit →
        </button>

        <p className="font-body text-primary-foreground/40 text-sm mt-6">
          Join 400+ pastors who've already diagnosed their growth barriers
        </p>
      </div>
    </section>
  );
};

export default PSACtaSection;
