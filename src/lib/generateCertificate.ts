import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";

const GIFT_SUBTITLES: Record<string, string> = {
  Apostle: "The Builder",
  Prophet: "The Messenger",
  Evangelist: "The Gatherer",
  Shepherd: "The Guardian",
  Teacher: "The Guide",
};

export interface FiveFoldProfile {
  title: string;
  subtitle: string;
  description: string;
  howItShows: string[];
  growthEdge: string[];
  steps: string[];
}

export async function generateCertificatePDF(
  recipientName: string,
  giftName: string,
  profile?: FiveFoldProfile
): Promise<Uint8Array> {
  const templateUrl = "/certificate-template.pdf";
  const templateBytes = await fetch(templateUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(templateBytes);

  const page = pdfDoc.getPages()[0];
  const { width } = page.getSize();

  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const bg = rgb(0.9804, 0.9686, 0.9412);
  const olive = rgb(0.22, 0.27, 0.22);
  const gold = rgb(0.72, 0.62, 0.42);
  const darkGray = rgb(0.15, 0.15, 0.15);
  const midGray = rgb(0.25, 0.25, 0.25);
  const lightGray = rgb(0.45, 0.45, 0.45);
  const giftColor = rgb(0.82, 0.76, 0.62);

  // === STEP 1: Mask the ENTIRE page ===
  page.drawRectangle({ x: 0, y: 0, width: width, height: 612, color: bg });

  // === STEP 2: Set page dimensions ===
  const cropBottom = 30;
  const cropTop = 600;
  const padding = 24;
  page.setMediaBox(0, cropBottom, width, cropTop - cropBottom);
  page.setCropBox(0, cropBottom, width, cropTop - cropBottom);

  // === STEP 3: Draw border ===
  const bL = padding;
  const bB = cropBottom + padding;
  const bR = width - padding;
  const bT = cropTop - padding;
  page.drawLine({ start: { x: bL, y: bB }, end: { x: bR, y: bB }, thickness: 0.75, color: olive });
  page.drawLine({ start: { x: bR, y: bB }, end: { x: bR, y: bT }, thickness: 0.75, color: olive });
  page.drawLine({ start: { x: bR, y: bT }, end: { x: bL, y: bT }, thickness: 0.75, color: olive });
  page.drawLine({ start: { x: bL, y: bT }, end: { x: bL, y: bB }, thickness: 0.75, color: olive });

  const cx = width / 2;

  // === STEP 4: Draw all text content ===
  const headerText = "FIVE-FOLD GIFT";
  const headerW = helvetica.widthOfTextAtSize(headerText, 11);
  page.drawText(headerText, { x: cx - headerW / 2, y: 530, size: 11, font: helvetica, color: gold });

  const certText = "CERTIFICATE";
  const certSize = 38;
  const certW = timesRoman.widthOfTextAtSize(certText, certSize);
  page.drawText(certText, { x: cx - certW / 2, y: 470, size: certSize, font: timesRoman, color: olive });

  const nameSize = recipientName.length > 20 ? 22 : 28;
  const nameW = timesBold.widthOfTextAtSize(recipientName, nameSize);
  page.drawText(recipientName, { x: cx - nameW / 2, y: 415, size: nameSize, font: timesBold, color: darkGray });

  page.drawLine({ start: { x: cx - 160, y: 408 }, end: { x: cx + 160, y: 408 }, thickness: 0.5, color: gold });

  const identText = "has been identified as carrying the five-fold gift of";
  const identSize = 11;
  const identW = timesRoman.widthOfTextAtSize(identText, identSize);
  page.drawText(identText, { x: cx - identW / 2, y: 380, size: identSize, font: timesRoman, color: midGray });

  const giftUpper = giftName.toUpperCase();
  const spacedGift = giftUpper.split("").join("   ");
  const giftFontSize = 42;
  const giftW = timesRoman.widthOfTextAtSize(spacedGift, giftFontSize);
  page.drawText(spacedGift, { x: cx - giftW / 2, y: 320, size: giftFontSize, font: timesRoman, color: giftColor });

  const subtitle = GIFT_SUBTITLES[giftName] || profile?.subtitle || "";
  const subW = timesItalic.widthOfTextAtSize(subtitle, 14);
  page.drawText(subtitle, { x: cx - subW / 2, y: 300, size: 14, font: timesItalic, color: midGray });

  const divY = 275;
  const divHalf = 80;
  page.drawLine({ start: { x: cx - divHalf, y: divY }, end: { x: cx - 6, y: divY }, thickness: 0.5, color: gold });
  page.drawLine({ start: { x: cx + 6, y: divY }, end: { x: cx + divHalf, y: divY }, thickness: 0.5, color: gold });
  const ds = 3;
  page.drawLine({ start: { x: cx, y: divY + ds }, end: { x: cx + ds, y: divY }, thickness: 0.5, color: gold });
  page.drawLine({ start: { x: cx + ds, y: divY }, end: { x: cx, y: divY - ds }, thickness: 0.5, color: gold });
  page.drawLine({ start: { x: cx, y: divY - ds }, end: { x: cx - ds, y: divY }, thickness: 0.5, color: gold });
  page.drawLine({ start: { x: cx - ds, y: divY }, end: { x: cx, y: divY + ds }, thickness: 0.5, color: gold });

  const verseLine1 = '"And He gave some as apostles, and some as prophets, and some as evangelists,';
  const verseLine2 = 'and some as shepherds and teachers." - Ephesians 4:11';
  const verseSize = 9;
  const v1W = timesItalic.widthOfTextAtSize(verseLine1, verseSize);
  const v2W = timesItalic.widthOfTextAtSize(verseLine2, verseSize);
  page.drawText(verseLine1, { x: cx - v1W / 2, y: 240, size: verseSize, font: timesItalic, color: midGray });
  page.drawText(verseLine2, { x: cx - v2W / 2, y: 228, size: verseSize, font: timesItalic, color: midGray });

  const footerText = "V1 Church | mikesignorelli.com";
  const footerSize = 7;
  const footerW = helvetica.widthOfTextAtSize(footerText, footerSize);
  page.drawText(footerText, { x: cx - footerW / 2, y: bB + 8, size: footerSize, font: helvetica, color: lightGray });

  // === Profile pages ===
  if (profile) {
    const PAGE_W = 612;
    const PAGE_H = 792;
    const MARGIN_X = 56;
    const MARGIN_TOP = 110;
    const MARGIN_BOTTOM = 56;
    const CONTENT_W = PAGE_W - MARGIN_X * 2;

    const wrapText = (text: string, font: PDFFont, size: number, maxWidth: number): string[] => {
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const trial = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(trial, size) > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = trial;
        }
      }
      if (line) lines.push(line);
      return lines;
    };

    let currentPage: PDFPage | null = null;
    let cursorY = 0;
    let isFirstProfilePage = true;

    const drawHeaderAndFooter = (p: PDFPage, pageNum: number) => {
      // Background
      p.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: bg });
      // Olive border frame matching certificate
      const fPad = 24;
      const fL = fPad, fR = PAGE_W - fPad, fB = fPad, fT = PAGE_H - fPad;
      p.drawLine({ start: { x: fL, y: fB }, end: { x: fR, y: fB }, thickness: 0.75, color: olive });
      p.drawLine({ start: { x: fR, y: fB }, end: { x: fR, y: fT }, thickness: 0.75, color: olive });
      p.drawLine({ start: { x: fR, y: fT }, end: { x: fL, y: fT }, thickness: 0.75, color: olive });
      p.drawLine({ start: { x: fL, y: fT }, end: { x: fL, y: fB }, thickness: 0.75, color: olive });
      // Top brand
      const brand = "FIVE-FOLD GIFT PROFILE";
      const brandSize = 10;
      const brandW = helvetica.widthOfTextAtSize(brand, brandSize);
      p.drawText(brand, { x: PAGE_W / 2 - brandW / 2, y: PAGE_H - 56, size: brandSize, font: helvetica, color: gold });
      p.drawLine({ start: { x: PAGE_W / 2 - 60, y: PAGE_H - 64 }, end: { x: PAGE_W / 2 + 60, y: PAGE_H - 64 }, thickness: 0.5, color: gold });
      // Footer
      const f = `V1 Church | mikesignorelli.com  -  Page ${pageNum}`;
      const fW = helvetica.widthOfTextAtSize(f, 7);
      p.drawText(f, { x: PAGE_W / 2 - fW / 2, y: fB + 8, size: 7, font: helvetica, color: lightGray });
    };

    const newPage = () => {
      currentPage = pdfDoc.addPage([PAGE_W, PAGE_H]);
      drawHeaderAndFooter(currentPage, pdfDoc.getPageCount() - 1);
      cursorY = PAGE_H - MARGIN_TOP;
    };

    const ensureSpace = (needed: number) => {
      if (!currentPage || cursorY - needed < MARGIN_BOTTOM) {
        newPage();
      }
    };

    const drawHeading = (label: string) => {
      ensureSpace(36);
      currentPage!.drawText(label.toUpperCase(), {
        x: MARGIN_X,
        y: cursorY,
        size: 10,
        font: helveticaBold,
        color: gold,
      });
      cursorY -= 6;
      currentPage!.drawLine({
        start: { x: MARGIN_X, y: cursorY },
        end: { x: MARGIN_X + 40, y: cursorY },
        thickness: 1,
        color: gold,
      });
      cursorY -= 18;
    };

    const drawParagraph = (text: string, font: PDFFont, size: number, color = darkGray, lineHeight = 1.5) => {
      const lines = wrapText(text, font, size, CONTENT_W);
      const lh = size * lineHeight;
      for (const line of lines) {
        ensureSpace(lh);
        currentPage!.drawText(line, { x: MARGIN_X, y: cursorY, size, font, color });
        cursorY -= lh;
      }
    };

    const drawList = (items: string[], ordered: boolean) => {
      const size = 10.5;
      const lh = size * 1.5;
      const indent = 18;
      items.forEach((item, i) => {
        const marker = ordered ? `${i + 1}.` : "•";
        const lines = wrapText(item, timesRoman, size, CONTENT_W - indent);
        ensureSpace(lh * lines.length + 4);
        currentPage!.drawText(marker, {
          x: MARGIN_X,
          y: cursorY,
          size,
          font: ordered ? helveticaBold : helveticaBold,
          color: gold,
        });
        lines.forEach((line, idx) => {
          if (idx > 0) ensureSpace(lh);
          currentPage!.drawText(line, { x: MARGIN_X + indent, y: cursorY, size, font: timesRoman, color: midGray });
          cursorY -= lh;
        });
        cursorY -= 4;
      });
    };

    // Start first profile page
    newPage();

    // Title block
    const titleSize = 28;
    const titleW = timesBold.widthOfTextAtSize(profile.title.toUpperCase(), titleSize);
    currentPage!.drawText(profile.title.toUpperCase(), {
      x: PAGE_W / 2 - titleW / 2,
      y: cursorY,
      size: titleSize,
      font: timesBold,
      color: olive,
    });
    cursorY -= 28;

    const subSize = 13;
    const subText = `- ${profile.subtitle} -`;
    const subTextW = timesItalic.widthOfTextAtSize(subText, subSize);
    currentPage!.drawText(subText, {
      x: PAGE_W / 2 - subTextW / 2,
      y: cursorY,
      size: subSize,
      font: timesItalic,
      color: gold,
    });
    cursorY -= 24;

    const forText = `Prepared for ${recipientName}`;
    const forW = helvetica.widthOfTextAtSize(forText, 9);
    currentPage!.drawText(forText, {
      x: PAGE_W / 2 - forW / 2,
      y: cursorY,
      size: 9,
      font: helvetica,
      color: lightGray,
    });
    cursorY -= 28;

    drawHeading("Your Calling");
    drawParagraph(profile.description, timesRoman, 11, midGray, 1.55);
    cursorY -= 12;

    drawHeading("How It Shows Up in Daily Life");
    drawList(profile.howItShows, false);
    cursorY -= 8;

    drawHeading("Your Growth Edge");
    drawList(profile.growthEdge, false);
    cursorY -= 8;

    drawHeading("Activation Steps & Roadmap");
    drawList(profile.steps, true);
  }

  return await pdfDoc.save();
}

export function downloadPDF(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes.slice().buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
