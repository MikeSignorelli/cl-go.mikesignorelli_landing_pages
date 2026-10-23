import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Map } from "lucide-react";

const pages = [
  { name: "Greece & Turkey Tour", path: "/greece-turkey-tour", description: "Walk in the footsteps of the Apostle Paul on this transformative journey" },
  { name: "Tour Thank You", path: "/greece-turkey-tour-thank-you", description: "Confirmation page for tour registration" },
  { name: "Five-Fold Gift Assessment", path: "/five-fold-gift", description: "Discover your unique five-fold ministry gifting" },
  { name: "Pastor Systems Audit", path: "/pastor-systems-audit", description: "Diagnose your church's operational health" },
  { name: "Pastor Systems Audit - Thank You", path: "/pastor-systems-audit-thank-you", description: "Confirmation page for systems audit" },
];

const legalPages = [
  { name: "Cookie Policy", path: "/cookie-policy", description: "How we use cookies on this website" },
  { name: "Do Not Sell My Info", path: "/do-not-sell-my-info", description: "Opt out of personal information sharing" },
  { name: "CCPA", path: "/ccpa", description: "California Consumer Privacy Act rights" },
  { name: "Sitemap", path: "/sitemap", description: "All pages on this website" },
];

const externalLinks = [
  { name: "Privacy Policy", href: "https://mikesignorelli.com/privacy-policy" },
  { name: "Terms of Use", href: "https://mikesignorelli.com/terms-of-use" },
  { name: "Contact", href: "https://mikesignorelli.com/contact" },
];

const SitemapPage = () => {
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
          <Map className="h-8 w-8 text-secondary" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Sitemap</h1>
        </div>

        <p className="text-muted-foreground mb-10 font-body">
          A complete list of all pages available on this website.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Main Pages</h2>
            <div className="space-y-3">
              {pages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="block border border-border rounded-sm p-4 hover:bg-muted/50 transition-colors group"
                >
                  <p className="font-heading font-medium text-foreground group-hover:text-secondary transition-colors">
                    {page.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{page.description}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1 font-mono">{page.path}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Legal & Compliance</h2>
            <div className="space-y-3">
              {legalPages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="block border border-border rounded-sm p-4 hover:bg-muted/50 transition-colors group"
                >
                  <p className="font-heading font-medium text-foreground group-hover:text-secondary transition-colors">
                    {page.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{page.description}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1 font-mono">{page.path}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">External Links</h2>
            <div className="space-y-3">
              {externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-border rounded-sm p-4 hover:bg-muted/50 transition-colors group"
                >
                  <p className="font-heading font-medium text-foreground group-hover:text-secondary transition-colors">
                    {link.name}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1 font-mono">{link.href}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
