/**
 * Regenerates the social-share (Open Graph) images in public/og/.
 *
 * Run with `npm run og`. Output is committed, so this only needs re-running
 * when the source art or the CARDS table below changes.
 *
 * Why this exists: the original og:image was a *signed* Google Storage URL
 * carrying an `Expires` timestamp. It expired on 2026-04-02 and every social
 * preview on the site silently lost its image. These are self-hosted and
 * permanent.
 *
 * Facebook / LinkedIn / X all want 1200x630 (1.91:1) and are unreliable with
 * WebP, so every card is emitted as a progressive JPEG.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "og");
const WIDTH = 1200;
const HEIGHT = 630;

/** Brand tokens, kept as HSL so they read the same as src/index.css. */
const TOKENS = {
  olive: [120, 11, 21],
  oliveDark: [120, 11, 14],
  gold: [36, 30, 51],
  cream: [40, 30, 95],
};

/** HSL (as written in index.css) -> {r,g,b}, so the two never drift apart. */
function hsl([h, s, l]) {
  const S = s / 100;
  const L = l / 100;
  const c = (1 - Math.abs(2 * L - 1)) * S;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const [r1, g1, b1] =
    hp < 1 ? [c, x, 0] :
    hp < 2 ? [x, c, 0] :
    hp < 3 ? [0, c, x] :
    hp < 4 ? [0, x, c] :
    hp < 5 ? [x, 0, c] : [c, 0, x];
  const m = L - c / 2;
  const to8 = (v) => Math.round((v + m) * 255);
  return { r: to8(r1), g: to8(g1), b: to8(b1) };
}

/**
 * `crop` covers the full card with the photo. `focus` is where the centre of
 * the 1.91:1 window sits vertically, 0 = top of frame, 1 = bottom; the tall
 * portraits need it well above 0.5 because the subject is seated low and a
 * plain centre or top crop takes the ceiling and cuts his head off.
 *
 * `inset` is for art that must not be cropped at all - a book cover or a square
 * logo - so it sits whole on a brand-coloured field.
 */
const CARDS = [
  { out: "greece-turkey-tour",      src: "src/assets/hero-greece.jpg",                 mode: "crop",  focus: 0.5 },
  { out: "five-fold-gift",          src: "src/assets/five-fold/mike-hero-new.webp",    mode: "crop",  focus: 0.46 },
  { out: "pastor-systems-audit",    src: "src/assets/psa/hero-pastor.webp",            mode: "crop",  focus: 0.34 },
  { out: "inherit-your-freedom",    src: "src/assets/inherit-your-freedom-book.webp",  mode: "inset", bg: "oliveDark", scale: 0.82 },
  { out: "church-systems-starter-kit", src: "src/assets/cssk-logo.webp",               mode: "inset", bg: "olive",     scale: 0.55 },
  { out: "default",                 src: "src/assets/mike-invitation.webp",            mode: "crop",  focus: 0.39 },
];

async function crop({ src, focus }) {
  const file = path.join(ROOT, src);
  const { width, height } = await sharp(file).metadata();

  // Scale so the art covers the card, then take the window ourselves - sharp's
  // named positions only offer top/centre/bottom, which is too coarse here.
  const scale = Math.max(WIDTH / width, HEIGHT / height);
  const w = Math.ceil(width * scale);
  const h = Math.ceil(height * scale);
  const top = Math.round(
    Math.min(Math.max(focus * h - HEIGHT / 2, 0), h - HEIGHT),
  );

  return sharp(file)
    .resize(w, h)
    .extract({ left: Math.round((w - WIDTH) / 2), top, width: WIDTH, height: HEIGHT });
}

async function inset({ src, bg, scale }) {
  const field = hsl(TOKENS[bg]);
  // Fit the art inside `scale` of the card height, keeping its aspect intact.
  const box = Math.round(HEIGHT * scale);
  // PNG keeps the logo's transparency so it blends into the field below.
  const art = await sharp(path.join(ROOT, src))
    .resize(box, box, { fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();

  return sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: field },
  }).composite([{ input: art, gravity: "centre" }]);
}

await mkdir(OUT_DIR, { recursive: true });

for (const card of CARDS) {
  const pipeline = card.mode === "crop" ? await crop(card) : await inset(card);
  const file = path.join(OUT_DIR, `${card.out}.jpg`);
  const { size } = await pipeline
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(file);
  console.log(
    `${String(Math.round(size / 1024)).padStart(4)} kB  og/${card.out}.jpg` +
      `  (${card.mode}${card.focus !== undefined ? ` focus ${card.focus}` : ""} <- ${card.src})`,
  );
}
