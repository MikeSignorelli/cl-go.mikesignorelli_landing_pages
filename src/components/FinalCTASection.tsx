import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { collectFormFields } from "@/lib/collectFormFields";
import { sendToZapier } from "@/lib/sendToZapier";

const trustElements = [
  "Premium hotels: Royal Olympic (Athens), The Met (Thessaloniki), Divani Meteora",
  "Celestyal Discovery cruise with private shore excursions to Ephesus and Patmos",
  "Spaces are limited - this tour will sell out",
];

const FinalCTASection = () => {
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
    <section className="section-padding bg-background">
      <div className="max-w-3xl mx-auto">
        <h2 className="heading-section text-foreground text-center mb-4">
          Ready to Walk Where Paul Walked?<br className="hidden md:block" /> Reserve Your Spot Today.
        </h2>
        <p className="body-text text-center mb-12 max-w-2xl mx-auto text-sm">
          Complete the form below to receive your complete tour information package including the full day-by-day itinerary, pricing details, cabin options, payment schedule, and everything you need to secure your place. A member of our travel team will also follow up to answer any questions and help you book.
        </p>

        {/* Form */}
        <div className="bg-card border border-border rounded-sm p-8 md:p-10 shadow-lg mb-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="final-firstName" className="block text-sm font-medium text-foreground mb-1.5 font-body">
                  First Name <span className="text-destructive">*</span>
                </label>
                <input id="final-firstName" name="firstName" type="text" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="First name" />
              </div>
              <div>
                <label htmlFor="final-lastName" className="block text-sm font-medium text-foreground mb-1.5 font-body">
                  Last Name <span className="text-destructive">*</span>
                </label>
                <input id="final-lastName" name="lastName" type="text" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="Last name" />
              </div>
            </div>

            <div>
              <label htmlFor="final-email" className="block text-sm font-medium text-foreground mb-1.5 font-body">
                Email Address <span className="text-destructive">*</span>
              </label>
              <input id="final-email" name="email" type="email" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="you@email.com" />
            </div>

            <div>
              <label htmlFor="final-phone" className="block text-sm font-medium text-foreground mb-1.5 font-body">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <input id="final-phone" name="phone" type="tel" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="(555) 000-0000" />
            </div>

            <div>
              <label htmlFor="final-travelers" className="block text-sm font-medium text-foreground mb-1.5 font-body">
                How many travelers in your party? <span className="text-destructive">*</span>
              </label>
              <select id="final-travelers" name="travelers" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50">
                <option value="">Select...</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5+">5+</option>
              </select>
            </div>

            <div>
              <label htmlFor="final-questions" className="block text-sm font-medium text-foreground mb-1.5 font-body">
                Any questions or special requests? <span className="text-muted-foreground">(Optional)</span>
              </label>
              <textarea
                id="final-questions"
                name="questions"
                rows={4}
                disabled={loading}
                className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none disabled:opacity-50"
                placeholder="Let us know if you have any questions..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-secondary-foreground font-heading font-bold py-4 rounded-sm text-base uppercase tracking-wider hover:bg-gold-dark transition-all duration-200 shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="animate-spin" size={20} /> Submitting...</> : "Send Me the Tour Details →"}
            </button>
          </form>

          <p className="text-muted-foreground text-sm font-body text-center mt-5">
            Prefer to book by phone? Call{" "}
            <a href="tel:8772488687" className="text-foreground font-semibold hover:text-secondary transition-colors">
              877.248.8687
            </a>{" "}
            - our travel team is ready to help.
          </p>
        </div>

        {/* Trust elements */}
        <div className="grid sm:grid-cols-2 gap-4">
          {trustElements.map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <Check size={12} className="text-primary" />
              </span>
              <span className="font-body text-foreground/80 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
