import { useEffect } from "react";
import { Facebook, Instagram, Link } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { sendToZapier } from "@/lib/sendToZapier";

const steps = [
  {
    icon: "📧",
    title: "Check your email",
    text: "Your complete tour information package is on its way right now. It includes the full day-by-day itinerary, pricing details, cabin options, payment schedule, and everything you need to make your decision.",
  },
  {
    icon: "📞",
    title: "Expect a call from our travel team",
    text: 'A member of our travel team will reach out within 24-48 hours to answer your questions and help you secure your spot. If you are ready to book now, you do not have to wait - call 877.248.8687 and our team will take care of everything.',
  },
  {
    icon: "💳",
    title: "Secure your spot with a $750 deposit",
    text: "Spots are filled on a first-come, first-served basis. A $750 deposit per person reserves your place. Mike's previous tour sold out - early booking is strongly recommended.",
  },
];

const SITE_URL = "https://greece-turkey-tour.lovable.app";

const ThankYou = () => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(SITE_URL);
    toast.success("Link copied to clipboard!");
  };

  useEffect(() => {
    const guardKey = "gtt_ty_sent";
    try {
      if (sessionStorage.getItem(guardKey) === "1") return;
      sessionStorage.setItem(guardKey, "1");
    } catch {
      // storage unavailable - fall through and send once for this mount
    }

    let contact: { email?: string; first_name?: string } = {};
    try {
      const raw = sessionStorage.getItem("gtt_contact");
      if (raw) contact = JSON.parse(raw);
    } catch {
      // no persisted contact - send blanks
    }

    sendToZapier(
      "greece-turkey-tour-thank-you",
      "Thank-You",
      {
        email: contact.email ?? "",
        first_name: contact.first_name ?? "",
      },
      "greece",
    );
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-background pt-[104px]">
        {/* Hero */}
        <section className="px-6 py-12 md:px-12 md:py-14 lg:px-24 bg-muted">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-foreground text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-3">
              You Are One Step Closer to Walking Where Paul Walked!
            </h1>
            <p className="body-text text-base md:text-lg max-w-2xl mx-auto">
              Thank you for your interest in the Footsteps of Paul Tour with Pastor Mike Signorelli. Here is what happens next:
            </p>
          </div>
        </section>

        {/* Next Steps - Timeline */}
        <section className="px-6 py-10 md:px-12 md:py-12 lg:px-24 bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {steps.map((step, i) => (
                <div key={i} className="relative flex gap-6 pb-10 last:pb-0">
                  {/* Timeline line */}
                  {i < steps.length - 1 && (
                    <div className="absolute left-6 top-14 bottom-0 w-px bg-border" />
                  )}
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 border-2 border-secondary flex items-center justify-center text-2xl">
                    {step.icon}
                  </div>
                  {/* Content */}
                  <div className="pt-1">
                    <span className="font-body text-secondary text-xs font-semibold uppercase tracking-wider">Step {i + 1}</span>
                    <h3 className="font-heading text-foreground text-lg font-bold mt-1 mb-2">{step.title}</h3>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Message */}
        <section className="px-6 py-10 md:px-12 md:py-12 lg:px-24 bg-muted">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-section text-foreground text-center mb-5">A Personal Message from Mike</h2>
            <div className="bg-card border border-border rounded-sm p-6 md:p-8 shadow-sm flex justify-center">
              <div className="w-full max-w-[360px] aspect-[9/16] rounded-sm overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/ARDh4auUUSM"
                  title="A Personal Message from Mike"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>

            <p className="text-center font-body text-foreground mt-5 text-base">
              Ready to book right now? Call{" "}
              <a href="tel:8772488687" className="text-secondary font-bold hover:underline">
                877.248.8687
              </a>{" "}
              - our travel team is standing by.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default ThankYou;
