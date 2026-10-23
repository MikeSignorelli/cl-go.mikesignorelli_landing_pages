import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import heroImage from "@/assets/hero-greece.jpg";
import { collectFormFields } from "@/lib/collectFormFields";
import { sendToZapier } from "@/lib/sendToZapier";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ClosingCTASection = () => {
  const [formOpen, setFormOpen] = useState(false);
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
    <section className="relative py-28 md:py-36">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Biblical Greece at golden hour"
          className="w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, hsla(120, 10%, 12%, 0.75) 0%, hsla(120, 10%, 12%, 0.85) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-heading text-cream text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          The Footsteps of Paul Are Waiting.<br className="hidden md:block" /> Will You Walk Them?
        </h2>

        <p className="font-body text-cream/75 text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          August 24 - September 3, 2026. 11 days through Biblical Greece and Turkey with Pastor Mike Signorelli. 15 sites where the New Testament was lived. A 3-night Greek Islands cruise. Premium hotels. Expert biblical scholars. Friendships that last a lifetime. Starting at $4,895.
        </p>

        <button
          onClick={() => setFormOpen(true)}
          className="bg-secondary text-secondary-foreground font-heading font-bold py-4 px-10 rounded-sm text-sm uppercase tracking-wider hover:bg-gold-dark transition-all duration-200 shadow-lg"
        >
          Get Complete Tour Details →
        </button>

        <p className="text-cream/50 text-sm font-body mt-5">
          Or call now to book directly:{" "}
          <a href="tel:8772488687" className="text-cream font-semibold hover:text-gold transition-colors">
            877.248.8687
          </a>
        </p>

        <p className="text-gold font-heading font-bold text-sm uppercase tracking-wider mt-10">
          Spaces are limited. Mike's previous tour sold out. Do not wait.
        </p>
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
              Get the Full Tour Details
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cl-firstName" className="block text-sm font-medium text-foreground mb-1.5 font-body">First Name</label>
                <input id="cl-firstName" name="firstName" type="text" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="First name" />
              </div>
              <div>
                <label htmlFor="cl-lastName" className="block text-sm font-medium text-foreground mb-1.5 font-body">Last Name</label>
                <input id="cl-lastName" name="lastName" type="text" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="Last name" />
              </div>
            </div>
            <div>
              <label htmlFor="cl-email" className="block text-sm font-medium text-foreground mb-1.5 font-body">Email Address</label>
              <input id="cl-email" name="email" type="email" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="you@email.com" />
            </div>
            <div>
              <label htmlFor="cl-phone" className="block text-sm font-medium text-foreground mb-1.5 font-body">Phone Number</label>
              <input id="cl-phone" name="phone" type="tel" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="(555) 000-0000" />
            </div>
            <div>
              <label htmlFor="cl-travelers" className="block text-sm font-medium text-foreground mb-1.5 font-body">How many travelers in your party?</label>
              <select id="cl-travelers" name="travelers" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50">
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
              Or call now to book directly: <a href="tel:8772488687" className="text-foreground font-semibold hover:text-secondary transition-colors">877.248.8687</a>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ClosingCTASection;
