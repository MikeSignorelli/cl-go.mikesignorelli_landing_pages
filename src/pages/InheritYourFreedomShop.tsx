import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShieldCheck, Truck, RotateCcw, ArrowRight } from "lucide-react";
import IYFHeader from "@/components/iyf/IYFHeader";
import IYFFooter from "@/components/iyf/IYFFooter";
import { Button } from "@/components/ui/button";
import bookCover from "@/assets/inherit-your-freedom-book.webp";

const UNIT_PRICE = 47;

const InheritYourFreedomShop = () => {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Buy Inherit Your Freedom | Mike Signorelli";
    const desc = "Order Inherit Your Freedom by Pastor Mike Signorelli - $47. Includes bonus teaching video and guided prayer companion. Secure checkout, fast delivery.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  const total = useMemo(() => (UNIT_PRICE * qty).toFixed(2), [qty]);

  const handleBuyNow = () => {
    navigate(`/inherit-your-freedom/checkout?qty=${qty}`);
  };

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <IYFHeader />
      <main className="flex-1 pt-32 md:pt-36">
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <nav className="font-body text-sm text-muted-foreground mb-8">
            <Link to="/inherit-your-freedom" className="hover:text-foreground transition-colors">
              Inherit Your Freedom
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Shop</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Image */}
            <div className="lg:sticky lg:top-32">
              <div className="relative bg-cream rounded-md p-10 md:p-16 flex items-center justify-center shadow-[0_20px_60px_-20px_hsl(var(--olive)/0.25)]">
                <img
                  src={bookCover}
                  alt="Inherit Your Freedom by Pastor Mike Signorelli - book cover"
                  className="w-full max-w-sm drop-shadow-2xl transition-transform duration-500 hover:scale-[1.03]"
                  loading="eager"
                />
                <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground font-heading text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-md">
                  Baker Books Published
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:sticky lg:top-32 space-y-8">
              <div className="space-y-3">
                <p className="subheading">Special Ministry Bundle</p>
                <h1 className="heading-display text-foreground">Inherit Your Freedom</h1>
                <p className="font-body text-base text-muted-foreground italic">
                  by Pastor Mike Signorelli
                </p>
              </div>

              <div className="flex items-baseline gap-3">
                <span
                  className="text-4xl md:text-5xl font-bold text-foreground tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  ${UNIT_PRICE}
                </span>
                <span className="font-body text-sm text-muted-foreground">USD - $6.99 shipping</span>
              </div>

              <p className="body-text">
                The complete framework for walking in spiritual freedom, breaking generational
                patterns, and stepping into the life God designed for you. This Special Ministry
                Bundle includes an exclusive bonus teaching video and a 7-day guided prayer companion
                aligned to each chapter theme.
              </p>

              <div className="border-t border-b border-border py-6 space-y-5">
                <div className="flex items-center gap-6">
                  <label className="font-heading uppercase tracking-widest text-xs text-foreground">
                    Quantity
                  </label>
                  <div className="flex items-center border border-border rounded-sm">
                    <button
                      type="button"
                      onClick={dec}
                      aria-label="Decrease quantity"
                      className="w-11 h-11 flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-40"
                      disabled={qty <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span
                      className="w-12 text-center font-heading text-base text-foreground"
                      aria-live="polite"
                    >
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={inc}
                      aria-label="Increase quantity"
                      className="w-11 h-11 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-heading uppercase tracking-widest text-xs text-muted-foreground">
                    Total
                  </span>
                  <span
                    className="text-2xl font-bold text-foreground"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    ${total}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleBuyNow}
                variant="hero"
                size="lg"
                className="w-full h-14 text-base gap-2 transition-transform duration-200 hover:scale-[1.01]"
              >
                Buy Now <ArrowRight size={18} />
              </Button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {[
                  { icon: ShieldCheck, label: "Secure Checkout" },
                  { icon: Truck, label: "Fast Delivery" },
                  { icon: RotateCcw, label: "100% Guarantee" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-xs font-body text-muted-foreground"
                  >
                    <Icon size={16} className="text-secondary shrink-0" />
                    {label}
                  </div>
                ))}
              </div>

              <section aria-labelledby="whats-included" className="pt-4 space-y-3">
                <h2
                  id="whats-included"
                  className="font-heading uppercase tracking-widest text-xs text-foreground"
                >
                  What's Included
                </h2>
                <ul className="space-y-2 font-body text-sm text-muted-foreground">
                  <li>- Inherit Your Freedom - full hardcover book.</li>
                  <li>- Bonus teaching video: The Five-Fold Freedom Framework.</li>
                  <li>- 7-day guided prayer companion.</li>
                </ul>
              </section>
            </div>
          </div>
        </section>
      </main>
      <IYFFooter />
    </div>
  );
};

export default InheritYourFreedomShop;
