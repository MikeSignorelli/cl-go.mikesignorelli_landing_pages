import { Facebook, Youtube, Instagram, Linkedin, Icon } from "lucide-react";
import type { IconNode } from "lucide-react";
import { Link } from "react-router-dom";

const tiktokIconNode: IconNode = [
  ["path", { d: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5", key: "tiktok" }],
];

const socialLinks = [
  { href: "https://www.facebook.com/PsMikeSignorelli", label: "Facebook", icon: Facebook },
  { href: "https://www.youtube.com/@MikeSignorelli_", label: "YouTube", icon: Youtube },
  { href: "https://www.instagram.com/mikesignorelli", label: "Instagram", icon: Instagram },
  { href: "https://www.tiktok.com/@mikesignorelli", label: "TikTok", icon: null },
  { href: "https://x.com/mikesignorelli", label: "X", icon: null },
  { href: "https://www.linkedin.com/in/mikesignorelli", label: "LinkedIn", icon: Linkedin },
];

const footerLinks = [
  { href: "https://mikesignorelli.com/privacy-policy", label: "Privacy Policy", external: true },
  { href: "https://mikesignorelli.com/terms-of-use", label: "Terms of Use", external: true },
  { href: "https://mikesignorelli.com/contact", label: "Contact", external: true },
  { href: "/cookie-policy", label: "Cookie Policy", external: false },
  { href: "/do-not-sell-my-info", label: "Do Not Sell My Info", external: false },
  { href: "/ccpa", label: "CCPA", external: false },
  { href: "/sitemap", label: "Sitemap", external: false },
];

const IYFFooter = () => {
  return (
    <footer className="bg-charcoal text-cream relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-heading text-[6rem] md:text-[10rem] lg:text-[16rem] font-bold uppercase tracking-wider text-cream/[0.04] leading-none text-center whitespace-nowrap">
          MIKESIGNORELLI
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-20 md:py-28 px-6 gap-6">
        <div className="flex items-center gap-5">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="w-5 h-5 flex items-center justify-center text-cream/70 hover:text-cream transition-colors"
            >
              {link.icon ? (
                <link.icon size={20} />
              ) : link.label === "X" ? (
                <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              ) : (
                <Icon iconNode={tiktokIconNode} size={20} />
              )}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 font-body text-sm flex-wrap justify-center">
          {footerLinks.map((link, i) => (
            <span key={link.label} className="flex items-center gap-4">
              {i > 0 && <span className="text-warm-gray/40">|</span>}
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-dark transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link to={link.href} className="text-gold hover:text-gold-dark transition-colors">
                  {link.label}
                </Link>
              )}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default IYFFooter;
