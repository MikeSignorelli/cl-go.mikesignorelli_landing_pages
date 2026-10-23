import { useState } from "react";
import { Loader2 } from "lucide-react";
import { usePSAQuiz, type ChurchSize } from "@/context/PSAQuizContext";
import { collectFormFields } from "@/lib/collectFormFields";
import { persistContact } from "@/lib/submitLead";
import { sendToZapier, ZAPIER_WEBHOOK_URL_PSA } from "@/lib/sendToZapier";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock } from "lucide-react";

const churchSizeOptions: { value: ChurchSize; label: string }[] = [
  { value: "under-100", label: "Under 100" },
  { value: "100-200", label: "100-200" },
  { value: "200-300", label: "200-300" },
  { value: "300-500", label: "300-500" },
];

const PSAEmailCapture = () => {
  const { setUserInfo, goToIntro } = usePSAQuiz();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [churchSize, setChurchSize] = useState<ChurchSize | "">("");
  const [zipCode, setZipCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim()) e.lastName = "Last name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!contactNumber.trim()) e.contactNumber = "Contact number is required";
    else if (!/^[+\d][\d\s\-().]{6,}$/.test(contactNumber)) e.contactNumber = "Enter a valid phone number";
    if (!churchSize) e.churchSize = "Please select your church size";
    if (!zipCode.trim()) e.zipCode = "ZIP code is required";
    else if (!/^[A-Za-z0-9\s\-]{3,10}$/.test(zipCode.trim())) e.zipCode = "Enter a valid ZIP code";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    if (submitting) return;
    const form = e.currentTarget;
    setSubmitting(true);

    setUserInfo({
      firstName,
      lastName,
      email,
      churchSize: churchSize as ChurchSize,
      zipCode,
      contactNumber,
    });

    const fields = collectFormFields(form);
    persistContact("pastor-systems-audit", fields);
    sendToZapier("pastor-systems-audit", "Lead", fields, ZAPIER_WEBHOOK_URL_PSA).catch((err) => {
      console.error("[Lead] Webhook error:", err);
    });

    goToIntro();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      <div className="w-full max-w-md">
        <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-center mb-3 text-primary">
          Let's Diagnose Your Church's Growth Barriers
        </h2>

        <p className="font-body text-center text-muted-foreground text-sm md:text-base leading-relaxed mb-8">
          Enter your information below. Your personalized Systems Score,
          bottleneck diagnosis, and 90-day action plan will be delivered
          immediately.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="psa-firstName" className="text-sm font-medium font-heading text-primary">
                First Name
              </label>
              <Input
                id="psa-firstName"
                name="First name"
                placeholder="Your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={submitting}
                className="h-12"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="psa-lastName" className="text-sm font-medium font-heading text-primary">
                Last Name
              </label>
              <Input
                id="psa-lastName"
                name="Last Name"
                placeholder="Your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={submitting}
                className="h-12"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="psa-email" className="text-sm font-medium font-heading text-primary">
                Email Address
              </label>
              <Input
                id="psa-email"
                name="Email address"
                type="email"
                placeholder="pastor@yourchurch.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="h-12"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="psa-contactNumber" className="text-sm font-medium font-heading text-primary">
                Phone Number
              </label>
              <Input
                id="psa-contactNumber"
                name="Phone Number"
                type="tel"
                placeholder="(555) 123-4567"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                disabled={submitting}
                className="h-12"
              />
              {errors.contactNumber && (
                <p className="text-sm text-destructive">{errors.contactNumber}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium font-heading text-primary">
              Church Size
            </label>
            <Select value={churchSize} onValueChange={(v) => setChurchSize(v as ChurchSize)} name="Church Size" disabled={submitting}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your church size" />
              </SelectTrigger>
              <SelectContent>
                {churchSizeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.churchSize && (
              <p className="text-sm text-destructive">{errors.churchSize}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="psa-zipCode" className="text-sm font-medium font-heading text-primary">
              Zip Code
            </label>
            <Input
              id="psa-zipCode"
              name="Zip Code"
              placeholder="e.g. 90210"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              disabled={submitting}
              className="h-12"
            />
            {errors.zipCode && (
              <p className="text-sm text-destructive">{errors.zipCode}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-12 text-base font-bold uppercase tracking-wider font-heading bg-secondary text-primary hover:bg-secondary/90 disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Submitting...
              </>
            ) : (
              "Start the Audit →"
            )}
          </Button>
        </form>

        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-5 text-center">
          <Lock className="w-3 h-3" />
          Your responses are confidential. No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default PSAEmailCapture;
