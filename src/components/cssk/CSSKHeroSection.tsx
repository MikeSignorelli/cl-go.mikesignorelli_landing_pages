const CSSKHeroSection = () => {
  return (
    <section className="relative bg-primary text-primary-foreground pt-[80px]">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/50 to-transparent pointer-events-none" />
      <div className="relative z-10 section-padding flex flex-col items-center text-center max-w-4xl mx-auto">
        <h1 className="heading-display text-primary-foreground mb-6 animate-fade-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
          Your Systems Audit Revealed the Gaps. The Starter Kit Closes Them.
        </h1>
        <p className="font-body text-lg md:text-xl leading-relaxed text-primary-foreground/80 max-w-3xl mb-8 animate-fade-up" style={{ animationDelay: "0.35s", opacity: 0 }}>
          Every template, script, and tool for all 3 Core Systems - plug-and-play, customizable to your church, ready to implement this week. From the pastor who built the fastest-growing church in America.
        </p>
        <p className="font-heading text-sm md:text-base font-medium tracking-wide text-gold mb-10 animate-fade-up" style={{ animationDelay: "0.45s", opacity: 0 }}>
          $97 - One-time purchase&nbsp;&nbsp;|&nbsp;&nbsp;Instant digital access&nbsp;&nbsp;|&nbsp;&nbsp;Lifetime updates
        </p>
        <a
          href="#get-kit"
          className="btn-cta sm:!px-10 sm:!py-5 sm:text-lg w-full sm:w-auto animate-fade-up"
          style={{ animationDelay: "0.55s", opacity: 0 }}
        >
          Get the Starter Kit - $97 →
        </a>
      </div>
    </section>
  );
};

export default CSSKHeroSection;
