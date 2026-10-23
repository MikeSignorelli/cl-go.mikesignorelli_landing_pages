import { Check, X } from "lucide-react";

const forList = [
  "Pastors leading churches of 50-500 people experiencing a growth plateau",
  "Pastors working 60-80 hours/week doing everything themselves",
  "Pastors whose marriages are suffering under ministry pressure",
  "Pastors with a deep calling and a heart for their people who sense a gap between the vision God gave them and the systems they have to carry it out",
  "Pastors who've attended conferences but can't implement what they learned",
  "Church planters in years 2-7 hitting their first structural ceiling",
];

const notForList = [
  "Pastors looking for quick fixes (systems take 90 days to build)",
  "Pastors who aren't willing to change how they lead (systems require delegation)",
  "Megachurch pastors with established executive teams (this is for 50-500)",
];

const PSAWhoIsItForSection = () => {
  return (
    <section className="bg-primary section-padding">
      <div className="container mx-auto max-w-5xl">
        <h2 className="heading-section text-primary-foreground text-center mb-16">
          Who This Is For
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {forList.map((item) => (
            <div
              key={item}
              className="flex items-start gap-4 bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-5 hover:bg-primary-foreground/10 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span className="font-body text-primary-foreground/85 text-sm leading-relaxed">
                {item}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-primary-foreground/10" />
          <p className="font-heading text-primary-foreground/40 text-xs font-semibold uppercase tracking-widest">
            Not for
          </p>
          <div className="flex-1 h-px bg-primary-foreground/10" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {notForList.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-lg p-4 border border-primary-foreground/5 bg-primary-foreground/[0.02]"
            >
              <div className="w-6 h-6 rounded-full bg-destructive/15 flex items-center justify-center shrink-0 mt-0.5">
                <X className="w-3.5 h-3.5 text-destructive/70" />
              </div>
              <span className="font-body text-primary-foreground/40 text-sm leading-relaxed">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PSAWhoIsItForSection;
