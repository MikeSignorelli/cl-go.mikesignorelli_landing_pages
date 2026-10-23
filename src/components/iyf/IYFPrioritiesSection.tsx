const businessItems = [
  { label: "MBA", value: "$150,000" },
  { label: "Executive Coaching", value: "$50,000" },
  { label: "Business Conferences", value: "$30,000" },
  { label: "Leadership Programs", value: "$20,000" },
];

const biblicalItems = [
  { label: "Books", value: "$500" },
  { label: "Courses", value: "$0" },
  { label: "Experiences", value: "$1,000" },
  { label: "Assessment", value: "$0" },
];

const IYFPrioritiesSection = () => {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="max-w-5xl mx-auto space-y-12">
        <h2 className="heading-section text-primary-foreground leading-snug text-center">
          A Quick Audit of Your Priorities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-sm border border-border bg-background p-8 space-y-6">
            <h3
              className="text-lg font-bold text-foreground uppercase tracking-wide text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Business Education Investment
            </h3>
            <div className="space-y-4">
              {businessItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-border pb-3">
                  <span className="body-text">{item.label}</span>
                  <span className="font-bold text-foreground text-lg">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2">
              <span
                className="font-bold text-foreground uppercase tracking-wide"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Total
              </span>
              <span
                className="text-2xl font-bold"
                style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-heading)" }}
              >
                $250,000
              </span>
            </div>
          </div>

          <div className="rounded-sm border border-border bg-background p-8 space-y-6">
            <h3
              className="text-lg font-bold text-foreground uppercase tracking-wide text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Biblical Depth Investment
            </h3>
            <div className="space-y-4">
              {biblicalItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-border pb-3">
                  <span className="body-text">{item.label}</span>
                  <span className="font-bold text-foreground text-lg">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2">
              <span
                className="font-bold text-foreground uppercase tracking-wide"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Total
              </span>
              <span
                className="text-2xl font-bold text-muted-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                $1,500
              </span>
            </div>
          </div>
        </div>

        <p
          className="text-xl md:text-2xl font-bold italic text-center max-w-3xl mx-auto leading-relaxed"
          style={{
            fontFamily: "var(--font-body)",
            color: "hsl(var(--gold))",
          }}
        >
          "You've invested 167x more in business mastery than biblical depth. Then you wonder
          why Sunday sermons feel shallow. The investment gap IS the depth gap. Close it."
        </p>
      </div>
    </section>
  );
};

export default IYFPrioritiesSection;
