/**
 * Bakes a real per-route <head> into the built output.
 *
 * This is a single-page app, so every URL used to be served the same
 * index.html - which meant every page shared one <title> and one og:image, and
 * a link to the Five-Fold page previewed as the Greece tour. Social crawlers
 * (Facebook, X, LinkedIn, iMessage, Slack) and the occasional search crawler
 * read the HTML as served and never run the app's JavaScript, so setting the
 * title from React cannot fix that on its own.
 *
 * For each route in src/lib/seo.ts this writes dist/<route>/index.html with the
 * block between <!-- meta:start --> and <!-- meta:end --> replaced. Vercel
 * checks the filesystem before applying the catch-all rewrite in vercel.json,
 * so these win for known routes and the SPA fallback still handles the rest.
 *
 * Runs automatically after `npm run build`.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { META_ROUTES, PAGE_META, SITE_URL } from "../src/lib/seo.ts";

const DIST = path.resolve(import.meta.dirname, "..", "dist");
const START = "<!-- meta:start -->";
const END = "<!-- meta:end -->";

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function block({ title, description, image, noIndex }, route) {
  const url = SITE_URL + (route === "/" ? "/" : route);
  const img = SITE_URL + image;
  const t = esc(title);
  const d = esc(description);

  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<meta name="robots" content="${noIndex ? "noindex, nofollow" : "index, follow"}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    ``,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Mike Signorelli" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    ``,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${esc(img)}" />`,
  ]
    .map((line) => (line ? `    ${line}` : ""))
    .join("\n");
}

const shell = await readFile(path.join(DIST, "index.html"), "utf8");
const from = shell.indexOf(START);
const to = shell.indexOf(END);
if (from === -1 || to === -1) {
  throw new Error(
    `index.html is missing the ${START} / ${END} markers - prerender-meta.mjs cannot place per-route tags.`,
  );
}

const head = shell.slice(0, from + START.length);
const tail = shell.slice(to);

for (const route of META_ROUTES) {
  const html = `${head}\n${block(PAGE_META[route], route)}\n    ${tail}`;
  const file =
    route === "/"
      ? path.join(DIST, "index.html")
      : path.join(DIST, route.replace(/^\//, ""), "index.html");

  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
  console.log(`  ${route.padEnd(34)} -> ${path.relative(DIST, file)}`);
}

console.log(`\nprerendered ${META_ROUTES.length} routes`);
