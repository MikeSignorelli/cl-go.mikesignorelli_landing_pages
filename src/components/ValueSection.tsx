import { BookOpen, Users, Heart, Star } from "lucide-react";

const valuePoints = [
  {
    icon: BookOpen,
    title: "Scripture Comes Alive",
    description:
      "Reading about Mars Hill is one thing. Standing there while an expert scholar explains what Paul saw, who he spoke to, and why his sermon was revolutionary - that changes how you read Acts forever. Every site on this tour connects directly to the New Testament in ways a classroom never can.",
  },
  {
    icon: Users,
    title: "Travel with Pastor Mike Signorelli",
    description:
      "This is not a generic Christian tour group. You are traveling with Mike - 1.6 million YouTube subscribers, TBN host, Baker Books author, and founding pastor of V1 Church. His teaching at each site adds a depth and spiritual dimension that transforms the experience from tourism to transformation.",
  },
  {
    icon: Heart,
    title: "Fellowship with Like-Minded Believers",
    description:
      "The friendships formed on this journey last long after you return home. Sharing meals overlooking the Aegean Sea with fellow believers, worshiping together on a cruise ship, praying at the river where Lydia was baptized - these are the moments that create lifelong bonds.",
  },
  {
    icon: Star,
    title: "World-Class Experience",
    description:
      "Premium hotels including the Royal Olympic in Athens and The Met in Thessaloniki. A 3-night cruise through the Greek Islands aboard the Celestyal Discovery. Expert licensed guides at every archaeological site. Professional tour management by America Greece Tours, specialists in biblical travel. This is a first-class experience at an accessible price.",
  },
];

const ValueSection = () => {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="max-w-5xl mx-auto">
        <h2 className="heading-section text-primary-foreground text-center mb-16">
          This Is Not a Vacation.<br className="hidden md:block" /> This Is a Pilgrimage That Changes Everything.
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {valuePoints.map((point, i) => (
            <div key={i} className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mt-1">
                <point.icon size={22} className="text-gold" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-primary-foreground text-lg tracking-tight mb-3">
                  {point.title}
                </h3>
                <p className="font-body text-primary-foreground/70 text-sm leading-relaxed">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
