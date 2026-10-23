import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Scale } from "lucide-react";

const CCPAInfo = () => {
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
          <Scale className="h-8 w-8 text-secondary" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold">California Consumer Privacy Act (CCPA)</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-10">Last updated: April 8, 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 font-body text-foreground/90 leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Your Rights Under the CCPA</h2>
            <p>
              If you are a California resident, you have certain rights regarding your personal information under the California Consumer Privacy Act (CCPA). This page explains those rights and how you can exercise them.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Right to Know</h2>
            <p>
              You have the right to request that we disclose certain information about our collection and use of your personal information over the past 12 months. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The categories of personal information we collected about you</li>
              <li>The categories of sources from which personal information is collected</li>
              <li>Our business or commercial purpose for collecting or selling personal information</li>
              <li>The categories of third parties with whom we share personal information</li>
              <li>The specific pieces of personal information we collected about you</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Right to Delete</h2>
            <p>
              You have the right to request that we delete any of your personal information that we collected and retained, subject to certain exceptions. Once we receive and confirm your verifiable consumer request, we will delete your personal information from our records unless an exception applies.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Right to Opt-Out of Sale</h2>
            <p>
              You have the right to direct us not to sell your personal information at any time. To exercise this right, please visit our{" "}
              <Link to="/do-not-sell-my-info" className="text-secondary hover:text-secondary/80 transition-colors">
                Do Not Sell My Personal Information
              </Link>{" "}
              page.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Right to Non-Discrimination</h2>
            <p>
              We will not discriminate against you for exercising any of your CCPA rights. Unless permitted by the CCPA, we will not deny you goods or services, charge you different prices, provide a different quality of service, or suggest that you may receive a different price or quality of goods or services.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Categories of Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identifiers:</strong> Name, email address, IP address</li>
              <li><strong>Internet Activity:</strong> Browsing history, search history, interaction with our website</li>
              <li><strong>Geolocation Data:</strong> Approximate physical location</li>
              <li><strong>Inferences:</strong> Profile reflecting preferences, characteristics, and behavior</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">How to Submit a Request</h2>
            <p>To exercise any of the rights described above, you may submit a verifiable consumer request by:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Emailing us at{" "}
                <a href="mailto:tech@brillmedia.co" className="text-secondary hover:text-secondary/80 transition-colors">
                  tech@brillmedia.co
                </a>
              </li>
              <li>
                Submitting a request through our{" "}
                <Link to="/do-not-sell-my-info" className="text-secondary hover:text-secondary/80 transition-colors">
                  Do Not Sell My Info
                </Link>{" "}
                page
              </li>
            </ul>
            <p>
              We will respond to verifiable consumer requests within 45 days of receipt. If we require more time (up to 90 days), we will inform you in writing of the reason and extension period.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Contact Us</h2>
            <p>
              If you have questions about the CCPA or your rights, contact us at{" "}
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

export default CCPAInfo;
