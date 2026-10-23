import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is this assessment really free?",
    answer:
      "Yes. 25 questions, 5 minutes, personalized report delivered immediately.",
  },
  {
    question:
      "I've been a Christian for 30+ years. Will this tell me anything I don't already know?",
    answer:
      "That's exactly who this is designed for. Most long-term Christians discover significant gaps they didn't know existed.",
  },
  {
    question: 'I\'m not interested in "church stuff." Is this religious?',
    answer:
      "This is biblical depth and strategic stewardship - intellectual rigor applied to faith. Think MBA for your spiritual life, not Sunday school.",
  },
  {
    question: "What happens after the assessment?",
    answer:
      "You'll receive your personalized depth score and pathway. We'll share optional next steps (deeper studies, Greece tour, Legacy Architecture) - nothing is required.",
  },
  {
    question: "Is this designed for wealthy people?",
    answer:
      "It's designed for successful professionals who've invested heavily in career mastery but underinvested in biblical depth. Net worth isn't the qualifier - intellectual hunger is.",
  },
];

const IYFFaqSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-3xl mx-auto space-y-12">
        <h2 className="heading-section text-foreground leading-snug text-center">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border rounded-sm px-4 md:px-6 bg-card"
            >
              <AccordionTrigger
                className="text-left text-sm md:text-lg font-bold py-4 md:py-5 hover:no-underline gap-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="body-text pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default IYFFaqSection;
