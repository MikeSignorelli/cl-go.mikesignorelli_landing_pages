import { useState } from "react";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const included = [
  "6 nights at premium hotels - Royal Olympic Hotel (Athens), Divani Meteora or Grand Meteora (Kalambaka), The Met Hotel (Thessaloniki)",
  "Breakfast and dinner daily throughout the land tour",
  "All land transportation and guided tours as outlined in the itinerary",
  "Sightseeing tours with local licensed guides and expert biblical scholars",
  "Entrance fees to all archaeological sites",
  "All bus transfers upon arrival and departure",
  "1 bottle of water per person during all transfers and tours",
  "3-night cruise aboard the Celestyal Discovery to the Greek Islands and Turkey",
  "Full board during the cruise - breakfast, lunch, and dinner included",
  "Unlimited filtered coffee, tea, water, and juice during restaurant hours on the cruise",
  "2 private shore excursions during the cruise - Ephesus and Patmos included",
  "Port charges",
];

const notIncluded = [
  "Roundtrip airfare to Athens and from Thessaloniki",
  "All personal expenses",
  "Lunches during the land tour portion",
  "Sustainable tourist tax during cruise",
  "Travel insurance (strongly recommended)",
  "Shore excursions in Mykonos, Heraklion (Crete), and Santorini",
  "Tips and gratuities to local drivers, guides, escorts, hotel and restaurant staff",
];

const PricingSection = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="heading-section text-foreground text-center mb-4">
          Everything Included in Your $4,895 Journey
        </h2>
        <p className="text-muted-foreground text-center font-body mb-16 text-sm"></p>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Included */}
          <div>
            <h3 className="font-heading font-bold text-foreground text-lg mb-6 uppercase tracking-wider">
              What's Included
            </h3>
            <ul className="space-y-4">
              {included.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Check size={14} className="text-primary" />
                  </span>
                  <span className="body-text text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not included */}
          <div>
            <h3 className="font-heading font-bold text-foreground text-lg mb-6 uppercase tracking-wider">
              Not Included
            </h3>
            <ul className="space-y-4">
              {notIncluded.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center mt-0.5">
                    <X size={14} className="text-muted-foreground" />
                  </span>
                  <span className="body-text text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing boxes - 4 equal cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-primary text-primary-foreground rounded-sm p-6 text-center">
            <p className="text-primary-foreground/70 text-xs font-body uppercase tracking-wider mb-4">Per Person</p>
            <p className="font-heading text-2xl font-bold mb-3">$4,895</p>
            <p className="text-primary-foreground/70 text-xs font-body leading-relaxed">double room, exterior XC cabin on cruise</p>
          </div>

          <div className="bg-card border border-border rounded-sm p-6 text-center">
            <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-4">Cabin Upgrades</p>
            <p className="font-heading text-foreground text-sm font-bold mb-1">XD cabin +$70</p>
            <p className="font-heading text-foreground text-sm font-bold mb-3">Balcony BA +$345</p>
            <p className="text-muted-foreground text-xs font-body">per person</p>
          </div>

          <div className="bg-card border border-border rounded-sm p-6 text-center">
            <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-4">Single Room Supplement</p>
            <p className="font-heading text-foreground text-sm font-bold mb-1">XC cabin +$1,465</p>
            <p className="font-heading text-foreground text-sm font-bold mb-1">XD cabin +$1,505</p>
            <p className="font-heading text-foreground text-sm font-bold">Balcony BA +$1,995</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => setFormOpen(true)}
            className="bg-secondary text-secondary-foreground font-heading font-bold py-4 px-10 rounded-sm text-sm uppercase tracking-wider hover:bg-gold-dark transition-all duration-200 shadow-lg"
          >
            Get Complete Tour Details →
          </button>
          <p className="text-muted-foreground text-sm font-body mt-4">
            Or call now to book directly:{" "}
            <a href="tel:8772488687" className="text-foreground font-semibold hover:text-secondary transition-colors">
              877.248.8687
            </a>
          </p>
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
              Get Complete Tour Details + Pricing
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-2" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="pr-firstName" className="block text-sm font-medium text-foreground mb-1.5 font-body">First Name</label>
                <input id="pr-firstName" name="firstName" type="text" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors" placeholder="First name" />
              </div>
              <div>
                <label htmlFor="pr-lastName" className="block text-sm font-medium text-foreground mb-1.5 font-body">Last Name</label>
                <input id="pr-lastName" name="lastName" type="text" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors" placeholder="Last name" />
              </div>
            </div>
            <div>
              <label htmlFor="pr-email" className="block text-sm font-medium text-foreground mb-1.5 font-body">Email Address</label>
              <input id="pr-email" name="email" type="email" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors" placeholder="you@email.com" />
            </div>
            <div>
              <label htmlFor="pr-phone" className="block text-sm font-medium text-foreground mb-1.5 font-body">Phone Number</label>
              <input id="pr-phone" name="phone" type="tel" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors" placeholder="(555) 000-0000" />
            </div>
            <div>
              <label htmlFor="pr-travelers" className="block text-sm font-medium text-foreground mb-1.5 font-body">How many travelers in your party?</label>
              <select id="pr-travelers" name="travelers" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors">
                <option value="">Select...</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5+">5+</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-secondary text-secondary-foreground font-heading font-bold py-4 rounded-sm text-base uppercase tracking-wider hover:bg-gold-dark transition-all duration-200 shadow-lg">
              Get Complete Tour Details
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

export default PricingSection;
