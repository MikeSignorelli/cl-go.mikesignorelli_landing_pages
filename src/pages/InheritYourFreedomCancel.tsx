import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { XCircle, ArrowRight } from "lucide-react";
import IYFHeader from "@/components/iyf/IYFHeader";
import IYFFooter from "@/components/iyf/IYFFooter";
import { Button } from "@/components/ui/button";

const InheritYourFreedomCancel = () => {
  const [params] = useSearchParams();
  const qty = params.get("qty") || "1";

  useEffect(() => {
    document.title = "Checkout Cancelled - Inherit Your Freedom | Mike Signorelli";
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <IYFHeader />
      <main className="flex-1 pt-32 md:pt-36">
        <section className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-muted border-2 border-border flex items-center justify-center">
              <XCircle size={42} className="text-muted-foreground" />
            </div>
          </div>

          <p className="subheading">Checkout Cancelled</p>
          <h1 className="heading-display text-foreground mb-6">
            Your Payment Was Cancelled
          </h1>

          <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">
            No charge was made. Your cart is still here whenever you're ready to continue.
          </p>

          <Button asChild variant="hero" size="lg" className="gap-2">
            <Link to={`/inherit-your-freedom/checkout?qty=${qty}`}>
              Back to Checkout
              <ArrowRight size={18} />
            </Link>
          </Button>
        </section>
      </main>
      <IYFFooter />
    </div>
  );
};

export default InheritYourFreedomCancel;
