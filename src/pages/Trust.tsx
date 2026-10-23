import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Database, Cookie, Mail, FileText } from "lucide-react";

const Trust = () => {
  const navigate = useNavigate();

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
          <Shield className="h-8 w-8 text-secondary" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Trust &amp; Security</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          This page is maintained by Mike Signorelli Ministries to answer common security and privacy
          questions about this website and the products sold through it.
        </p>
        <p className="text-sm text-muted-foreground mb-10">
          The site is hosted on the Lovable platform. The platform features described below are
          provided by Lovable - this page is informational and is not an independent certification
          or audit attestation.
        </p>

        <div className="prose prose-sm max-w-none space-y-10 font-body text-foreground/90 leading-relaxed">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-5 w-5 text-secondary" />
              <h2 className="font-heading text-xl font-semibold text-foreground m-0">Encryption in transit</h2>
            </div>
            <p>
              The site is served over HTTPS. Form submissions and checkout requests are encrypted in
              transit between your browser and our backend.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-5 w-5 text-secondary" />
              <h2 className="font-heading text-xl font-semibold text-foreground m-0">What we collect and why</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Lead forms</strong> (Greece tour interest, Five-Fold quiz, Pastor Systems Audit):
                name, email, phone, ZIP code, and the quiz-specific answers you provide. Used to follow
                up about the resource you requested.
              </li>
              <li>
                <strong>Checkout</strong> (Inherit Your Freedom): name, email, and payment details.
                Payment information is collected and processed by Stripe - we never see or store your
                full card number.
              </li>
              <li>
                <strong>Order records</strong>: we store the Stripe session ID, your email, and the
                payment status so we can re-send your purchase confirmation if needed.
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-secondary" />
              <h2 className="font-heading text-xl font-semibold text-foreground m-0">Subprocessors</h2>
            </div>
            <p>The website uses the following service providers to deliver its functionality:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Lovable</strong> - website hosting and managed backend (database, edge functions, file storage)</li>
              <li><strong>Stripe</strong> - payment processing for book and course purchases</li>
              <li><strong>Resend</strong> - transactional email delivery (order confirmations, bonus resources)</li>
              <li><strong>Zapier</strong> - delivers lead form submissions to our internal CRM/spreadsheet</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Cookie className="h-5 w-5 text-secondary" />
              <h2 className="font-heading text-xl font-semibold text-foreground m-0">Cookies and tracking</h2>
            </div>
            <p>
              We use a small number of cookies for essential site functionality and to remember your
              consent choices. You can review the details on our{" "}
              <Link to="/cookie-policy" className="text-secondary underline hover:no-underline">
                Cookie Policy
              </Link>{" "}
              page. California residents can submit a "Do Not Sell or Share My Personal Information"
              request via our{" "}
              <Link to="/do-not-sell-my-info" className="text-secondary underline hover:no-underline">
                Do Not Sell My Info
              </Link>{" "}
              page.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-secondary" />
              <h2 className="font-heading text-xl font-semibold text-foreground m-0">Your privacy rights</h2>
            </div>
            <p>
              You can request access to, correction of, or deletion of the personal information we
              hold about you. California residents have additional rights described on our{" "}
              <Link to="/ccpa" className="text-secondary underline hover:no-underline">
                CCPA
              </Link>{" "}
              page. To submit a request, email us using the contact below.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-5 w-5 text-secondary" />
              <h2 className="font-heading text-xl font-semibold text-foreground m-0">Reporting a security concern</h2>
            </div>
            <p>
              If you believe you've found a security vulnerability or have a question about how your
              data is handled, please email{" "}
              <a href="mailto:support@mikesignorelli.com" className="text-secondary underline hover:no-underline">
                support@mikesignorelli.com
              </a>
              . Please include enough detail to reproduce the issue. Do not include any third party's
              personal data in your report.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Shared responsibility</h2>
            <p>
              The Lovable platform provides hosting, database, and authentication infrastructure.
              Mike Signorelli Ministries is responsible for the content of this site, the data we
              choose to collect through it, and how we use that data. You are responsible for
              keeping your account email and any download links you receive private.
            </p>
          </section>

          <p className="text-sm text-muted-foreground">Last updated: June 22, 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Trust;
