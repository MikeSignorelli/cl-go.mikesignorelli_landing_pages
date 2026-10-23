import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const DoNotSell = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const existing = JSON.parse(localStorage.getItem("ccpa-requests") || "[]");
    existing.push({
      id: crypto.randomUUID(),
      type: "do-not-sell",
      name: formData.name,
      email: formData.email,
      message: formData.message,
      status: "pending",
      date: new Date().toISOString(),
    });
    localStorage.setItem("ccpa-requests", JSON.stringify(existing));
    setSubmitted(true);
    toast.success("Your request has been submitted successfully.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="h-8 w-8 text-secondary" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Do Not Sell My Personal Information</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-10">Last updated: April 8, 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 font-body text-foreground/90 leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Your Right to Opt Out</h2>
            <p>
              Under the California Consumer Privacy Act (CCPA) and other applicable privacy laws, you have the right to opt out of the "sale" of your personal information. While we do not sell personal information in the traditional sense, certain data-sharing practices with third-party advertising and analytics partners may be considered a "sale" under the CCPA.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">What This Means</h2>
            <p>
              When you opt out, we will stop sharing your personal information with third parties for purposes that could be considered a "sale" under applicable law. This may include sharing data with advertising networks, data analytics providers, and social media platforms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Submit Your Request</h2>
            {submitted ? (
              <div className="bg-muted/50 border border-border rounded-sm p-6 text-center">
                <ShieldCheck className="h-10 w-10 text-green-500 mx-auto mb-3" />
                <p className="font-heading font-semibold text-lg text-foreground">Request Received</p>
                <p className="text-muted-foreground mt-2">
                  We have received your opt-out request and will process it within 15 business days. You will receive a confirmation email once your request has been fulfilled.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Additional Details (Optional)</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Any additional information..."
                    disabled={loading}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px] disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-foreground text-background font-heading text-sm font-medium py-3 px-8 rounded-sm hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Submitting...
                    </>
                  ) : (
                    "Submit Opt-Out Request"
                  )}
                </button>
              </form>
            )}
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Contact Us</h2>
            <p>
              If you have questions about this process, contact us at{" "}
              <a href="mailto:tech@brillmedia.co" className="text-secondary hover:text-secondary/80 transition-colors">
                tech@brillmedia.co
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DoNotSell;
