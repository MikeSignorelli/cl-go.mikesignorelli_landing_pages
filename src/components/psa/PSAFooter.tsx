import { Facebook, Youtube, Instagram, Icon } from "lucide-react";
import type { IconNode } from "lucide-react";
import { Link } from "react-router-dom";

const tiktokIconNode: IconNode = [
  ["path", { d: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5", key: "tiktok" }],
];

const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768" />
    <path d="M13.277 10.723l6.723 -6.723" />
  </svg>
);

const GrokipediaIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const SoundCloudIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 17v-2" />
    <path d="M5 17v-6" />
    <path d="M8 17v-8" />
    <path d="M11 17V5" />
    <path d="M14 17V7" />
    <path d="M17 17v-4a3 3 0 0 1 3-3 3 3 0 0 1 3 3v4H14" />
  </svg>
);

const socialLinks = [
  { href: "https://www.facebook.com/PsMikeSignorelli", label: "Facebook", icon: Facebook },
  { href: "https://www.youtube.com/@MikeSignorelli_", label: "YouTube", icon: Youtube },
  { href: "https://www.instagram.com/mikesignorelli", label: "Instagram", icon: Instagram },
  { href: "https://www.tiktok.com/@mikesignorelli", label: "TikTok", icon: null },
  { href: "https://x.com/mikesignorelli", label: "X", icon: "x" as const },
  { href: "https://grokipedia.com/page/Mike_Signorelli", label: "Grokipedia", icon: "grokipedia" as const },
  { href: "https://soundcloud.com/psmikesignorelli", label: "SoundCloud", icon: "soundcloud" as const },
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

const PSAFooter = () => {
  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-heading text-[6rem] md:text-[10rem] lg:text-[16rem] font-bold uppercase tracking-wider text-primary-foreground/[0.04] leading-none text-center whitespace-nowrap">
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
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              {link.icon === "x" ? (
                <XIcon size={20} />
              ) : link.icon === "grokipedia" ? (
                <GrokipediaIcon size={20} />
              ) : link.icon === "soundcloud" ? (
                <SoundCloudIcon size={20} />
              ) : link.icon ? (
                <link.icon size={20} />
              ) : (
                <Icon iconNode={tiktokIconNode} size={20} />
              )}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 font-body text-sm flex-wrap justify-center">
          {footerLinks.map((link, i) => (
            <span key={link.label} className="flex items-center gap-4">
              {i > 0 && <span className="text-muted-foreground/40">|</span>}
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-secondary/80 transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link to={link.href} className="text-secondary hover:text-secondary/80 transition-colors">
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

export default PSAFooter;
