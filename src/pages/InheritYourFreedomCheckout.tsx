import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Minus, Plus, ShieldCheck, Truck, RotateCcw, Lock, ArrowRight } from "lucide-react";
import IYFHeader from "@/components/iyf/IYFHeader";
import IYFFooter from "@/components/iyf/IYFFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import bookCover from "@/assets/inherit-your-freedom-book.webp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { collectFormFields } from "@/lib/collectFormFields";
import { submitLead, persistContact } from "@/lib/submitLead";

const UNIT_PRICE = 47;

const InheritYourFreedomCheckout = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialQty = Math.max(1, Math.min(99, Number(params.get("qty")) || 1));
  const [qty, setQty] = useState(initialQty);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Checkout - Inherit Your Freedom | Mike Signorelli";
    const desc =
      "Complete your order for Inherit Your Freedom. Enter your shipping details and continue to secure Stripe payment.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  const shipping = 6.99;
  const subtotal = useMemo(() => UNIT_PRICE * qty, [qty]);
  const total = subtotal + shipping;

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Valid email required";
    if (!form.phone.trim()) next.phone = "Phone is required";
    if (!form.street.trim()) next.street = "Street address is required";
    if (!form.city.trim()) next.city = "City is required";
    if (!form.state.trim()) next.state = "State/Region is required";
    if (!form.zip.trim()) next.zip = "ZIP/Postal code is required";
    if (!form.country.trim()) next.country = "Country is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    const formEl = e.currentTarget;
    setSubmitting(true);

    const checkoutFields = {
      ...collectFormFields(formEl),
      product_package: "Inherit Your Freedom",
      amount: total.toFixed(2),
      currency: "USD",
      payment_status: "initiated",
    };
    // Fire-and-forget: logging this checkout attempt must never delay or risk the Stripe redirect below.
    persistContact("inherit-your-freedom", checkoutFields);
    submitLead("inherit-your-freedom-checkout", "Checkout", checkoutFields);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { qty, customer: form },
      });
      if (error) throw error;
      if (!data?.url) throw new Error("No checkout URL returned");
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      toast({
        title: "Payment error",
        description: (err as Error).message || "Could not start checkout. Please try again.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

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
            <Link to="/inherit-your-freedom/shop" className="hover:text-foreground transition-colors">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Checkout</span>
          </nav>

          <div className="mb-10">
            <p className="subheading">Secure Checkout</p>
            <h1 className="heading-display text-foreground">Complete Your Order</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
            {/* LEFT - Product Summary */}
            <aside className="lg:sticky lg:top-32 space-y-6">
              <div className="border border-border rounded-md bg-card p-6 md:p-8 shadow-[0_10px_40px_-20px_hsl(var(--olive)/0.2)]">
                <h2 className="font-heading uppercase tracking-widest text-xs text-muted-foreground mb-5">
                  Order Summary
                </h2>

                <div className="flex gap-5">
                  <div className="bg-cream rounded-sm p-4 flex items-center justify-center shrink-0">
                    <img
                      src={bookCover}
                      alt="Inherit Your Freedom book cover"
                      className="w-24 md:w-28 drop-shadow-lg"
                      loading="eager"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <h3
                      className="text-xl font-bold text-foreground leading-tight"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Inherit Your Freedom
                    </h3>
                    <p className="font-body text-xs text-muted-foreground italic">
                      by Pastor Mike Signorelli
                    </p>
                    <p className="font-body text-sm text-muted-foreground">
                      The complete framework for walking in spiritual freedom and breaking
                      generational patterns.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                  <span className="font-heading uppercase tracking-widest text-xs text-foreground">
                    Quantity
                  </span>
                  <div className="flex items-center border border-border rounded-sm">
                    <button
                      type="button"
                      onClick={dec}
                      aria-label="Decrease quantity"
                      className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-40"
                      disabled={qty <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span
                      className="w-10 text-center font-heading text-sm text-foreground"
                      aria-live="polite"
                    >
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={inc}
                      aria-label="Increase quantity"
                      className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <div className="flex items-center justify-between font-body text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between font-body text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-foreground">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="font-heading uppercase tracking-widest text-xs text-foreground">
                      Total
                    </span>
                    <span
                      className="text-2xl font-bold text-foreground"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: ShieldCheck, label: "Secure Checkout" },
                  { icon: Truck, label: "Fast Delivery" },
                  { icon: RotateCcw, label: "Guarantee" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 text-center p-3 border border-border rounded-sm bg-card"
                  >
                    <Icon size={18} className="text-secondary" />
                    <span className="font-body text-[11px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </aside>

            {/* RIGHT - Customer Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              <section className="space-y-5">
                <h2 className="font-heading uppercase tracking-widest text-xs text-foreground">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field
                    id="firstName"
                    label="First Name"
                    value={form.firstName}
                    onChange={handleChange("firstName")}
                    error={errors.firstName}
                    autoComplete="given-name"
                  />
                  <Field
                    id="lastName"
                    label="Last Name"
                    value={form.lastName}
                    onChange={handleChange("lastName")}
                    error={errors.lastName}
                    autoComplete="family-name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field
                    id="email"
                    label="Email Address"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    error={errors.email}
                    autoComplete="email"
                  />
                  <Field
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    error={errors.phone}
                    autoComplete="tel"
                  />
                </div>
              </section>

              <section className="space-y-5">
                <h2 className="font-heading uppercase tracking-widest text-xs text-foreground">
                  Shipping Address
                </h2>
                <Field
                  id="street"
                  label="Street Address"
                  value={form.street}
                  onChange={handleChange("street")}
                  error={errors.street}
                  autoComplete="street-address"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field
                    id="city"
                    label="City"
                    value={form.city}
                    onChange={handleChange("city")}
                    error={errors.city}
                    autoComplete="address-level2"
                  />
                  <Field
                    id="state"
                    label="State / Region"
                    value={form.state}
                    onChange={handleChange("state")}
                    error={errors.state}
                    autoComplete="address-level1"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field
                    id="zip"
                    label="ZIP / Postal Code"
                    value={form.zip}
                    onChange={handleChange("zip")}
                    error={errors.zip}
                    autoComplete="postal-code"
                  />
                  <Field
                    id="country"
                    label="Country"
                    value={form.country}
                    onChange={handleChange("country")}
                    error={errors.country}
                    autoComplete="country-name"
                  />
                </div>
              </section>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                disabled={submitting}
                className="w-full h-14 text-base gap-2 transition-transform duration-200 hover:scale-[1.01]"
              >
                <Lock size={16} />
                {submitting ? "Processing..." : "Continue to Payment"}
                <ArrowRight size={18} />
              </Button>

              <p className="font-body text-xs text-muted-foreground text-center">
                By continuing, you'll be securely redirected to Stripe to complete your payment.
              </p>

              <button
                type="button"
                onClick={() => navigate("/inherit-your-freedom/shop")}
                className="block mx-auto font-body text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                ← Back to Shop
              </button>
            </form>
          </div>
        </section>
      </main>
      <IYFFooter />
    </div>
  );
};

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}

const Field = ({ id, label, value, onChange, error, type = "text", autoComplete }: FieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="font-heading uppercase tracking-widest text-[11px] text-foreground">
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      aria-invalid={!!error}
      className="h-12 font-body bg-background border-border focus-visible:ring-secondary"
    />
    {error && <p className="font-body text-xs text-destructive">{error}</p>}
  </div>
);

export default InheritYourFreedomCheckout;
