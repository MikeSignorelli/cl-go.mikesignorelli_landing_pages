import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, ArrowRight } from "lucide-react";
import IYFHeader from "@/components/iyf/IYFHeader";
import IYFFooter from "@/components/iyf/IYFFooter";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const SUPPORT_EMAIL = "support@mikesignorelli.com";

const InheritYourFreedomThankYou = () => {
  const [params] = useSearchParams();
  const notified = useRef(false);

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId || notified.current) return;
    notified.current = true;

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("notify-order", { body: { session_id: sessionId } });
        if (error) throw error;

        const { submitLead, readPersistedContact, hasSentThankYou, markThankYouSent } = await import("@/lib/submitLead");
        const key = `inherit-your-freedom-thank-you-${sessionId}`;
        if (hasSentThankYou(key)) return;
        markThankYouSent(key);

        await submitLead("inherit-your-freedom-thank-you", "Thank-You", {
          ...readPersistedContact("inherit-your-freedom"),
          transaction_id: sessionId,
          amount: data?.amount_total ?? "",
          currency: data?.currency ?? "",
          payment_status: data?.payment_status ?? "",
          product_package: "Inherit Your Freedom",
        });
      } catch (err) {
        console.error("notify-order failed", err);
      }
    })();
  }, [params]);

  useEffect(() => {
    document.title = "Thank You - Inherit Your Freedom | Mike Signorelli";
    const desc =
      "Your order is confirmed. Thank you for ordering Inherit Your Freedom by Pastor Mike Signorelli.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <IYFHeader />
      <main className="flex-1 pt-32 md:pt-36">
        <section className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-secondary/10 border-2 border-secondary flex items-center justify-center">
              <CheckCircle2 size={42} className="text-secondary" />
            </div>
          </div>

          <p className="subheading">Order Confirmed</p>
          <h1 className="heading-display text-foreground mb-6">
            Your Order Confirmed Successfully
          </h1>

          <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-4">
            Thank you for your purchase. Your copy of{" "}
            <span className="text-foreground font-semibold">Inherit Your Freedom</span> will be
            delivered soon.
          </p>

          <p className="font-body text-base text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">
            For any enquiry please reach out to{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-secondary font-semibold hover:underline underline-offset-4"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>

          <div className="border border-border rounded-md bg-card p-6 md:p-8 shadow-[0_10px_40px_-20px_hsl(var(--olive)/0.2)] mb-10 text-left">
            <h2 className="font-heading uppercase tracking-widest text-xs text-muted-foreground mb-4">
              What Happens Next
            </h2>
            <ul className="space-y-3 font-body text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-secondary mt-1">•</span>
                <span>You'll receive a confirmation email with your order details shortly.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary mt-1">•</span>
                <span>Your book will be packed and shipped to the address you provided.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary mt-1">•</span>
                <span>Tracking information will be sent to your email once your order ships.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="hero" size="lg" className="gap-2">
              <Link to="/inherit-your-freedom">
                Back to Home
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href={`mailto:${SUPPORT_EMAIL}`}>
                <Mail size={16} />
                Contact Support
              </a>
            </Button>
          </div>
        </section>
      </main>
      <IYFFooter />
    </div>
  );
};

export default InheritYourFreedomThankYou;
