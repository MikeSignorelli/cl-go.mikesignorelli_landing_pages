import { CheckCircle2 } from "lucide-react";

const systems = [
  {
    label: "System 1",
    title: "Guest Experience Engine Templates",
    items: [
      "First-time guest identification checklist",
      "24-hour follow-up sequence (text + email + call scripts)",
      "Second-visit invitation templates",
      "Guest → Regular → Member assimilation pathway map",
      "Guest return rate tracking spreadsheet",
      "Welcome packet design template",
      "Facility audit checklist (from a guest's perspective)",
      "Connection card templates",
    ],
  },
  {
    label: "System 2",
    title: "Volunteer Pipeline Templates",
    items: [
      "Volunteer recruitment scripts (stage announcement + personal ask)",
      "Role description templates (customizable for any ministry area)",
      "4-week volunteer onboarding curriculum outline",
      "Volunteer scheduling template",
      "Recognition program guide (monthly, quarterly, annual ideas)",
      "Volunteer satisfaction survey template",
      "Retention tracking spreadsheet",
      '"Bench strength" planning worksheet',
    ],
  },
  {
    label: "System 3",
    title: "Leadership Pathway Tools",
    items: [
      "5-stage leadership pathway diagram (attendee → staff)",
      "Leadership assessment tool for identifying emerging leaders",
      "Development curriculum outline (what to teach at each level)",
      "Delegation framework worksheet",
      "Weekly staff meeting agenda template",
      "Decision-making authority matrix",
      "Succession planning template for key roles",
      "Organizational chart builder",
    ],
  },
];

const bonuses = [
  {
    label: "Bonus",
    title: "Marriage Quick-Win Tools",
    items: [
      "Boundary-setting template (for presenting to your board)",
      "Weekly date night planning guide",
      '"Spouse before church" decision-making framework',
      "7 Pillars assessment (full version)",
    ],
  },
  {
    label: "Bonus",
    title: "Church Calendar Strategy Template",
    items: [
      "12-month strategic planning calendar",
      "Summer / Fall / Winter-Spring focus guide",
      "Sermon series ideas by season (30+ outlines)",
      "Event planning timeline",
    ],
  },
];

const SystemCard = ({ label, title, items }: { label: string; title: string; items: string[] }) => (
  <div className="bg-background rounded-lg p-8 shadow-sm border border-border">
    <span className="subheading mb-2 block">{label}</span>
    <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-6">{title}</h3>
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <span className="font-body text-sm md:text-base text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const CSSKSystemsSection = () => {
  return (
    <section className="section-padding bg-cream">
      <div className="max-w-6xl mx-auto">
        <h2 className="heading-section text-foreground text-center mb-16">
          Everything You Need to Build the Systems You're Missing
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {systems.map((system) => (
            <SystemCard key={system.title} {...system} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bonuses.map((bonus) => (
            <SystemCard key={bonus.title} {...bonus} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CSSKSystemsSection;
