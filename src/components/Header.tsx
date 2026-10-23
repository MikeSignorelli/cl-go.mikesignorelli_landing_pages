import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.webp";
import { collectFormFields } from "@/lib/collectFormFields";
import { sendToZapier } from "@/lib/sendToZapier";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Header = () => {
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
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary">
        <div className="flex items-center justify-between px-6 md:px-12 py-3 h-[104px]">
          <img src={logo} alt="Mike Signorelli" className="h-[80px] w-auto brightness-0 invert" />
          <Button
            variant="outline"
            size="sm"
            className="font-body uppercase tracking-widest text-xs bg-secondary text-secondary-foreground border-secondary hover:bg-gold-dark hover:border-gold-dark transition-all"
            onClick={() => setFormOpen(true)}
          >
            Get Complete Tour Details
          </Button>
        </div>
      </header>

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
          <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="hd-firstName" className="block text-sm font-medium text-foreground mb-1.5 font-body">First Name</label>
                <input id="hd-firstName" name="firstName" type="text" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="First name" />
              </div>
              <div>
                <label htmlFor="hd-lastName" className="block text-sm font-medium text-foreground mb-1.5 font-body">Last Name</label>
                <input id="hd-lastName" name="lastName" type="text" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="Last name" />
              </div>
            </div>
            <div>
              <label htmlFor="hd-email" className="block text-sm font-medium text-foreground mb-1.5 font-body">Email Address</label>
              <input id="hd-email" name="email" type="email" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="you@email.com" />
            </div>
            <div>
              <label htmlFor="hd-phone" className="block text-sm font-medium text-foreground mb-1.5 font-body">Phone Number</label>
              <input id="hd-phone" name="phone" type="tel" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50" placeholder="(555) 000-0000" />
            </div>
            <div>
              <label htmlFor="hd-travelers" className="block text-sm font-medium text-foreground mb-1.5 font-body">How many travelers in your party?</label>
              <select id="hd-travelers" name="travelers" required disabled={loading} className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50">
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
    </>
  );
};

export default Header;
