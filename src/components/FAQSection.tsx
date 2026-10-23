import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How much does the tour cost?",
    a: "$4,895 per person based on double occupancy with an exterior XC cabin on the cruise. Cabin upgrades are available - XD cabin adds $70 per person, Balcony BA cabin adds $345 per person. Single room supplements are available for solo travelers.",
  },
  {
    q: "What is the deposit and payment schedule?",
    a: "A $750 non-refundable deposit per person secures your spot. A second deposit of $1,250 is due by April 1, 2026. Final payment is due by May 4, 2026.",
  },
  {
    q: "Is airfare included?",
    a: "Roundtrip airfare is not included. You will fly into Athens and depart from Thessaloniki. Our travel team can help you find the best flights.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Cancellations must be submitted in writing. Cancellation fee is $750 through March 31, 2026. From April 1 to May 4, 2026 the fee is $2,000. After May 5, 2026 the fee is 100% of the tour cost. Travel insurance is strongly recommended.",
  },
  {
    q: "Is travel insurance recommended?",
    a: "Yes. We strongly recommend purchasing comprehensive travel insurance to protect your investment against unexpected cancellations, medical emergencies, or travel disruptions.",
  },
  {
    q: "How physically demanding is the tour?",
    a: "The tour involves moderate walking at archaeological sites, some uneven terrain, and stairs. Most sites are manageable for anyone with reasonable mobility. The cruise days offer a more relaxed pace. If you have specific mobility concerns, contact our travel team at 877.248.8687.",
  },
  {
    q: "What is the cruise like?",
    a: "A 3-night cruise aboard the Celestyal Discovery through the Greek Islands and Turkey. Full board is included - breakfast, lunch, and dinner. Two private shore excursions are included to Ephesus and Patmos. Optional excursions are available at additional cost for Mykonos, Crete, and Santorini.",
  },
  {
    q: "Can I bring my spouse or family member?",
    a: "Absolutely. Many travelers come as couples. Pricing is per person based on double occupancy. Single room supplements are available for solo travelers.",
  },
  {
    q: "How do I book?",
    a: "Complete the form on this page to receive your full tour information package and a personal follow-up from our travel team. Or call 877.248.8687 to book directly over the phone.",
  },
  {
    q: "How many spots are available?",
    a: "This tour has limited capacity to ensure a quality experience. Spots are filled on a first-come, first-served basis with your $750 deposit. We recommend booking early as Mike's previous tour sold out.",
  },
];

const FAQSection = () => {
  return (
    <section className="section-padding bg-muted">
      <div className="max-w-3xl mx-auto">
        <h2 className="heading-section text-foreground text-center mb-16">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card border border-border rounded-sm px-4 md:px-6 data-[state=open]:shadow-md transition-shadow"
            >
              <AccordionTrigger className="font-heading font-bold text-foreground text-sm md:text-base tracking-tight py-4 md:py-5 hover:no-underline text-left gap-3">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground text-sm leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
