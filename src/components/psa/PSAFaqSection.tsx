import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How long does the audit take?",
    a: "Under 5 minutes. 30 questions. Immediate results.",
  },
  {
    q: "Is this really free? What's the catch?",
    a: "100% free. You'll receive your personalized results, action plan, and score immediately. After the audit, we'll share optional resources to help you implement - but nothing is required.",
  },
  {
    q: "My church is under 100 people. Is this relevant?",
    a: "Yes - the audit adapts to your church size. The 3 Core Systems apply whether you're at 50 or 500 - but the implementation approach differs. Your action plan is customized.",
  },
  {
    q: "I'm bi-vocational. Do I have time for this?",
    a: "The audit takes 5 minutes. The action plan is designed for pastors with limited time - prioritized by impact, implemented incrementally.",
  },
  {
    q: "Can my spouse take this with me?",
    a: "The 7 Pillars Marriage quick-check is included. Many pastors take the audit WITH their spouse - the marriage section often sparks the most important conversation.",
  },
  {
    q: "How is this different from church growth conferences?",
    a: "Conferences give inspiration. The audit gives DIAGNOSIS. You'll leave with a specific score, specific gaps identified, and specific next steps - not generic motivation.",
  },
];

const PSAFaqSection = () => {
  return (
    <section className="bg-background section-padding">
      <div className="container mx-auto max-w-3xl">
        <h2 className="heading-section text-primary text-center mb-14">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border rounded-lg px-4 md:px-6 data-[state=open]:bg-muted/50"
            >
              <AccordionTrigger className="font-heading text-primary text-left text-sm md:text-base font-semibold hover:no-underline py-4 md:py-5 gap-3">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground text-sm md:text-base leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default PSAFaqSection;
