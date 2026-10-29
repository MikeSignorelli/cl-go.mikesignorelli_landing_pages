import { describe, it, expect, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import { PAGE_META, META_ROUTES, SITE_URL, metaForPath } from "@/lib/seo";

const content = (selector: string) =>
  document.head.querySelector<HTMLMetaElement>(selector)?.content;

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <PageMeta />
      <Routes>
        <Route path="*" element={null} />
      </Routes>
    </MemoryRouter>,
  );

describe("metaForPath", () => {
  it("resolves every route in the table", () => {
    for (const route of META_ROUTES) {
      expect(metaForPath(route)).toBe(PAGE_META[route]);
    }
  });

  it("ignores a trailing slash", () => {
    expect(metaForPath("/five-fold-gift/")).toBe(PAGE_META["/five-fold-gift"]);
  });

  it("falls back to a noindex brand card for an unknown path", () => {
    const meta = metaForPath("/nope");
    expect(meta.noIndex).toBe(true);
    expect(meta.image).toBe("/og/default.jpg");
  });

  it("gives every funnel page its own title and image", () => {
    const funnels = [
      "/greece-turkey-tour",
      "/five-fold-gift",
      "/pastor-systems-audit",
      "/inherit-your-freedom",
      "/church-systems-starter-kit",
    ];
    const titles = funnels.map((r) => PAGE_META[r].title);
    const images = funnels.map((r) => PAGE_META[r].image);
    expect(new Set(titles).size).toBe(funnels.length);
    expect(new Set(images).size).toBe(funnels.length);
  });

  it("keeps post-conversion and admin pages out of the index", () => {
    // Listed rather than pattern-matched: the old version keyed off route names
    // containing "thank-you"/"checkout", which silently stopped covering these
    // pages when the IYF flow moved to /success and /cancel.
    const noIndex = new Set([
      "/greece-turkey-tour-thank-you",
      "/pastor-systems-audit-thank-you",
      "/inherit-your-freedom/checkout",
      "/inherit-your-freedom/success",
      "/inherit-your-freedom/cancel",
      "/admin",
      "/admin/dashboard",
    ]);
    for (const route of META_ROUTES) {
      expect(Boolean(PAGE_META[route].noIndex)).toBe(noIndex.has(route));
    }
    // Every listed route must still exist, so a rename cannot quietly drop one.
    for (const route of noIndex) expect(META_ROUTES).toContain(route);
  });

  it("points og:image at a generated file, never an expiring signed URL", () => {
    for (const route of META_ROUTES) {
      expect(PAGE_META[route].image).toMatch(/^\/og\/[a-z-]+\.jpg$/);
    }
  });
});

describe("<PageMeta>", () => {
  beforeEach(() => {
    document.head.querySelectorAll("meta, link[rel=canonical]").forEach((el) => el.remove());
    document.title = "";
  });

  it("writes the route's tags into <head>", () => {
    renderAt("/pastor-systems-audit");
    const meta = PAGE_META["/pastor-systems-audit"];

    expect(document.title).toBe(meta.title);
    expect(content('meta[name="description"]')).toBe(meta.description);
    expect(content('meta[property="og:title"]')).toBe(meta.title);
    expect(content('meta[property="og:image"]')).toBe(SITE_URL + meta.image);
    expect(content('meta[name="twitter:image"]')).toBe(SITE_URL + meta.image);
    expect(content('meta[name="twitter:card"]')).toBe("summary_large_image");
    expect(content('meta[name="robots"]')).toBe("index, follow");
    expect(
      document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href,
    ).toBe(`${SITE_URL}/pastor-systems-audit`);
  });

  it("marks an admin route noindex", () => {
    renderAt("/admin");
    expect(content('meta[name="robots"]')).toBe("noindex, nofollow");
  });

  it("follows client-side navigation instead of keeping the first page's tags", () => {
    const Go = ({ to }: { to: string }) => {
      const navigate = useNavigate();
      return <button onClick={() => navigate(to)}>go</button>;
    };

    render(
      <MemoryRouter initialEntries={["/five-fold-gift"]}>
        <PageMeta />
        <Go to="/inherit-your-freedom" />
      </MemoryRouter>,
    );
    expect(document.title).toBe(PAGE_META["/five-fold-gift"].title);

    // A real in-app navigation, which is what the <head> has to react to.
    fireEvent.click(screen.getByText("go"));

    expect(document.title).toBe(PAGE_META["/inherit-your-freedom"].title);
    expect(content('meta[property="og:image"]')).toBe(
      SITE_URL + PAGE_META["/inherit-your-freedom"].image,
    );
    expect(
      document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href,
    ).toBe(`${SITE_URL}/inherit-your-freedom`);
  });

  it("does not stack duplicate tags across navigations", () => {
    renderAt("/trust");
    renderAt("/ccpa");
    expect(document.head.querySelectorAll('meta[property="og:title"]').length).toBe(1);
    expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
  });
});
