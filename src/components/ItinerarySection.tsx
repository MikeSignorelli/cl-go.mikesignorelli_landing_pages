import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import imgAthens from "@/assets/itinerary-athens.jpg";
import imgMarsHill from "@/assets/itinerary-mars-hill.jpg";
import imgCorinth from "@/assets/itinerary-corinth.jpg";
import imgCruise from "@/assets/itinerary-cruise.jpg";
import imgEphesus from "@/assets/itinerary-ephesus.jpg";
import imgSantorini from "@/assets/itinerary-santorini.jpg";
import imgMeteora from "@/assets/itinerary-meteora.jpg";
import imgPhilippi from "@/assets/itinerary-philippi.jpg";
import imgDepart from "@/assets/itinerary-depart.jpg";
import imgThessaloniki from "@/assets/itinerary-thessaloniki.jpg";

const itinerary = [
  {
    day: 1,
    date: "Monday, August 24",
    title: "Depart from the U.S.",
    description: "Depart from the U.S. on your flight to Athens. Your journey to walk where Paul walked begins. And for those who are joining us from abroad, you can coordinate your arrival in Greece with our tour directors.",
    image: imgDepart,
  },
  {
    day: 2,
    date: "Tuesday, August 25",
    title: "Arrive in Athens",
    description: "Arrive in Athens. Free afternoon to begin soaking in the city where Paul debated with philosophers. Welcome dinner at the Royal Olympic Hotel overlooking the Temple of Zeus.",
    image: imgAthens,
  },
  {
    day: 3,
    date: "Wednesday, August 26",
    title: "Acropolis & Mars Hill",
    description: "Full day Athens city tour including the Acropolis and Mars Hill - stand where Paul delivered his famous sermon to the intellectual elite of Athens (Acts 17). This is the site that brings Acts to life like nothing else can. Dinner at a local restaurant.",
    image: imgMarsHill,
  },
  {
    day: 4,
    date: "Thursday, August 27",
    title: "Ancient Corinth",
    description: "Journey to Ancient Corinth - walk the ruins where Paul spent 18 months planting one of the most important churches in the New Testament. Stand at the Bema Seat where he was brought before Gallio (Acts 18). You will never read 1 or 2 Corinthians the same way. Return to Athens for dinner.",
    image: imgCorinth,
  },
  {
    day: 5,
    date: "Friday, August 28",
    title: "Board Cruise to Mykonos",
    description: "Board the Celestyal Discovery cruise ship and sail to Mykonos. Free time to explore this stunning Greek island. Dinner onboard as we sail the Aegean Sea.",
    image: imgCruise,
  },
  {
    day: 6,
    date: "Saturday, August 29",
    title: "Ephesus & Patmos",
    description: "Two incredible stops - Kusadasi (gateway to Ephesus) where you will walk the ancient streets Paul walked and see the theater where the riot broke out (Acts 19), PLUS the island of Patmos where John received the Revelation. Both excursions included. Dinner onboard.",
    image: imgEphesus,
  },
  {
    day: 7,
    date: "Sunday, August 30",
    title: "Crete & Santorini",
    description: "Cruise to Crete and Santorini - worship together on the ship, then explore the breathtaking beauty of the Greek islands. Optional shore excursions available. Dinner onboard.",
    image: imgSantorini,
  },
  {
    day: 8,
    date: "Monday, August 31",
    title: "Meteora Monasteries",
    description: "Disembark and journey north through the legendary Battlefield of Thermopylae to the awe-inspiring Meteora monasteries - ancient monasteries built atop towering rock formations. Overnight in Kalambaka.",
    image: imgMeteora,
  },
  {
    day: 9,
    date: "Tuesday, September 1",
    title: "Berea & Thessaloniki",
    description: 'Visit Berea where the Bereans "examined the Scriptures daily" (Acts 17:11) and the Royal Tombs of Vergina. Continue to Thessaloniki - the city Paul wrote his letters to. Dinner and overnight at The Met Hotel.',
    image: imgThessaloniki,
  },
  {
    day: 10,
    date: "Wednesday, September 2",
    title: "Philippi & Kavala",
    description: "Journey to Philippi - where Paul and Silas were imprisoned and sang at midnight (Acts 16). Visit the river where Lydia was baptized - the first European convert. Continue to the port city of Kavala where Paul first set foot in Europe. Return to Thessaloniki for farewell dinner.",
    image: imgPhilippi,
  },
  {
    day: 11,
    date: "Thursday, September 3",
    title: "Depart Thessaloniki",
    description: "Depart from Thessaloniki carrying memories, friendships, and a transformed understanding of Scripture that will last a lifetime.",
    image: imgDepart,
  },
];

const ItinerarySection = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section className="section-padding bg-muted overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <h2 className="heading-section text-foreground text-center mb-16">
          11 Days That Will Change How You Read<br className="hidden md:block" /> the New Testament Forever
        </h2>
      </div>

      {/* Horizontal scrolling timeline */}
      <div className="relative group/scroll">
        {/* Left arrow */}
        <button
          onClick={() => {
            const el = document.getElementById("itinerary-scroll");
            if (el) el.scrollBy({ left: -470, behavior: "smooth" });
          }}
          className="absolute left-2 md:left-6 top-[130px] z-20 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full w-11 h-11 flex items-center justify-center shadow-lg hover:bg-primary transition-all opacity-0 group-hover/scroll:opacity-100 duration-300"
          aria-label="Scroll left"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => {
            const el = document.getElementById("itinerary-scroll");
            if (el) el.scrollBy({ left: 470, behavior: "smooth" });
          }}
          className="absolute right-2 md:right-6 top-[130px] z-20 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full w-11 h-11 flex items-center justify-center shadow-lg hover:bg-primary transition-all opacity-80 group-hover/scroll:opacity-100 duration-300 animate-pulse group-hover/scroll:animate-none"
          aria-label="Scroll right"
        >
          <ChevronRight size={22} />
        </button>

        {/* Scroll container */}
        <div id="itinerary-scroll" className="overflow-x-auto pb-8 scrollbar-thin">
          <div className="flex gap-6 px-6 md:px-12 lg:px-24" style={{ width: "max-content" }}>
            {itinerary.map((item) => (
              <div key={item.day} className="flex flex-col w-[450px] flex-shrink-0 group">
                {/* Image */}
                <div className="relative overflow-hidden rounded-sm">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-[450px] h-[280px] object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    width={640}
                    height={640}
                  />
                  {/* Day badge */}
                  <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-primary-foreground font-heading font-bold text-sm">
                      {item.day}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-5 flex-1">
                  <span className="text-muted-foreground text-xs font-body tracking-wide">
                    {item.date}
                  </span>
                  <h3 className="font-heading font-bold text-foreground text-xl tracking-tight mt-1 mb-3">
                    {item.title}
                  </h3>
                  <p className="body-text text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint gradient - right */}
        <div className="absolute top-0 right-0 bottom-8 w-20 bg-gradient-to-l from-muted to-transparent pointer-events-none" />
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
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
                <label htmlFor="it-firstName" className="block text-sm font-medium text-foreground mb-1.5 font-body">First Name</label>
                <input id="it-firstName" name="firstName" type="text" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors" placeholder="First name" />
              </div>
              <div>
                <label htmlFor="it-lastName" className="block text-sm font-medium text-foreground mb-1.5 font-body">Last Name</label>
                <input id="it-lastName" name="lastName" type="text" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors" placeholder="Last name" />
              </div>
            </div>
            <div>
              <label htmlFor="it-email" className="block text-sm font-medium text-foreground mb-1.5 font-body">Email Address</label>
              <input id="it-email" name="email" type="email" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors" placeholder="you@email.com" />
            </div>
            <div>
              <label htmlFor="it-phone" className="block text-sm font-medium text-foreground mb-1.5 font-body">Phone Number</label>
              <input id="it-phone" name="phone" type="tel" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors" placeholder="(555) 000-0000" />
            </div>
            <div>
              <label htmlFor="it-travelers" className="block text-sm font-medium text-foreground mb-1.5 font-body">How many travelers in your party?</label>
              <select id="it-travelers" name="travelers" required className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors">
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

export default ItinerarySection;
