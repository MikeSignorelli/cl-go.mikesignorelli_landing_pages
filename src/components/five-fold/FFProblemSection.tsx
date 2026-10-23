import { Target, ClipboardList, Trophy } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Discover",
    desc: "Your primary five-fold gift (Apostle, Prophet, Evangelist, Shepherd, or Teacher)",
  },
  {
    icon: ClipboardList,
    title: "Understand",
    desc: 'What your gift means, how it shows up in daily life, and why you\'ve felt "different"',
  },
  {
    icon: Trophy,
    title: "Activate",
    desc: "A personalized action plan for walking in your calling - plus your Five-Fold Identity Certificate",
  },
];

const FFProblemSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="heading-section text-center mb-8">
          You Were Created With a Specific Gift.
          <br />
          Do You Know What It Is?
        </h2>

        <div className="max-w-3xl mx-auto space-y-5 mb-14">
          <p className="body-text text-base md:text-lg leading-relaxed text-center">
            In Ephesians 4:11, Scripture reveals five distinct gifts given to the body of Christ - Apostle, Prophet, Evangelist, Shepherd, and Teacher. Each one represents a unique way God designed you to serve, lead, and impact the world around you.
          </p>
          <p className="body-text text-base md:text-lg leading-relaxed text-center">
            The problem? Most Christians have no idea which gift they carry. They feel called but confused. Passionate but directionless. They know God has a purpose for them - but they can't name it.
          </p>
          <p className="font-body text-lg md:text-xl font-semibold text-foreground text-center">
            This quiz changes that in under 5 minutes.
          </p>
          <p className="body-text text-base md:text-lg leading-relaxed text-center">
            The Five-Fold Gift quiz analyzes your personality, passions, and spiritual inclinations to reveal your primary five-fold gift - and gives you a personalized roadmap for activating it in your daily life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="text-center p-8 rounded-lg bg-card border border-border hover:border-secondary/40 transition-colors"
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                  <Icon className="text-secondary" size={24} strokeWidth={1.8} />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                  {v.title}
                </h3>
                <p className="body-text text-sm md:text-base">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FFProblemSection;
