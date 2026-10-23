import { Building, Clock, HeartCrack, DoorOpen } from "lucide-react";

const painPoints = [
  {
    icon: Building,
    title: "Stuck at 100-300 for 1+ years",
    description:
      "Attendance flat despite your faithfulness and sacrifice. You watch other pastors grow and wonder: \"What do they know that I don't?\"",
  },
  {
    icon: Clock,
    title: "Working 70-80 hours/week",
    description:
      "You do everything: preach, counsel, administrate, manage volunteers, handle finances, fix the building. There's nothing left for your family.",
  },
  {
    icon: HeartCrack,
    title: "Marriage suffering under ministry pressure",
    description:
      "Your spouse feels like second priority. \"The church is your real wife.\" You feel guilty but don't know what to cut.",
  },
  {
    icon: DoorOpen,
    title: "Volunteers quit every 3 months",
    description:
      "You train people, they leave. No pipeline, no pathway, no retention system. So you do it yourself. Again.",
  },
];

const triedList = [
  "Preaching better sermons",
  "Launching new programs",
  "Posting more on social media",
  "Copying what \"growing churches\" do",
  "Investing more hours, more energy, more sacrifice",
];

const PSAProblemSection = () => {
  return (
    <section className="bg-cream section-padding">
      <div className="container mx-auto max-w-5xl">
        <h2 className="heading-section text-foreground text-center mb-10 max-w-3xl mx-auto">
          Your Church Isn't Stuck Because of Your Preaching.{" "}
          <span className="text-secondary">It's Stuck Because of Your Structure.</span>
        </h2>

        <div className="max-w-2xl mx-auto mb-12">
          <p className="body-text text-center mb-6">
            You feel a deep calling on your life. You love your people. You pour everything into the ministry God has given you. But your church has been plateaued at 100-300 for 1-3 years.
          </p>
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-center text-foreground mb-4">
            You've tried:
          </p>
          <ul className="space-y-2 mb-6 max-w-xs mx-auto list-disc list-inside">
            {triedList.map((item) => (
              <li key={item} className="font-body text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
          <p className="body-text text-center font-semibold mb-4">
            And yet nothing changes.
          </p>
          <p className="body-text text-center mb-2">
            Here's why: <strong className="text-foreground">You're treating a systems problem with effort solutions.</strong>
          </p>
          <p className="body-text text-center">
            Your church doesn't need more effort. It needs structure. Specifically, it needs{" "}
            <strong className="text-foreground">3 Core Systems</strong> that every growing church has - and that most plateaued churches are completely missing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {painPoints.map((point) => (
            <div
              key={point.title}
              className="bg-background rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-primary flex items-center justify-center">
                  <point.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">{point.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{point.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center border-l-4 border-secondary pl-6 md:border-l-0 md:pl-0">
          <p className="font-body text-lg md:text-xl italic text-foreground leading-relaxed">
            "You are not failing. You are leading without the infrastructure your calling requires. The{" "}
            <span className="text-secondary font-semibold not-italic">Systems Audit</span> shows you exactly where the gap is - and what to build first."
          </p>
        </div>
      </div>
    </section>
  );
};

export default PSAProblemSection;
