import { BarChart3, Target, Building2, ListChecks, Heart } from "lucide-react";
import { usePSAQuiz } from "@/context/PSAQuizContext";

const reveals = [
  {
    icon: BarChart3,
    number: "1",
    title: "Your Systems Score",
    description:
      "Rated across the 3 Core Systems every growing church needs: Guest Experience, Volunteer Pipeline, and Leadership Development. Where are you strong? Where are the gaps?",
  },
  {
    icon: Target,
    number: "2",
    title: "Your #1 Bottleneck",
    description:
      "The single biggest structural gap holding your church back. Not vague advice - the specific system you need to build FIRST.",
  },
  {
    icon: Building2,
    number: "3",
    title: "Your Church Size Blueprint",
    description:
      "Customized to your current attendance (under 100, 100-200, 200-300, 300-500). Because a church of 150 needs different systems than a church of 350.",
  },
  {
    icon: ListChecks,
    number: "4",
    title: "Your 90-Day Priority Action Plan",
    description:
      "3 specific steps to take in the next 90 days, ranked by impact. Actionable, implementable, and sequential - designed for pastors who are ready to build, not just learn.",
  },
  {
    icon: Heart,
    number: "5",
    title: "Your Marriage Health Indicator",
    description:
      "Because if your marriage is suffering under ministry pressure, no systems strategy will work until that's addressed. The audit includes the 7 Pillars quick-check.",
  },
];

const PSAAuditRevealSection = () => {
  const { openQuiz } = usePSAQuiz();
  return (
    <section className="bg-primary section-padding">
      <div className="container mx-auto max-w-5xl">
        <h2 className="heading-section text-primary-foreground text-center mb-4 max-w-3xl mx-auto">
          The Church Systems Diagnostic:{" "}
          <br />
          <span className="text-secondary">30 Questions. 5 Minutes. Complete Clarity.</span>
        </h2>

        <p className="subheading text-center mb-12">What the Audit Reveals</p>

        <div className="space-y-5 mb-14">
          {reveals.map((item) => (
            <div
              key={item.number}
              className="flex items-start gap-5 bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-6 hover:bg-primary-foreground/10 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <item.icon className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg font-bold text-primary-foreground mb-1">
                  <span className="text-secondary mr-2">{item.number}.</span>
                  {item.title}
                </h3>
                <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button onClick={openQuiz} className="btn-cta text-base">
            Take the Free Audit → Discover Your Gaps
          </button>
        </div>
      </div>
    </section>
  );
};

export default PSAAuditRevealSection;
