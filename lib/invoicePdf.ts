import {
  PDFDocument,
  PDFFont,
  PDFPage,
  rgb,
  StandardFonts,
} from "pdf-lib";

type RGB = ReturnType<typeof rgb>;

// ─── Types ────────────────────────────────────────────────────────────────────

export type InvoiceLine = {
  orderId: string;
  productName: string;
  qty: number;
  amount: number;
};

export type InvoicePayload = {
  customerName: string;
  transactionId: string;
  referenceLabel?: string;
  lines: InvoiceLine[];
  subtotalAmount?: number;
  discountAmount?: number;
  deliveryCharge?: number;
  totalAmount: number;
  addressText?: string;
};

// ─── Colour palette ───────────────────────────────────────────────────────────

const C = {
  forest:   rgb(0.106, 0.263, 0.196),  // #1B4332  deep green
  sage:     rgb(0.251, 0.569, 0.424),  // #40916C  medium green
  mint:     rgb(0.847, 0.953, 0.863),  // #D8F3DC  pale green zebra
  amber:    rgb(0.914, 0.769, 0.416),  // #E9C46A  warm gold
  ink:      rgb(0.102, 0.102, 0.180),  // #1A1A2E  near-black
  muted:    rgb(0.420, 0.443, 0.502),  // #6B7280  secondary grey
  rule:     rgb(0.718, 0.894, 0.780),  // #B7E4C7  light green rule
  white:    rgb(1, 1, 1),
  offWhite: rgb(0.973, 0.976, 0.957),  // #F8F9F4
} as const;

// ─── Layout constants (pt — 1 mm ≈ 2.835 pt) ─────────────────────────────────

const mm = 2.8346;

const PAGE_W = 595.28;   // A4
const PAGE_H = 841.89;
const MARGIN  = 18 * mm;
const L_STRIP = 4  * mm; // left sage strip width

// Content area
const CONTENT_X     = MARGIN + L_STRIP + 2 * mm;
const CONTENT_RIGHT = PAGE_W - MARGIN;
const CONTENT_W     = CONTENT_RIGHT - CONTENT_X;

// Header band
const HEADER_H     = 38 * mm;
const HEADER_TOP   = PAGE_H - HEADER_H;
const AMBER_BAR_H  = 2.5 * mm;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatMoney = (v: number) =>
  `NPR ${Number(v || 0).toLocaleString("en-NP")}`;

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

/** Draw a filled rectangle (pdf-lib y-origin = bottom-left). */
function fillRect(
  page: PDFPage,
  x: number, y: number, w: number, h: number,
  color: RGB,
) {
  page.drawRectangle({ x, y, width: w, height: h, color, borderWidth: 0 });
}

/** Draw a horizontal line. */
function hLine(
  page: PDFPage,
  x1: number, x2: number, y: number,
  color: RGB, thickness = 0.8,
) {
  page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, color, thickness });
}

interface TextOpts {
  font: PDFFont;
  size: number;
  color: RGB;
}

/** Draw left-aligned text. */
function drawText(
  page: PDFPage,
  text: string,
  x: number, y: number,
  opts: TextOpts,
) {
  page.drawText(text, { x, y, ...opts });
}

/** Draw right-aligned text. */
function drawTextRight(
  page: PDFPage,
  text: string,
  rightEdge: number, y: number,
  opts: TextOpts,
) {
  const w = opts.font.widthOfTextAtSize(text, opts.size);
  page.drawText(text, { x: rightEdge - w, y, ...opts });
}

/** Draw centred text. */
function drawTextCenter(
  page: PDFPage,
  text: string,
  cx: number, y: number,
  opts: TextOpts,
) {
  const w = opts.font.widthOfTextAtSize(text, opts.size);
  page.drawText(text, { x: cx - w / 2, y, ...opts });
}

/** Truncate a string so it fits within maxWidth pts. */
function fitText(text: string, font: PDFFont, size: number, maxWidth: number): string {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && font.widthOfTextAtSize(t + "…", size) > maxWidth) {
    t = t.slice(0, -1);
  }
  return t + "…";
}

// ─── Page decoration (header band + footer) ───────────────────────────────────

function decoratePage(
  page: PDFPage,
  fonts: { regular: PDFFont; bold: PDFFont; italic: PDFFont },
  transactionId: string,
  pageNum: number,
) {
  const { regular, bold } = fonts;

  // ── Amber accent bar at very top ──────────────────────────────────────────
  fillRect(page, 0, PAGE_H - AMBER_BAR_H, PAGE_W, AMBER_BAR_H, C.amber);

  // ── Forest green header band ──────────────────────────────────────────────
  fillRect(page, 0, HEADER_TOP, PAGE_W, HEADER_H - AMBER_BAR_H, C.forest);

 

  // ── Brand name ────────────────────────────────────────────────────────────
  drawText(page, "NITYAGRO", CONTENT_X, PAGE_H - 24 * mm, {
    font: bold, size: 20, color: C.white,
  });

  // ── Tagline ───────────────────────────────────────────────────────────────
  drawText(page, "Natural Produce · Pure from the Hills", CONTENT_X, PAGE_H - 31 * mm, {
    font: fonts.italic, size: 8, color: C.rule,
  });

  // ── "INVOICE" label (top-right of header) ─────────────────────────────────
  drawTextRight(page, "INVOICE", CONTENT_RIGHT, PAGE_H - 20 * mm, {
    font: bold, size: 12, color: C.amber,
  });
  drawTextRight(page, transactionId, CONTENT_RIGHT, PAGE_H - 28 * mm, {
    font: regular, size: 8, color: C.rule,
  });

  // ── Footer rule ───────────────────────────────────────────────────────────
  hLine(page, MARGIN, CONTENT_RIGHT, 14 * mm, C.rule, 0.8);

  // ── Footer text ───────────────────────────────────────────────────────────
  drawText(page, "NITYAGRO · Natural Produce · nityagro.com.np", CONTENT_X, 9 * mm, {
    font: regular, size: 7.5, color: C.muted,
  });
  drawTextRight(page, `Page ${pageNum}`, CONTENT_RIGHT, 9 * mm, {
    font: regular, size: 7.5, color: C.muted,
  });
}

// ─── Main generator ───────────────────────────────────────────────────────────

export async function generateInvoicePdf(payload: InvoicePayload): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();

  // Embed standard fonts (Helvetica family)
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italic  = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fonts   = { regular, bold, italic };

  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);

  // ── Page decoration ───────────────────────────────────────────────────────
  decoratePage(page, fonts, payload.transactionId, 1);

  // ── Cursor: we paint top-to-bottom, tracking Y position ──────────────────
  let y = PAGE_H - HEADER_H - 8 * mm; // start just below header band

  const now = new Date();
  const dateStr = formatDate(now);
  const referenceLabel = payload.referenceLabel || "TRANSACTION ID";

  // ── Sub-header row: INVOICE label + date ──────────────────────────────────
  drawText(page, "INVOICE", CONTENT_X, y, { font: bold, size: 11, color: C.amber });
  drawTextRight(page, dateStr, CONTENT_RIGHT, y, { font: regular, size: 9, color: C.muted });
  y -= 5 * mm;

  // ── Horizontal rule ───────────────────────────────────────────────────────
  hLine(page, CONTENT_X, CONTENT_RIGHT, y, C.rule, 0.5);
  y -= 6 * mm;

  // ── Billing info block ────────────────────────────────────────────────────
  const colL = CONTENT_W * 0.55;
  const colRx = CONTENT_X + colL + 4 * mm;

  // Left — Bill To
  drawText(page, "BILL TO", CONTENT_X, y, { font: bold, size: 8, color: C.sage });
  drawTextRight(page, referenceLabel.toUpperCase(), CONTENT_RIGHT, y, { font: bold, size: 8, color: C.sage });
  y -= 5 * mm;

  drawText(page, payload.customerName, CONTENT_X, y, { font: bold, size: 12, color: C.forest });
  drawTextRight(page, payload.transactionId, CONTENT_RIGHT, y, {
    font: regular, size: 9.5, color: C.ink,
  });
  y -= 5 * mm;

  if (payload.addressText) {
    const addr = fitText(payload.addressText, regular, 8.5, colL - 4 * mm);
    drawText(page, addr, CONTENT_X, y, { font: regular, size: 8.5, color: C.muted });
    y -= 4 * mm;
  }

  // Right — Date Issued
  drawTextRight(page, "DATE ISSUED", CONTENT_RIGHT, y - (payload.addressText ? 0 : 0), {
    font: bold, size: 8, color: C.sage,
  });
  // Align date issued with address line if present
  const dateIssuedY = payload.addressText ? y : y;
  drawTextRight(page, dateStr, CONTENT_RIGHT, dateIssuedY - 5 * mm, {
    font: regular, size: 9.5, color: C.ink,
  });

  y -= 10 * mm;

  // ── Line-items table ──────────────────────────────────────────────────────
  const colOrder   = 18 * mm;
  const colQty     = 18 * mm;
  const colUnit    = 26 * mm;
  const colAmount  = 28 * mm;
  const colProduct = CONTENT_W - colOrder - colQty - colUnit - colAmount;
  const COL = { order: colOrder, product: colProduct, qty: colQty, unit: colUnit, amount: colAmount };

  const colX = {
    order:   CONTENT_X,
    product: CONTENT_X + COL.order,
    qty:     CONTENT_X + COL.order + COL.product,
    unit:    CONTENT_X + COL.order + COL.product + COL.qty,
    amount:  CONTENT_X + COL.order + COL.product + COL.qty + COL.unit,
  };

  const ROW_H   = 8.5 * mm;
  const HEAD_H  = 9   * mm;

  // Table header background
  fillRect(page, CONTENT_X, y - HEAD_H, CONTENT_W, HEAD_H, C.forest);

  const headY = y - HEAD_H + 2.8 * mm;
  const headOpts = (align: "left" | "right", rightEdge?: number) =>
    ({ font: bold, size: 8.5, color: C.white } as TextOpts);

  drawText(page, "ORDER",   colX.order,   headY, headOpts("left"));
  drawText(page, "PRODUCT", colX.product, headY, headOpts("left"));
  drawTextRight(page, "QTY",    colX.qty    + COL.qty,    headY, { font: bold, size: 8.5, color: C.white });
  drawTextRight(page, "UNIT",   colX.unit   + COL.unit,   headY, { font: bold, size: 8.5, color: C.white });
  drawTextRight(page, "AMOUNT", colX.amount + COL.amount, headY, { font: bold, size: 8.5, color: C.white });

  y -= HEAD_H;

  // Data rows
  payload.lines.forEach((line, i) => {
    const isZebra = i % 2 === 1;
    if (isZebra) {
      fillRect(page, CONTENT_X, y - ROW_H, CONTENT_W, ROW_H, C.mint);
    }

    // Separator rule
    hLine(page, CONTENT_X, CONTENT_RIGHT, y, C.rule, 0.4);

    const rowY = y - ROW_H + 2.5 * mm;
    const unitPrice = line.qty ? line.amount / line.qty : 0;
    const productText = fitText(line.productName, regular, 9, COL.product - 4 * mm);

    drawText(page, `#${line.orderId}`,      colX.order,   rowY, { font: regular, size: 8.5, color: C.muted });
    drawText(page, productText,             colX.product, rowY, { font: regular, size: 9,   color: C.ink });
    drawTextRight(page, String(line.qty),   colX.qty    + COL.qty,    rowY, { font: regular, size: 9, color: C.ink });
    drawTextRight(page, formatMoney(unitPrice), colX.unit + COL.unit, rowY, { font: regular, size: 9, color: C.ink });
    drawTextRight(page, formatMoney(line.amount), colX.amount + COL.amount, rowY, { font: bold, size: 9, color: C.ink });

    y -= ROW_H;
  });

  // Bottom rule of table
  hLine(page, CONTENT_X, CONTENT_RIGHT, y, C.rule, 0.4);
  y -= 6 * mm;

  // ── Totals block ──────────────────────────────────────────────────────────
  const TOTAL_BOX_W = 95 * mm;
  const TOTAL_BOX_X = CONTENT_RIGHT - TOTAL_BOX_W;

  const linesSubtotal = payload.lines.reduce((s, l) => s + l.amount, 0);
  const subtotal =
    typeof payload.subtotalAmount === "number"
      ? payload.subtotalAmount
      : linesSubtotal;
  const discountAmount = Number(payload.discountAmount || 0);
  const inferredDelivery = Math.max(
    0,
    Number(payload.totalAmount || 0) - subtotal + discountAmount,
  );
  const deliveryCharge =
    typeof payload.deliveryCharge === "number"
      ? payload.deliveryCharge
      : inferredDelivery;

  drawTextRight(page, "Subtotal", TOTAL_BOX_X + TOTAL_BOX_W * 0.58, y, {
    font: regular, size: 9, color: C.muted,
  });
  drawTextRight(page, formatMoney(subtotal), TOTAL_BOX_X + TOTAL_BOX_W, y, {
    font: regular, size: 9, color: C.muted,
  });
  y -= 6 * mm;

  drawTextRight(page, "Discount Amount", TOTAL_BOX_X + TOTAL_BOX_W * 0.58, y, {
    font: regular, size: 9, color: C.muted,
  });
  drawTextRight(page, `-${formatMoney(discountAmount)}`, TOTAL_BOX_X + TOTAL_BOX_W, y, {
    font: regular, size: 9, color: C.muted,
  });
  y -= 6 * mm;

  drawTextRight(page, "Delivery Charge", TOTAL_BOX_X + TOTAL_BOX_W * 0.58, y, {
    font: regular, size: 9, color: C.muted,
  });
  drawTextRight(page, formatMoney(deliveryCharge), TOTAL_BOX_X + TOTAL_BOX_W, y, {
    font: regular, size: 9, color: C.muted,
  });
  y -= 6 * mm;

  // Total row background
  const TOTAL_ROW_H = 10 * mm;
  fillRect(page, TOTAL_BOX_X, y - TOTAL_ROW_H, TOTAL_BOX_W, TOTAL_ROW_H, C.mint);

  // Top border of total row
  hLine(page, TOTAL_BOX_X, TOTAL_BOX_X + TOTAL_BOX_W, y, C.forest, 1.2);

  const totalY = y - TOTAL_ROW_H + 3 * mm;
  drawTextRight(page, "TOTAL DUE",                    TOTAL_BOX_X + TOTAL_BOX_W * 0.55, totalY, { font: bold, size: 11, color: C.forest });
  drawTextRight(page, formatMoney(payload.totalAmount), TOTAL_BOX_X + TOTAL_BOX_W,      totalY, { font: bold, size: 13, color: C.forest });

  y -= TOTAL_ROW_H + 10 * mm;

  // ── Thank-you note ────────────────────────────────────────────────────────
  hLine(page, CONTENT_X, CONTENT_RIGHT, y, C.rule, 0.5);
  y -= 5 * mm;

  const thanks =
    "Thank you for choosing NITYAGRO — bringing the finest natural produce from the hills of Nepal to your table.";
  const thanksFitted = fitText(thanks, italic, 9, CONTENT_W);
  drawTextCenter(page, thanksFitted, CONTENT_X + CONTENT_W / 2, y, {
    font: italic, size: 9, color: C.muted,
  });

  // ── Serialise ─────────────────────────────────────────────────────────────
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
