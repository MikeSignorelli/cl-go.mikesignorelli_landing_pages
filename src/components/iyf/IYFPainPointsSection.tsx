import { Unlock, Fingerprint, Swords, Building2, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const chapters: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Unlock,
    title: "Breaking Generational Curses",
    description:
      "Your family passed down more than DNA. Patterns of addiction, anger, poverty, and dysfunction travel through generations. This chapter reveals the biblical framework for identifying and breaking inherited spiritual bondage.",
  },
  {
    icon: Fingerprint,
    title: "Discovering Your True Identity",
    description:
      "You've spent years defined by your past - what you did, what was done to you, what your family taught you about yourself. This chapter shows you who God says you are versus who your history says you are.",
  },
  {
    icon: Swords,
    title: "Practical Spiritual Warfare",
    description:
      "Not theoretical. Not scary. Practical strategies for daily spiritual freedom - prayer models, declarations, and disciplines that keep you free after you've been freed.",
  },
  {
    icon: Building2,
    title: "Building the Life God Designed",
    description:
      "Freedom without structure collapses. This chapter gives you the daily practices, rhythms, and habits that sustain lasting transformation.",
  },
  {
    icon: Users,
    title: "Generational Legacy",
    description:
      "Your breakthrough isn't just for you. It's for your children and their children. This chapter shows you how to become the generation that breaks the cycle and builds something new.",
  },
];

const IYFPainPointsSection = () => {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto space-y-12">
        <h2 className="heading-section text-primary-foreground leading-snug text-center">
          Inherit Your Freedom: What's Inside
        </h2>

        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {chapters.map((chapter, index) => (
            <div
              key={index}
              className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-6 md:p-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-6 hover:bg-primary-foreground/10 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 md:flex-col md:items-center md:gap-2 md:min-w-[80px] shrink-0">
                <div
                  className="w-11 h-11 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: "hsl(var(--gold) / 0.15)" }}
                >
                  <chapter.icon
                    size={22}
                    style={{ color: "hsl(var(--gold))" }}
                    strokeWidth={1.8}
                  />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
                  Chapter {index + 1}
                </span>
              </div>
              <div className="space-y-2">
                <h3
                  className="font-bold text-primary-foreground text-lg leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {chapter.title}
                </h3>
                <p className="text-primary-foreground/65 font-body text-sm leading-relaxed">
                  {chapter.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IYFPainPointsSection;
