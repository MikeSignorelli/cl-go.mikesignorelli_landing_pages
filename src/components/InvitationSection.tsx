import { useState } from "react";
import mikePhoto from "@/assets/mike-invitation.webp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const InvitationSection = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        
        <h2 className="heading-section text-foreground text-center mb-16">
          A Personal Invitation from Pastor Mike
        </h2>

        <div className="grid md:grid-cols-[320px_1fr] gap-12 items-start">
          {/* Mike's Photo */}
          <div className="flex justify-center md:justify-start">
            <img
              src={mikePhoto}
              alt="Pastor Mike Signorelli at a biblical site in Greece"
              className="rounded-sm shadow-xl w-full max-w-[320px] object-cover"
              loading="lazy"
              width={800}
              height={1000}
            />
          </div>

          {/* Letter */}
          <div className="space-y-5">
            <p className="body-text">
              I know that you have felt drawn to walk where Paul walked. And I believe that stirring in your heart is from God. The Holy Spirit often plants seeds of divine appointments that transform our understanding of Scripture.
            </p>
            <p className="body-text">
              I have carefully crafted this 11-day journey because I want to personally experience these powerful sites alongside you and minister together where the early church was born. Imagine standing on Mars Hill where Paul boldly proclaimed the Gospel to the philosophers of Athens. Picture yourself walking through ancient Corinth where he spent 18 months building one of the earliest Christian communities.
            </p>
            <p className="body-text">
              Through God's amazing provision, we will experience both mainland Greece and a stunning 3-night cruise through the Greek islands - including Patmos where John received the Revelation. We will be joined by expert biblical scholars who will bring Paul's missionary journeys to life as we visit Thessalonica, Philippi, Ephesus, and more.
            </p>
            <p className="body-text">
              You will forge deep connections with fellow believers as we share meals overlooking the Aegean Sea. You will see Scripture come alive in extraordinary ways as we visit the actual places where Paul's letters were received and read. From the majesty of the Acropolis to the serene waters where Lydia was baptized, each day holds profound spiritual significance.
            </p>
            <p className="body-text">
              Join me for this life-changing adventure through Biblical Greece. Let us walk together where Paul proclaimed the Gospel and watch as God writes new chapters in our own spiritual journeys.
            </p>
            <p className="font-body text-foreground font-semibold text-lg mt-6">
              - Pastor Mike Signorelli
            </p>

            {/* CTA */}
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => setFormOpen(true)}
                className="bg-secondary text-secondary-foreground font-heading font-bold py-4 px-8 rounded-sm text-sm uppercase tracking-wider hover:bg-gold-dark transition-all duration-200 shadow-lg"
              >
                Get Complete Tour Details →
              </button>
              <span className="text-muted-foreground text-sm font-body">
                Or call now to book directly:{" "}
                <a href="tel:8772488687" className="text-foreground font-semibold hover:text-secondary transition-colors">
                  877.248.8687
                </a>
              </span>
            </div>
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
          <form
            className="space-y-4 mt-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="inv-firstName" className="block text-sm font-medium text-foreground mb-1.5 font-body">First Name</label>
                <input id="inv-firstName" name="firstName" type="text" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors" placeholder="First name" />
              </div>
              <div>
                <label htmlFor="inv-lastName" className="block text-sm font-medium text-foreground mb-1.5 font-body">Last Name</label>
                <input id="inv-lastName" name="lastName" type="text" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors" placeholder="Last name" />
              </div>
            </div>
            <div>
              <label htmlFor="inv-email" className="block text-sm font-medium text-foreground mb-1.5 font-body">Email Address</label>
              <input id="inv-email" name="email" type="email" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors" placeholder="you@email.com" />
            </div>
            <div>
              <label htmlFor="inv-phone" className="block text-sm font-medium text-foreground mb-1.5 font-body">Phone Number</label>
              <input id="inv-phone" name="phone" type="tel" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors" placeholder="(555) 000-0000" />
            </div>
            <div>
              <label htmlFor="inv-travelers" className="block text-sm font-medium text-foreground mb-1.5 font-body">How many travelers in your party?</label>
              <select id="inv-travelers" name="travelers" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors">
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

export default InvitationSection;
