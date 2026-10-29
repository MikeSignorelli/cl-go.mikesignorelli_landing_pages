/**
 * One table of per-route <head> metadata, used twice:
 *
 *  - at runtime by <PageMeta>, so the tab title and share tags follow
 *    client-side navigation;
 *  - at build time by scripts/prerender-meta.mjs, which bakes a real static
 *    <head> into dist/<route>/index.html.
 *
 * The build-time half is the one that matters for sharing: Facebook, X,
 * LinkedIn, iMessage and Slack read the HTML as served and never run the app's
 * JavaScript, so a title set only from React is invisible to them.
 */

/** Absolute origin, required because og:image and canonical cannot be relative. */
export const SITE_URL = "https://go.mikesignorelli.com";
export const SITE_NAME = "Mike Signorelli";

const TITLE_SUFFIX = " - Mike Signorelli";

export interface PageMeta {
  /** Full <title>; already includes the brand suffix. */
  title: string;
  description: string;
  /** Root-relative path into /public/og. */
  image: string;
  /** Keep post-conversion and admin pages out of the index. */
  noIndex?: boolean;
}

const OG = {
  greece: "/og/greece-turkey-tour.jpg",
  fiveFold: "/og/five-fold-gift.jpg",
  audit: "/og/pastor-systems-audit.jpg",
  freedom: "/og/inherit-your-freedom.jpg",
  starterKit: "/og/church-systems-starter-kit.jpg",
  default: "/og/default.jpg",
} as const;

export const DEFAULT_META: PageMeta = {
  title: "Mike Signorelli",
  description:
    "Resources, tools and teaching from Pastor Mike Signorelli for church leaders and their teams.",
  image: OG.default,
};

const GREECE: PageMeta = {
  title: `Greece and Turkey Tour${TITLE_SUFFIX}`,
  description:
    "11 days. 15 biblical sites. A 3-night Greek Islands cruise. Expert biblical scholars.",
  image: OG.greece,
};

export const PAGE_META: Record<string, PageMeta> = {
  // "/" redirects to the Greece tour, so it shares that page's card rather
  // than advertising something the visitor never sees.
  "/": GREECE,
  "/greece-turkey-tour": GREECE,
  "/greece-turkey-tour-thank-you": {
    title: `Thank You - Greece and Turkey Tour${TITLE_SUFFIX}`,
    description: "Thanks - we have your request and will be in touch shortly.",
    image: OG.greece,
    noIndex: true,
  },

  "/five-fold-gift": {
    title: `Five-Fold Gift${TITLE_SUFFIX}`,
    description:
      "Discover your five-fold gift and unlock the calling you have been missing. Take the free assessment.",
    image: OG.fiveFold,
  },

  "/pastor-systems-audit": {
    title: `Pastor Systems Audit${TITLE_SUFFIX}`,
    description:
      "Is your church built to scale? Take the free systems audit and find out in 5 minutes.",
    image: OG.audit,
  },
  "/pastor-systems-audit-thank-you": {
    title: `Thank You - Pastor Systems Audit${TITLE_SUFFIX}`,
    description: "Thanks - your systems audit results are on the way.",
    image: OG.audit,
    noIndex: true,
  },

  "/church-systems-starter-kit": {
    title: `Church Systems Starter Kit${TITLE_SUFFIX}`,
    description:
      "Every template, script and tool for all 3 Core Systems - plug-and-play, customizable to your church, ready to implement this week.",
    image: OG.starterKit,
  },

  "/inherit-your-freedom": {
    title: `Inherit Your Freedom${TITLE_SUFFIX}`,
    description:
      "Your gift is discovered. Now it is time to inherit your freedom. The Special Ministry Edition by Pastor Mike Signorelli.",
    image: OG.freedom,
  },
  "/inherit-your-freedom/shop": {
    title: `Order Inherit Your Freedom${TITLE_SUFFIX}`,
    description:
      "Order the Special Ministry Edition of Inherit Your Freedom by Pastor Mike Signorelli.",
    image: OG.freedom,
  },
  "/inherit-your-freedom/checkout": {
    title: `Complete Your Order${TITLE_SUFFIX}`,
    description: "Complete your order for Inherit Your Freedom.",
    image: OG.freedom,
    noIndex: true,
  },
  "/inherit-your-freedom/success": {
    title: `Order Confirmed${TITLE_SUFFIX}`,
    description: "Your order is confirmed.",
    image: OG.freedom,
    noIndex: true,
  },
  "/inherit-your-freedom/cancel": {
    title: `Checkout Cancelled${TITLE_SUFFIX}`,
    description: "Your checkout was cancelled and you have not been charged.",
    image: OG.freedom,
    noIndex: true,
  },

  "/trust": {
    title: `Trust & Security${TITLE_SUFFIX}`,
    description:
      "How we protect your information and handle payments on this site.",
    image: OG.default,
  },
  "/cookie-policy": {
    title: `Cookie Policy${TITLE_SUFFIX}`,
    description:
      "How this site uses cookies and similar technologies, and how to control them.",
    image: OG.default,
  },
  "/do-not-sell-my-info": {
    title: `Do Not Sell My Personal Information${TITLE_SUFFIX}`,
    description:
      "Submit a request to opt out of the sale or sharing of your personal information.",
    image: OG.default,
  },
  "/ccpa": {
    title: `California Consumer Privacy Act (CCPA)${TITLE_SUFFIX}`,
    description:
      "Your rights under the California Consumer Privacy Act, and how to exercise them.",
    image: OG.default,
  },
  "/sitemap": {
    title: `Sitemap${TITLE_SUFFIX}`,
    description: "Every page on this site, in one place.",
    image: OG.default,
  },

  "/admin": {
    title: `Admin Login${TITLE_SUFFIX}`,
    description: "Administrator sign-in.",
    image: OG.default,
    noIndex: true,
  },
  "/admin/dashboard": {
    title: `Admin Dashboard${TITLE_SUFFIX}`,
    description: "Administrator dashboard.",
    image: OG.default,
    noIndex: true,
  },
};

/** Routes the prerenderer emits a static <head> for. */
export const META_ROUTES = Object.keys(PAGE_META);

/** Trailing slashes aside, an unknown path (the 404) falls back to the brand card. */
export function metaForPath(pathname: string): PageMeta {
  const clean =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return PAGE_META[clean] ?? { ...DEFAULT_META, noIndex: true };
}

export const absoluteUrl = (p: string) => `${SITE_URL}${p}`;
