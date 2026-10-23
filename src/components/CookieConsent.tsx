import { useState, useEffect, useCallback } from "react";
import { X, Cookie, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "ms-cookie-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveAndClose = useCallback((prefs: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setVisible(false);
    setManageOpen(false);
  }, []);

  const handleAccept = () => {
    saveAndClose({ essential: true, analytics: true, marketing: true });
  };

  const handleConfirmChoices = () => {
    saveAndClose(preferences);
  };

  const handleDismiss = () => {
    saveAndClose({ essential: true, analytics: false, marketing: false });
  };

  if (!visible) return null;

  return (
    <>
      {/* Manage Cookies Modal Overlay */}
      {manageOpen && (
        <div
          className="fixed inset-0 z-[60] bg-foreground/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setManageOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Manage Cookies Modal */}
      {manageOpen && (
        <div
          className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[61] mx-auto max-w-lg bg-background rounded-sm border border-border shadow-2xl animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Manage cookie preferences"
        >
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-secondary" aria-hidden="true" focusable="false" />
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  Manage Cookies
                </h2>
              </div>
              <button
                onClick={() => setManageOpen(false)}
                className="p-1 rounded-sm hover:bg-muted transition-colors"
                aria-label="Close cookie preferences"
              >
                <X className="h-4 w-4 text-muted-foreground" aria-hidden="true" focusable="false" />
              </button>
            </div>

            <p className="text-xs text-foreground/70 uppercase tracking-[0.2em] font-medium mb-3 font-body">
              Managing your privacy preferences
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed mb-8 font-body">
              We use cookies and scripts to improve site performance, understand
              how you use our site, and deliver relevant content and advertising.
              You can choose which types of cookies to allow. Essential cookies
              are necessary for the site to function and cannot be turned off.
            </p>

            <h3 className="font-heading text-base font-semibold text-foreground mb-5">
              Manage Your Consent Preferences
            </h3>

            <div className="space-y-4 mb-8">
              {/* Essential */}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground font-body">Essential Cookies</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-body">Required for basic site functionality</p>
                </div>
                <span className="text-xs font-medium text-foreground/70 uppercase tracking-wider font-heading">
                  Always Active
                </span>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground font-body">Analytics Cookies</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-body">Help us understand site usage</p>
                </div>
                <button
                  role="switch"
                  aria-checked={preferences.analytics}
                  onClick={() =>
                    setPreferences((p) => ({ ...p, analytics: !p.analytics }))
                  }
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    preferences.analytics ? "bg-secondary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200",
                      preferences.analytics ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground font-body">Marketing Cookies</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-body">Used for targeted advertising</p>
                </div>
                <button
                  role="switch"
                  aria-checked={preferences.marketing}
                  onClick={() =>
                    setPreferences((p) => ({ ...p, marketing: !p.marketing }))
                  }
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    preferences.marketing ? "bg-secondary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200",
                      preferences.marketing ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={handleConfirmChoices}
              className="w-full bg-foreground text-background font-heading text-sm font-medium py-3 px-6 rounded-sm hover:bg-foreground/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Confirm & Save Choices
            </button>
          </div>
        </div>
      )}

      {/* Bottom Cookie Bar */}
      {!manageOpen && (
        <div
          className="fixed bottom-0 inset-x-0 z-50 animate-fade-in"
          role="region"
          aria-label="Cookie consent"
        >
          <div className="bg-foreground/95 backdrop-blur-md border-t border-border/20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Cookie className="h-5 w-5 text-secondary shrink-0 mt-0.5" aria-hidden="true" focusable="false" />
                  <p className="text-sm text-background/90 leading-relaxed font-body">
                    This website uses tracking technologies to enhance user
                    experience and to analyze performance. By clicking "Accept",
                    you consent to share information about your visit with third
                    parties.{" "}
                    <a
                      href="https://mikesignorelli.com/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary underline underline-offset-2 hover:text-secondary/80 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                  <button
                    onClick={handleAccept}
                    className="flex-1 md:flex-none bg-secondary text-secondary-foreground font-heading text-sm font-medium py-2.5 px-5 rounded-sm hover:bg-gold-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setManageOpen(true)}
                    className="flex-1 md:flex-none border border-background/30 text-background font-heading text-sm font-medium py-2.5 px-5 rounded-sm hover:bg-background/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/50"
                  >
                    Manage Cookies
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="p-2 rounded-sm hover:bg-background/10 transition-colors"
                    aria-label="Dismiss cookie banner"
                  >
                    <X className="h-4 w-4 text-background/90" aria-hidden="true" focusable="false" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
