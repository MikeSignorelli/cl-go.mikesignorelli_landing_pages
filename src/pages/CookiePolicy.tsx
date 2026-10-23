import { useNavigate } from "react-router-dom";
import { ArrowLeft, Cookie } from "lucide-react";

const CookiePolicy = () => {
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
          <Cookie className="h-8 w-8 text-secondary" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Cookie Policy</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-10">Last updated: April 8, 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 font-body text-foreground/90 leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site. Cookies help us improve your experience on our website.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as page navigation and access to secure areas. The website cannot function properly without these cookies.</li>
              <li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the website experience.</li>
              <li><strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website and deliver advertisements on and through the website. These may include cookies from services such as Google Analytics, Facebook Pixel, and other advertising platforms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Managing Cookies</h2>
            <p>
              You can control and manage cookies in various ways. Most browsers allow you to refuse or accept cookies, delete cookies, and set preferences. You can manage your cookie preferences through our cookie consent banner that appears when you first visit our website.
            </p>
            <p>
              Please note that removing or blocking cookies may impact your user experience and some functionality may no longer be available.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Cookie Retention</h2>
            <p>
              The length of time a cookie will remain on your device depends on whether it is a "persistent" or "session" cookie. Session cookies last until you stop browsing, while persistent cookies last until they expire or are deleted.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. When we post changes, we will revise the "Last Updated" date at the top of this policy.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at{" "}
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

export default CookiePolicy;
