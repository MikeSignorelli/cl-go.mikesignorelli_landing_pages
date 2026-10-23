const IYFAssessmentSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-4xl mx-auto space-y-8 text-center">
        <h2 className="heading-section text-foreground leading-snug">
          You Discovered Your Gift.<br />Now Remove What's Blocking It.
        </h2>

        <div className="space-y-6 text-left">
          <p className="body-text">
            The Five-Fold Gift Quiz revealed your five-fold gift. But here's what the quiz can't show you: <strong className="text-foreground">the generational patterns, spiritual bondage, and false identities that are preventing you from fully walking in that gift.</strong>
          </p>

          <p className="body-text">
            You know you're a [Teacher/Prophet/Evangelist/etc.]. But you're still carrying patterns from your family that hold you back. You still hear the voice that says "you're not good enough" or "people like you don't do that."
          </p>

          <p className="body-text">
            <em>Inherit Your Freedom</em> gives you the complete framework for removing every obstacle between who you are and who God called you to be.
          </p>

          <p
            className="text-lg md:text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Your gift was free to discover. Your freedom costs $47 to unlock.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IYFAssessmentSection;
