import { DoorOpen, Users, HardHat } from "lucide-react";
import { usePSAQuiz } from "@/context/PSAQuizContext";

const systems = [
  {
    icon: DoorOpen,
    label: "System 1",
    title: "The Guest Experience Engine",
    quote: "Close the back door before you open the front door wider",
    pipeline: ["First-time guest identification", "24-hour follow-up", "Second-visit trigger", "Assimilation pathway", "Guest becomes regular becomes member"],
    without: "Guests visit once and disappear. You have no idea who came or if they'll return.",
    withIt: "40%+ guest return rate. Predictable growth from every Sunday.",
  },
  {
    icon: Users,
    label: "System 2",
    title: "The Volunteer Pipeline",
    quote: "Stop begging for volunteers - build a pipeline that produces them",
    pipeline: ["Recruitment", "Training", "Deployment", "Development", "Recognition"],
    without: "Volunteers burn out in 3 months. You do everything yourself. Capacity ceiling.",
    withIt: "85%+ volunteer retention. Delegated operations. Capacity to grow.",
  },
  {
    icon: HardHat,
    label: "System 3",
    title: "The Leadership Pathway",
    quote: "Every growing church needs a clear path from attendee to leader",
    pipeline: ["Attendee", "Volunteer", "Team Leader", "Ministry Leader", "Staff"],
    without: "You're the only real leader. Everything bottlenecks through you. 75-hour weeks.",
    withIt: "Emerging leaders at every level. Distributed decision-making. 45-50 hour weeks.",
  },
];

const PSASystemsSection = () => {
  const { openQuiz } = usePSAQuiz();
  return (
    <section className="bg-background section-padding">
      <div className="container mx-auto max-w-6xl">
        <h2 className="heading-section text-primary text-center mb-4 max-w-4xl mx-auto">
          Every Growing Church Has These 3 Systems.{" "}
          <br />
          <span className="text-secondary">Most Plateaued Churches Have Zero.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-14">
          {systems.map((system) => (
            <div
              key={system.label}
              className="bg-card border border-border rounded-xl p-6 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <system.icon className="w-5 h-5 text-secondary" />
                </div>
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-secondary">
                  {system.label}
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-primary mb-2">
                {system.title}
              </h3>
              <p className="font-body text-sm italic text-muted-foreground mb-4">
                "{system.quote}"
              </p>

              <div className="flex flex-wrap items-center gap-1.5 mb-5 text-xs font-body text-foreground/80">
                {system.pipeline.map((step, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">
                      {step}
                    </span>
                    {i < system.pipeline.length - 1 && (
                      <span className="text-secondary font-bold">→</span>
                    )}
                  </span>
                ))}
              </div>

              <div className="mt-auto space-y-3">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="font-body text-sm">
                    <span className="font-bold text-destructive">Without it: </span>
                    <span className="text-foreground/70">{system.without}</span>
                  </p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="font-body text-sm">
                    <span className="font-bold text-green-600">With it: </span>
                    <span className="text-foreground/70">{system.withIt}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="font-body text-center text-muted-foreground max-w-3xl mx-auto mb-8 text-lg italic">
          "The Systems Audit diagnoses which of these 3 you're missing - and in what order to build them. Take it free. 5 minutes."
        </p>

        <div className="text-center">
          <button onClick={openQuiz} className="btn-cta text-base">
            Take the Systems Audit Now →
          </button>
        </div>
      </div>
    </section>
  );
};

export default PSASystemsSection;
