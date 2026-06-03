// ─── Types ────────────────────────────────────────────────────────────────────

export type EmailOrderItem = {
  name: string;
  qty: number;
  amount: number;
};

export type OrderPlacedEmailInput = {
  customerName: string;
  transactionId: string;
  referenceLabel?: string;
  items: EmailOrderItem[];
  subtotalAmount?: number;
  discountAmount?: number;
  deliveryCharge?: number;
  totalAmount: number;
  addressText?: string;
};

export type OrderStatusEmailInput = {
  customerName: string;
  orderId: string;
  productName: string;
  orderStatus: string;
  paymentStatus: string;
  amount: number;
};

// ─── Config ───────────────────────────────────────────────────────────────────

/**
 * 100% image-free design — no <img> tags, no background-image, no SVG.
 * Everything uses Unicode symbols, CSS borders, and colored table cells.
 * Gmail, Outlook, Apple Mail, Yahoo Mail safe.
 */

const currency = (value: number): string => `NPR ${Number(value || 0).toLocaleString()}`;

// ─── Unicode Icon Map ─────────────────────────────────────────────────────────
// These render as colored glyphs in every major email client.

const ICON = {
  confirm: "✔", // order confirmed hero
  processing: "⟳", // processing hero
  shipped: "➤", // shipped hero
  delivered: "✔", // delivered hero
  cancelled: "✕", // cancelled hero
  txn: "#", // transaction / order id
  package: "▣", // package / product
  rupee: "Rs", // amount
  pin: "⊙", // address
  truck: "➜", // delivery
  headphones: "☎", // support
  mail: "✉", // email
  phone: "☏", // phone
  leaf: "✿", // natural
  utensils: "✦", // traditional
  shield: "◈", // quality
  heart: "♥", // healthy / love
  activity: "◉", // status
} as const;

// ─── Status Maps ──────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  processing: "#F59E0B",
  shipped: "#3B82F6",
  delivered: "#1B5E35",
  cancelled: "#EF4444",
  default: "#1B5E35",
};

const STATUS_HERO_BG: Record<string, string> = {
  processing: "#FEF3C7",
  shipped: "#DBEAFE",
  delivered: "#DCFCE7",
  cancelled: "#FEE2E2",
  default: "#DCFCE7",
};

const STATUS_HERO_ICON: Record<string, string> = {
  processing: ICON.processing,
  shipped: ICON.shipped,
  delivered: ICON.delivered,
  cancelled: ICON.cancelled,
  default: ICON.delivered,
};

const STATUS_MESSAGES: Record<string, { title: string; subtitle: string }> = {
  processing: {
    title: "Order Processing",
    subtitle: "Your order is being processed and will be packed shortly.",
  },
  shipped: {
    title: "Order Shipped!",
    subtitle: "Your order is on its way. You'll receive it soon.",
  },
  delivered: {
    title: "Order Delivered!",
    subtitle: "Your order has been delivered. Enjoy your Nityagro products!",
  },
  cancelled: {
    title: "Order Cancelled",
    subtitle: "Your order has been cancelled. Contact us if you need help.",
  },
  default: {
    title: "Order Update",
    subtitle: "There's an update regarding your order.",
  },
};

const PAYMENT_COLORS: Record<string, string> = {
  paid: "#1B5E35",
  pending: "#F59E0B",
  default: "#EF4444",
};

// ─── Primitive Blocks ─────────────────────────────────────────────────────────

/**
 * Grey circle badge with a unicode icon — replaces <img> icon badges.
 * Uses a table cell with border-radius to make the circle.
 */
const iconBadge = (icon: string, color = "#6B7280"): string => `
  <table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;">
    <tr>
      <td width="40" height="40"
        style="width:40px;height:40px;background:#F3F4F6;border-radius:20px;
               text-align:center;vertical-align:middle;font-size:16px;color:${color};">
        ${icon}
      </td>
    </tr>
  </table>`;

/**
 * Coloured circle badge for feature highlights strip.
 */
const featureBadge = (icon: string, bgColor: string, iconColor: string): string => `
  <table cellpadding="0" cellspacing="0" border="0" align="center">
    <tr>
      <td width="44" height="44"
        style="width:44px;height:44px;background:${bgColor};border-radius:22px;
               text-align:center;vertical-align:middle;font-size:20px;color:${iconColor};">
        ${icon}
      </td>
    </tr>
  </table>`;

/** Muted uppercase label above each info-row value. */
const rowLabel = (text: string): string =>
  `<div style="font-size:11px;color:#9CA3AF;margin-bottom:3px;
               text-transform:uppercase;letter-spacing:0.6px;">${text}</div>`;

/** Coloured status/payment pill badge. */
const pill = (label: string, color: string): string =>
  `<span style="display:inline-block;background:${color}20;color:${color};
     font-size:12px;font-weight:700;padding:4px 14px;border-radius:20px;
     border:1px solid ${color}50;letter-spacing:0.4px;">${label}</span>`;

// ─── Layout Sections ──────────────────────────────────────────────────────────

/**
 * Header — pure CSS green band + text logo.
 * No background-image, no <img>.
 */
const emailHeader = (): string => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="background:#1B5E35;padding:32px 24px 28px;text-align:center;">

        <!-- Logo mark: leaf unicode in a white circle -->
        <table cellpadding="0" cellspacing="0" border="0" align="center"
          style="margin-bottom:10px;">
          <tr>
            <td width="60" height="60"
              style="width:60px;height:60px;background:#ffffff;border-radius:30px;
                     text-align:center;vertical-align:middle;font-size:28px;line-height:60px;">
              🌿
            </td>
          </tr>
        </table>

        <!-- Brand name -->
        <div style="font-family:Georgia,serif;font-size:26px;font-weight:bold;
                    color:#ffffff;letter-spacing:2px;margin-bottom:6px;">
          NITYAGRO
        </div>

        <!-- Tagline -->
        <div style="font-family:Georgia,serif;font-size:12px;color:#A5D6A7;
                    letter-spacing:1.4px;font-style:italic;">
          Traditional Foods, Made the Right Way
        </div>

      </td>
    </tr>
  </table>

  <!-- Green accent stripe -->
  <div style="height:4px;background:#2E7D32;font-size:0;line-height:0;">&nbsp;</div>
  <div style="height:2px;background:#4CAF50;font-size:0;line-height:0;">&nbsp;</div>`;

/**
 * Feature highlights strip — 4 columns, unicode icons, no images.
 */
const featureBadges = (): string => {
  const features = [
    { icon: ICON.leaf, bg: "#E8F5E9", color: "#1B5E35", title: "100% Natural", desc: "No added\npreservatives" },
    { icon: ICON.utensils, bg: "#E8F5E9", color: "#1B5E35", title: "Traditionally\nPrepared", desc: "Made the\nright way" },
    { icon: ICON.shield, bg: "#E8F5E9", color: "#1B5E35", title: "Quality\nAssured", desc: "Carefully sourced\nand packed" },
    { icon: ICON.heart, bg: "#E8F5E9", color: "#1B5E35", title: "Healthy &\nNutritious", desc: "Good for you\nand your family" },
  ] as const;

  const cells = features
    .map(
      (f) => `
      <td width="25%" style="text-align:center;padding:18px 6px 16px;vertical-align:top;">
        ${featureBadge(f.icon, f.bg, f.color)}
        <div style="font-family:Georgia,serif;font-size:11px;font-weight:bold;
                    color:#1B5E35;margin:8px 0 3px;line-height:1.4;">
          ${f.title.replace("\n", "<br/>")}
        </div>
        <div style="font-size:10px;color:#6B7280;line-height:1.5;">
          ${f.desc.replace("\n", "<br/>")}
        </div>
      </td>`,
    )
    .join("");

  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>${cells}</tr>
  </table>`;
};

/**
 * Help / support section — no images, icons are unicode.
 */
const helpSection = (): string => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:#FAF7F2;border-radius:10px;">
    <tr>
      <td style="padding:16px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>

            <!-- Headphones badge -->
            <td width="56" valign="middle" style="padding-right:14px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="44" height="44"
                    style="width:44px;height:44px;background:#E8F5E9;border-radius:22px;
                           text-align:center;vertical-align:middle;font-size:22px;color:#1B5E35;">
                    ${ICON.headphones}
                  </td>
                </tr>
              </table>
            </td>

            <!-- Label -->
            <td valign="middle">
              <div style="font-family:Georgia,serif;font-size:14px;font-weight:bold;
                          color:#1F2937;margin-bottom:4px;">Need Help?</div>
              <div style="font-size:12px;color:#6B7280;">We're here for you! Contact us anytime.</div>
            </td>

            <!-- Contact -->
            <td valign="middle" align="right">
              <div style="font-size:12px;color:#1B5E35;margin-bottom:5px;">
                ${ICON.mail}&nbsp; support@nityagro.com
              </div>
              <div style="font-size:12px;color:#1B5E35;">
                ${ICON.phone}&nbsp; +977 9800000000
              </div>
            </td>

          </tr>
        </table>
      </td>
    </tr>
  </table>`;

/**
 * Social footer — unicode letters as social "icons", no images.
 */
const socialFooter = (): string => {
  const socials = [
    { label: "f", title: "Facebook" },
    { label: "in", title: "Instagram" },
    { label: "W", title: "WhatsApp" },
  ] as const;

  const socialCells = socials
    .map(
      (s) => `
      <td style="padding-right:8px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="32" height="32"
              style="width:32px;height:32px;background:rgba(255,255,255,0.18);
                     border-radius:8px;text-align:center;vertical-align:middle;
                     font-size:13px;font-weight:bold;color:#ffffff;
                     font-family:Arial,sans-serif;">
              ${s.label}
            </td>
          </tr>
        </table>
      </td>`,
    )
    .join("");

  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1B5E35;">
    <tr>
      <td style="padding:14px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="130" valign="middle">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>${socialCells}</tr>
              </table>
            </td>
            <td valign="middle" align="center">
              
            </td>
            <td valign="middle" align="right">
              <span style="font-size:11px;color:#A5D6A7;font-family:Arial,sans-serif;">
                Processed &amp; Packed in Nepal ${ICON.heart}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
};

// ─── Base Email Wrapper ───────────────────────────────────────────────────────

const baseEmail = (body: string): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Nityagro</title>
</head>
<body style="margin:0;padding:20px 10px;background:#E5E7EB;
             font-family:Arial,Helvetica,sans-serif;color:#1F2937;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" border="0"
          style="max-width:640px;width:100%;background:#FFFFFF;border-radius:12px;
                 overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.10);">

          <!-- HEADER -->
          <tr><td style="padding:0;">${emailHeader()}</td></tr>

          <!-- BODY -->
          <tr><td style="padding:32px 28px 24px;">${body}</td></tr>

          <!-- FEATURE BADGES -->
          <tr>
            <td style="padding:0 20px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;">
                <tr><td>${featureBadges()}</td></tr>
              </table>
            </td>
          </tr>

          <!-- HELP -->
          <tr><td style="padding:0 20px 20px;">${helpSection()}</td></tr>

          <!-- THANK YOU -->
          <tr>
            <td style="text-align:center;padding:4px 20px 20px;">
              <p style="font-family:Georgia,serif;font-size:15px;color:#374151;margin:0 0 6px;">
                Thank you for choosing Nityagro.
              </p>
              <div style="font-size:20px;color:#EF4444;margin-bottom:4px;">${ICON.heart}</div>
              <p style="font-family:Georgia,serif;font-size:13px;color:#9CA3AF;
                        font-style:italic;margin:0;">
                Happy Shopping!
              </p>
            </td>
          </tr>

          <!-- SOCIAL FOOTER -->
        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

// ─── buildOrderPlacedEmail ────────────────────────────────────────────────────

export function buildOrderPlacedEmail(input: OrderPlacedEmailInput): {
  subject: string;
  html: string;
  text: string;
} {
  const referenceLabel = input.referenceLabel || "Transaction ID";
  const subtotalAmount = typeof input.subtotalAmount === "number" ? input.subtotalAmount : input.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const discountAmount = Number(input.discountAmount || 0);
  const deliveryCharge = Number(input.deliveryCharge || 0);

  // ── Item rows ──────────────────────────────────────────────────────────────
  const itemsHtml = input.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 10px;border-bottom:1px solid #F3F4F6;
                     font-size:14px;color:#374151;font-weight:500;vertical-align:middle;">
            ${item.name}
          </td>
          <td style="padding:12px 10px;border-bottom:1px solid #F3F4F6;text-align:center;
                     font-size:14px;color:#6B7280;vertical-align:middle;">
            ${item.qty}
          </td>
          <td style="padding:12px 10px;border-bottom:1px solid #F3F4F6;text-align:right;
                     font-size:14px;font-weight:600;color:#1F2937;vertical-align:middle;
                     white-space:nowrap;">
            ${currency(item.amount)}
          </td>
        </tr>`,
    )
    .join("");

  // ── Address row (conditional) ──────────────────────────────────────────────
  const addressRow = input.addressText
    ? `<tr>
         <td style="padding:16px 18px;">
           <table cellpadding="0" cellspacing="0" border="0" width="100%">
             <tr>
               <td width="54" valign="middle" style="padding-right:14px;">
                 ${iconBadge(ICON.pin, "#1B5E35")}
               </td>
               <td valign="middle">
                 ${rowLabel("Shipping Address")}
                 <div style="font-size:14px;color:#374151;">${input.addressText}</div>
               </td>
               <td width="54" valign="middle" align="right">
                 ${iconBadge(ICON.truck, "#1B5E35")}
               </td>
             </tr>
           </table>
         </td>
       </tr>`
    : "";

  // ── Body ──────────────────────────────────────────────────────────────────
  const body = `
    <!-- Hero: confirmed -->
    <div style="text-align:center;margin-bottom:24px;">
      <table cellpadding="0" cellspacing="0" border="0" align="center"
        style="margin-bottom:14px;">
        <tr>
          <td width="68" height="68"
            style="width:68px;height:68px;background:#DCFCE7;border-radius:34px;
                   text-align:center;vertical-align:middle;font-size:30px;color:#1B5E35;">
            ${ICON.confirm}
          </td>
        </tr>
      </table>
      <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;
                 font-weight:bold;color:#1B5E35;">
        Order Confirmed!
      </h1>
    </div>

    <p style="text-align:center;font-size:16px;font-weight:bold;
              color:#1F2937;margin:0 0 4px;">
      Hello ${input.customerName},
    </p>
    <p style="text-align:center;font-size:14px;color:#6B7280;margin:0 0 28px;line-height:1.6;">
      Thank you for shopping with Nityagro.<br/>
      Your order has been placed successfully.
    </p>

    <!-- Info card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">

      <!-- Transaction ID -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="54" valign="middle" style="padding-right:14px;">
                ${iconBadge(ICON.txn, "#1B5E35")}
              </td>
              <td valign="middle">
                ${rowLabel(referenceLabel)}
                <div style="font-size:14px;font-weight:bold;color:#1F2937;
                            font-family:Courier,monospace;letter-spacing:0.5px;">
                  ${input.transactionId}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Order Summary -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="54" valign="top" style="padding-right:14px;">
                ${iconBadge(ICON.package, "#1B5E35")}
              </td>
              <td valign="top">
                ${rowLabel("Order Summary")}
                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                  style="border:1px solid #E5E7EB;border-radius:8px;
                         overflow:hidden;margin-top:8px;">
                  <thead>
                    <tr style="background:#F9FAFB;">
                      <th style="text-align:left;padding:9px 10px;font-size:11px;
                                 color:#6B7280;font-weight:600;border-bottom:1px solid #E5E7EB;">
                        Item
                      </th>
                      <th style="text-align:center;padding:9px 10px;font-size:11px;
                                 color:#6B7280;font-weight:600;border-bottom:1px solid #E5E7EB;">
                        Qty
                      </th>
                      <th style="text-align:right;padding:9px 10px;font-size:11px;
                                 color:#6B7280;font-weight:600;border-bottom:1px solid #E5E7EB;">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Total -->
      <tr>
        <td style="padding:16px 18px;
                   border-bottom:${input.addressText ? "1px solid #E5E7EB" : "none"};">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="54" valign="middle" style="padding-right:14px;">
                ${iconBadge(ICON.rupee, "#1B5E35")}
              </td>
              <td valign="middle">
                ${rowLabel("Payment Summary")}
                <table cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="font-size:14px;color:#374151;">
                  <tr>
                    <td style="padding:3px 0;">Subtotal</td>
                    <td style="padding:3px 0;text-align:right;font-weight:600;">
                      ${currency(subtotalAmount)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:3px 0;">Discount Amount</td>
                    <td style="padding:3px 0;text-align:right;font-weight:600;color:#B45309;">
                      -${currency(discountAmount)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:3px 0;">Delivery Charge</td>
                    <td style="padding:3px 0;text-align:right;font-weight:600;">
                      ${currency(deliveryCharge)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0 0;border-top:1px solid #E5E7EB;font-weight:700;color:#1B5E35;">
                      Total Amount
                    </td>
                    <td style="padding:8px 0 0;border-top:1px solid #E5E7EB;text-align:right;font-size:20px;font-weight:bold;color:#1B5E35;">
                      ${currency(input.totalAmount)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${addressRow}

    </table>`;

  return {
    subject: `Order Confirmed – ${input.transactionId}`,
    html: baseEmail(body),
    text: `Order confirmed. ${referenceLabel}: ${input.transactionId}. Subtotal: ${currency(subtotalAmount)}. Discount: ${currency(discountAmount)}. Delivery: ${currency(deliveryCharge)}. Total: ${currency(input.totalAmount)}`,
  };
}

// ─── buildOrderStatusEmail ────────────────────────────────────────────────────

export function buildOrderStatusEmail(input: OrderStatusEmailInput): {
  subject: string;
  html: string;
  text: string;
} {
  const statusKey = input.orderStatus.toLowerCase();
  const paymentKey = input.paymentStatus.toLowerCase();

  const color = STATUS_COLORS[statusKey] ?? STATUS_COLORS.default;
  const heroBg = STATUS_HERO_BG[statusKey] ?? STATUS_HERO_BG.default;
  const heroIcon = STATUS_HERO_ICON[statusKey] ?? STATUS_HERO_ICON.default;
  const payColor = PAYMENT_COLORS[paymentKey] ?? PAYMENT_COLORS.default;
  const msg = STATUS_MESSAGES[statusKey] ?? STATUS_MESSAGES.default;

  const statusLabel = input.orderStatus.toUpperCase();
  const paymentLabel = input.paymentStatus.toUpperCase();

  // ── Body ──────────────────────────────────────────────────────────────────
  const body = `
    <!-- Hero: status -->
    <div style="text-align:center;margin-bottom:24px;">
      <table cellpadding="0" cellspacing="0" border="0" align="center"
        style="margin-bottom:14px;">
        <tr>
          <td width="68" height="68"
            style="width:68px;height:68px;background:${heroBg};border-radius:34px;
                   text-align:center;vertical-align:middle;font-size:28px;color:${color};">
            ${heroIcon}
          </td>
        </tr>
      </table>
      <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;
                 font-weight:bold;color:${color};">
        ${msg.title}
      </h1>
    </div>

    <p style="text-align:center;font-size:16px;font-weight:bold;
              color:#1F2937;margin:0 0 4px;">
      Hello ${input.customerName},
    </p>
    <p style="text-align:center;font-size:14px;color:#6B7280;margin:0 0 28px;line-height:1.6;">
      ${msg.subtitle}
    </p>

    <!-- Info card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">

      <!-- Order ID -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="54" valign="middle" style="padding-right:14px;">
                ${iconBadge(ICON.txn, "#1B5E35")}
              </td>
              <td valign="middle">
                ${rowLabel("Order ID")}
                <div style="font-size:14px;font-weight:bold;color:#1F2937;
                            font-family:Courier,monospace;letter-spacing:0.5px;">
                  #${input.orderId}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Product -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="54" valign="middle" style="padding-right:14px;">
                ${iconBadge(ICON.package, "#1B5E35")}
              </td>
              <td valign="middle">
                ${rowLabel("Product")}
                <div style="font-size:15px;font-weight:600;color:#1F2937;">
                  ${input.productName}
                </div>
              </td>

              <!-- Product placeholder box (image-free) -->
              <td width="90" valign="middle" align="right">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="80" height="80"
                      style="width:80px;height:80px;background:#F0FDF4;border-radius:10px;
                             border:1px solid #D1FAE5;text-align:center;vertical-align:middle;
                             font-size:32px;">
                      🥗
                    </td>
                  </tr>
                </table>
              </td>

            </tr>
          </table>
        </td>
      </tr>

      <!-- Order Status -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="54" valign="middle" style="padding-right:14px;">
                ${iconBadge(ICON.activity, color)}
              </td>
              <td valign="middle">
                ${rowLabel("Order Status")}
                ${pill(statusLabel, color)}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Payment Status -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="54" valign="middle" style="padding-right:14px;">
                ${iconBadge(ICON.rupee, payColor)}
              </td>
              <td valign="middle">
                ${rowLabel("Payment Status")}
                ${pill(paymentLabel, payColor)}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Amount -->
      <tr>
        <td style="padding:16px 18px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="54" valign="middle" style="padding-right:14px;">
                ${iconBadge(ICON.rupee, "#1B5E35")}
              </td>
              <td valign="middle">
                ${rowLabel("Amount")}
                <div style="font-size:22px;font-weight:bold;color:#1B5E35;">
                  ${currency(input.amount)}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>`;

  return {
    subject: `Order #${input.orderId} – ${msg.title}`,
    html: baseEmail(body),
    text: `Order #${input.orderId} status: ${input.orderStatus}, payment: ${input.paymentStatus}, amount: ${currency(input.amount)}`,
  };
}
