const IYFVideoSection = () => {
  return (
    <section className="section-padding bg-primary">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-foreground/90">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center border-2"
              style={{
                borderColor: "hsl(var(--gold))",
                backgroundColor: "hsl(var(--gold) / 0.15)",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                style={{ color: "hsl(var(--gold))" }}
              >
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </div>
            <p
              className="text-primary-foreground/60 text-sm uppercase tracking-[0.15em] font-semibold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Video Coming Soon
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IYFVideoSection;
