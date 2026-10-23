import heroImage from "@/assets/hero-greece.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { collectFormFields } from "@/lib/collectFormFields";
import { sendToZapier } from "@/lib/sendToZapier";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const HeroSection = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center pt-[104px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Mars Hill and the Acropolis at golden hour, Athens Greece"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "var(--hero-overlay)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 py-20 lg:py-28 max-w-3xl text-center">
          <div className="animate-fade-up">
            <h1 className="font-heading text-cream text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] mb-6 tracking-tight">
              Walk Where Paul Walked.{" "}
              <span className="text-gold-light italic font-body">See Scripture Come Alive.</span>
            </h1>
            <p className="font-body text-cream/90 text-xl md:text-2xl font-normal leading-relaxed mb-4">
              Journey with Pastor Mike Signorelli<br />Through Biblical Greece and Turkey.
            </p>
            <p className="body-text text-cream/70 max-w-2xl mx-auto mb-10">
              11 days. 15 biblical sites. A 3-night Greek Islands cruise. Expert biblical scholars.
              Deep teaching at every location. An experience that permanently changes how you read
              the New Testament.
            </p>

            <button
              onClick={() => setFormOpen(true)}
              className="inline-block bg-secondary text-secondary-foreground font-heading font-bold py-4 px-10 rounded-sm text-base uppercase tracking-wider hover:bg-gold-dark transition-all duration-200 shadow-lg"
            >
              Get Complete Tour Details
            </button>

            <p className="text-cream/60 text-sm font-body mt-4">
              Or call now to book directly:{" "}
              <a href="tel:8772488687" className="text-cream font-semibold hover:text-gold transition-colors">
                877.248.8687
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent
          className="sm:max-w-md bg-card border-border"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="font-heading text-foreground text-2xl font-bold text-center tracking-tight">
              Get Complete Tour Details
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm text-center font-body">
              Request Your Tour Information Package
            </DialogDescription>
          </DialogHeader>
          <TourForm />
        </DialogContent>
      </Dialog>
    </section>
  );
};

const TourForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = collectFormFields(form);
    setLoading(true);
    try {
      sessionStorage.setItem("gtt_contact", JSON.stringify({ email: fields.email ?? "", first_name: fields.first_name ?? "" }));
    } catch {
      // private-mode or storage disabled - thank-you page will just send blanks
    }
    try {
      await sendToZapier("greece-turkey-tour", "Lead", fields);
    } finally {
      navigate("/greece-turkey-tour-thank-you");
    }
  };

  return (
    <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1.5 font-body">First Name</label>
          <input id="firstName" name="firstName" type="text" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="First name" />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1.5 font-body">Last Name</label>
          <input id="lastName" name="lastName" type="text" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="Last name" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5 font-body">Email Address</label>
        <input id="email" name="email" type="email" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="you@email.com" />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5 font-body">Phone Number</label>
        <input id="phone" name="phone" type="tel" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="(555) 000-0000" />
      </div>

      <div>
        <label htmlFor="travelers" className="block text-sm font-medium text-foreground mb-1.5 font-body">How many travelers in your party?</label>
        <select id="travelers" name="travelers" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50">
          <option value="">Select...</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5+">5+</option>
        </select>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-secondary text-secondary-foreground font-heading font-bold py-4 rounded-sm text-base uppercase tracking-wider hover:bg-gold-dark transition-all duration-200 shadow-lg disabled:opacity-70 flex items-center justify-center gap-2">
        {loading ? <><Loader2 className="animate-spin" size={20} /> Submitting...</> : "Get Complete Tour Details"}
      </button>

      <p className="text-muted-foreground text-sm font-body text-center">
        Or call now to book directly:{" "}
        <a href="tel:8772488687" className="text-foreground font-semibold hover:text-secondary transition-colors">877.248.8687</a>
      </p>
    </form>
  );
};

export default HeroSection;
