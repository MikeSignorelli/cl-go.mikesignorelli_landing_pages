import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How long does the quiz take?",
    a: "Under 5 minutes. 20 questions. Instant results.",
  },
  {
    q: "Is this really free?",
    a: "100% free. No credit card. No hidden upsell during the quiz. Just your results, your profile, and your certificate.",
  },
  {
    q: "What if I already think I know my gift?",
    a: "Great - the quiz will either confirm it or reveal something you hadn't considered. Many people discover they've been operating in their secondary gift, not their primary one.",
  },
  {
    q: "Do I need to be a new Christian?",
    a: "No. Whether you've been saved 3 months or 30 years, understanding your five-fold gift brings clarity at any stage.",
  },
  {
    q: "What happens after I get my results?",
    a: "You'll receive your full gift profile, activation roadmap, and downloadable Five-Fold Identity Certificate via email. You'll also get access to Pastor Mike's teaching on activating your specific gift.",
  },
  {
    q: "Can I share my results?",
    a: "Absolutely. The Five-Fold Identity Certificate is designed to be shared. Post it on social media, share with your small group, or print and frame it.",
  },
];

const FFFAQSection = () => {
  return (
    <section className="section-padding bg-primary">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-primary-foreground/5 rounded-sm border border-primary-foreground/10 px-4 md:px-6">
              <AccordionTrigger className="font-heading text-sm md:text-base font-semibold text-primary-foreground hover:no-underline py-4 md:py-5 text-left gap-3">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-sm text-primary-foreground/70 pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FFFAQSection;
