import { RefreshCw, Frown, BookOpen, HelpCircle } from "lucide-react";

const painPoints = [
  {
    icon: RefreshCw,
    title: "You feel called but can't name the calling.",
    desc: "You know God has something for you, but you can't articulate what it is. Every time someone asks \"What's your ministry?\" you freeze.",
  },
  {
    icon: Frown,
    title: "You compare yourself to other Christians.",
    desc: "You see people on fire for God in ways that don't resonate with you. You wonder: \"Why can't I be like them?\" - not realizing your gift is DIFFERENT, not lesser.",
  },
  {
    icon: BookOpen,
    title: "You've been trying to operate in someone else's gift.",
    desc: "Maybe you've been told to evangelize when you're actually a teacher. Or forced into shepherding when you're wired as a prophet. No wonder it feels exhausting.",
  },
  {
    icon: HelpCircle,
    title: "You lack direction for your spiritual growth.",
    desc: "Without knowing your gift, every Bible study, every serving opportunity, every ministry involvement feels random. With it? Everything clicks.",
  },
];

const FFSolutionSection = () => {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto">
        <h2 className="heading-section text-center mb-16 text-primary-foreground">
          You're Not Confused About Your Faith.<br className="hidden md:block" /> You're Uninformed About Your Gift.
        </h2>

        <div className="space-y-0 mb-16">
          {painPoints.map((p, i) => {
            const Icon = p.icon;
            const isLast = i === painPoints.length - 1;
            return (
              <div
                key={p.title}
                className={`flex gap-6 md:gap-8 py-8 ${!isLast ? 'border-b border-primary-foreground/10' : ''}`}
              >
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-md bg-secondary/20 flex items-center justify-center">
                    <Icon className="text-secondary" size={20} strokeWidth={1.8} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg md:text-xl font-bold mb-2 text-primary-foreground">
                    {p.title}
                  </h3>
                  <p className="font-body text-sm md:text-base leading-relaxed text-primary-foreground/65">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <blockquote className="relative text-center max-w-3xl mx-auto py-10 px-6">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-12 h-[2px] bg-secondary" />
          <p className="font-body text-lg md:text-xl italic leading-relaxed text-primary-foreground/90">
            "When you discover your five-fold gift, everything you've experienced in your faith suddenly makes sense. The confusion lifts. The direction appears. And you stop trying to be someone you were never meant to be."
          </p>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-12 h-[2px] bg-secondary" />
        </blockquote>
      </div>
    </section>
  );
};

export default FFSolutionSection;
