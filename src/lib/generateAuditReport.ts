import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const SECTION_NAMES = [
  "Guest Experience Engine",
  "Volunteer Pipeline",
  "Leadership Pathway",
  "Marriage Health",
];

const SCORE_TIERS = [
  { range: [0, 12] as [number, number], label: "Critical" },
  { range: [13, 22] as [number, number], label: "Foundation Needed" },
  { range: [23, 33] as [number, number], label: "Growth Ready" },
  { range: [34, 40] as [number, number], label: "Scaling" },
  { range: [41, 45] as [number, number], label: "Exceptional" },
];

const getTierLabel = (score: number) => {
  for (const tier of SCORE_TIERS) {
    if (score >= tier.range[0] && score <= tier.range[1]) return tier.label;
  }
  return SCORE_TIERS[0].label;
};

export interface AuditReportData {
  firstName: string;
  totalScore: number;
  sectionScores: number[];
  sectionMaxScores: number[];
  bottleneck: string;
}

export async function generateAuditReportPDF(data: AuditReportData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const dark = rgb(0.18, 0.22, 0.18);
  const gold = rgb(0.76, 0.6, 0.26);
  const muted = rgb(0.45, 0.45, 0.45);
  const white = rgb(1, 1, 1);
  const bg = rgb(0.98, 0.97, 0.94);

  // Background
  page.drawRectangle({ x: 0, y: 0, width, height, color: bg });

  // Border
  const bInset = 20;
  page.drawRectangle({
    x: bInset, y: bInset,
    width: width - bInset * 2, height: height - bInset * 2,
    borderColor: dark, borderWidth: 1.5, color: bg,
  });

  let y = height - 60;

  // Title
  const title = "Pastor Systems Audit";
  let tw = helveticaBold.widthOfTextAtSize(title, 22);
  page.drawText(title, { x: (width - tw) / 2, y, font: helveticaBold, size: 22, color: dark });
  y -= 22;

  const subtitle = "Full Report";
  tw = helvetica.widthOfTextAtSize(subtitle, 14);
  page.drawText(subtitle, { x: (width - tw) / 2, y, font: helvetica, size: 14, color: muted });
  y -= 35;

  // Name
  const nameText = `Prepared for: ${data.firstName}`;
  tw = helveticaBold.widthOfTextAtSize(nameText, 13);
  page.drawText(nameText, { x: (width - tw) / 2, y, font: helveticaBold, size: 13, color: dark });
  y -= 40;

  // Overall Score Box
  const boxW = 300;
  const boxH = 70;
  const boxX = (width - boxW) / 2;
  page.drawRectangle({ x: boxX, y: y - boxH, width: boxW, height: boxH, color: dark, borderColor: dark, borderWidth: 0 });

  const scoreText = `${data.totalScore} / 45`;
  tw = helveticaBold.widthOfTextAtSize(scoreText, 28);
  page.drawText(scoreText, { x: (width - tw) / 2, y: y - 35, font: helveticaBold, size: 28, color: gold });

  const tierLabel = getTierLabel(data.totalScore);
  tw = helvetica.widthOfTextAtSize(tierLabel, 12);
  page.drawText(tierLabel, { x: (width - tw) / 2, y: y - 55, font: helvetica, size: 12, color: white });

  y -= boxH + 30;

  // Section Scores Table
  const tableX = 60;
  const tableW = width - 120;
  const rowH = 32;
  const headerH = 28;

  // Table header
  page.drawRectangle({ x: tableX, y: y - headerH, width: tableW, height: headerH, color: dark });
  page.drawText("System", { x: tableX + 10, y: y - 18, font: helveticaBold, size: 10, color: gold });
  page.drawText("Your Score", { x: tableX + 280, y: y - 18, font: helveticaBold, size: 10, color: gold });
  page.drawText("Max", { x: tableX + 380, y: y - 18, font: helveticaBold, size: 10, color: gold });
  y -= headerH;

  // Table rows
  for (let i = 0; i < SECTION_NAMES.length; i++) {
    const rowBg = i % 2 === 0 ? rgb(0.95, 0.94, 0.91) : bg;
    page.drawRectangle({ x: tableX, y: y - rowH, width: tableW, height: rowH, color: rowBg });
    page.drawText(SECTION_NAMES[i], { x: tableX + 10, y: y - 21, font: helvetica, size: 11, color: dark });
    page.drawText(`${data.sectionScores[i]} / ${data.sectionMaxScores[i]}`, { x: tableX + 280, y: y - 21, font: helveticaBold, size: 11, color: dark });
    page.drawText(`${data.sectionMaxScores[i]}`, { x: tableX + 380, y: y - 21, font: helvetica, size: 11, color: muted });
    y -= rowH;
  }

  y -= 25;

  // Bottleneck
  const bnLabel = "#1 Bottleneck: ";
  const bnValue = data.bottleneck;
  const bnLabelW = helveticaBold.widthOfTextAtSize(bnLabel, 12);
  const bnValueW = helvetica.widthOfTextAtSize(bnValue, 12);
  const bnTotalW = bnLabelW + bnValueW;
  const bnX = (width - bnTotalW) / 2;
  page.drawText(bnLabel, { x: bnX, y, font: helveticaBold, size: 12, color: rgb(0.8, 0.2, 0.2) });
  page.drawText(bnValue, { x: bnX + bnLabelW, y, font: helvetica, size: 12, color: dark });
  y -= 18;

  const bnSub = "This is where you start. Build this system FIRST.";
  tw = helvetica.widthOfTextAtSize(bnSub, 10);
  page.drawText(bnSub, { x: (width - tw) / 2, y, font: helvetica, size: 10, color: muted });

  // Footer
  const footer = "V1 Church | mikesignorelli.com";
  tw = helvetica.widthOfTextAtSize(footer, 9);
  page.drawText(footer, { x: (width - tw) / 2, y: 35, font: helvetica, size: 9, color: muted });

  return pdfDoc.save();
}
