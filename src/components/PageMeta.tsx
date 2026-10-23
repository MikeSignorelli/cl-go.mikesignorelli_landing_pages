import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { absoluteUrl, metaForPath, SITE_NAME } from "@/lib/seo";

/**
 * Keeps <head> in step with client-side navigation.
 *
 * Crawlers never get this far - they read the prerendered HTML that
 * scripts/prerender-meta.mjs writes at build time. This exists so the browser
 * tab, bookmarks and in-app share sheets show the right page once React has
 * taken over routing.
 */

type Attr = "name" | "property";

function upsertMeta(attr: Attr, key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

const PageMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = metaForPath(pathname);
    const url = absoluteUrl(pathname);
    const image = absoluteUrl(meta.image);

    document.title = meta.title;

    upsertMeta("name", "description", meta.description);
    upsertMeta("name", "robots", meta.noIndex ? "noindex, nofollow" : "index, follow");

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", meta.title);
    upsertMeta("property", "og:description", meta.description);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:url", url);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", meta.title);
    upsertMeta("name", "twitter:description", meta.description);
    upsertMeta("name", "twitter:image", image);

    upsertCanonical(url);
  }, [pathname]);

  return null;
};

export default PageMeta;
