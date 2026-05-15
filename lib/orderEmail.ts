import type { Order, OrderItem, User, Product, CustomerAddress, ShippingCity, Province, AddressZone } from "@prisma/client";

export type OrderWithRelations = Order & {
  user?: User | null;
  items?: (OrderItem & { product?: Pick<Product, "name" | "productCode"> | null })[];
};

type AddressSnapshot = CustomerAddress & {
  province?: Province | null;
  city?: ShippingCity | null;
  zone?: AddressZone | null;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const currency = (value: unknown) => {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) return "Rs. 0";
  return `Rs. ${num.toLocaleString("en-IN")}`;
};

// ─── Base Shell ──────────────────────────────────────────────────────────────

const baseHtml = (content: string) => {
  const logoUrl = `https://yuemi.com.np/yuemi_logo_black.png`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>YuemiNepal</title>
</head>
<body style="margin:0;padding:0;background-color:#F2F0EC;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F2F0EC;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

          <!-- HEADER -->
          <tr>
            <td style="background:#f3f4f6;border-radius:12px 12px 0 0;padding:28px 40px;text-align:center;">
              <img src="${logoUrl}" alt="YuemiNepal" height="32" style="display:inline-block;" />
              <p style="margin:8px 0 0;color:#9a8a72;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;font-family:Arial,sans-serif;">nityagro.com</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#ffffff;padding:0;">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#111111;border-radius:0 0 12px 12px;padding:28px 40px;text-align:center;">
              <p style="margin:0 0 12px;color:#9a8a72;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-family:Arial,sans-serif;">Follow us</p>
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td style="padding:0 6px;">
                    <a href="#" style="display:inline-block;width:32px;height:32px;border:1px solid #333;border-radius:50%;line-height:32px;text-align:center;color:#9a8a72;font-size:12px;font-family:Arial,sans-serif;text-decoration:none;">f</a>
                  </td>
                  <td style="padding:0 6px;">
                    <a href="https://www.instagram.com/nityamagro.np" style="display:inline-block;width:32px;height:32px;border:1px solid #333;border-radius:50%;line-height:32px;text-align:center;color:#9a8a72;font-size:12px;font-family:Arial,sans-serif;text-decoration:none;">ig</a>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 4px;color:#555;font-size:11px;font-family:Arial,sans-serif;">© ${new Date().getFullYear()} Nityagro. All rights reserved.</p>
              <p style="margin:0;color:#444;font-size:11px;font-family:Arial,sans-serif;">Kathmandu, Nepal &nbsp;·&nbsp; <a href="mailto:nityamagro.pvt.ltd@gmail.com" style="color:#9a8a72;text-decoration:none;">nityamagro.pvt.ltd@gmail.com</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

// ─── Accent Banner ────────────────────────────────────────────────────────────

const accentBanner = (icon: string, label: string, color: string, bgColor: string) => `
  <tr>
    <td style="background:${bgColor};padding:20px 40px;text-align:center;border-bottom:3px solid ${color};">
      <span style="font-size:32px;display:block;margin-bottom:8px;">${icon}</span>
      <span style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:${color};font-family:Arial,sans-serif;font-weight:700;">${label}</span>
    </td>
  </tr>
`;

// ─── Order Items Table ────────────────────────────────────────────────────────

const buildItemsTable = (order: OrderWithRelations) => {
  const rows = (order.items || [])
    .map((item) => {
      const name = item.product?.name || item.productCode;
      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0ede8;font-size:14px;color:#222;font-family:Arial,sans-serif;">${name}</td>
          <td style="padding:12px 0;border-bottom:1px solid #f0ede8;text-align:center;font-size:14px;color:#666;font-family:Arial,sans-serif;">${item.quantity}</td>
          <td style="padding:12px 0;border-bottom:1px solid #f0ede8;text-align:right;font-size:14px;color:#222;font-family:Arial,sans-serif;">${currency(item.price)}</td>
        </tr>`;
    })
    .join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
      <thead>
        <tr>
          <th style="text-align:left;padding:10px 0;border-bottom:2px solid #111;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;font-family:Arial,sans-serif;font-weight:600;">Item</th>
          <th style="text-align:center;padding:10px 0;border-bottom:2px solid #111;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;font-family:Arial,sans-serif;font-weight:600;">Qty</th>
          <th style="text-align:right;padding:10px 0;border-bottom:2px solid #111;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;font-family:Arial,sans-serif;font-weight:600;">Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
};

// ─── Totals Block ─────────────────────────────────────────────────────────────

const buildTotalsBlock = (order: OrderWithRelations) => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
    <tr>
      <td style="padding:7px 0;font-size:13px;color:#888;font-family:Arial,sans-serif;">Subtotal</td>
      <td style="padding:7px 0;text-align:right;font-size:13px;color:#555;font-family:Arial,sans-serif;">${currency(order.subtotal)}</td>
    </tr>
    <tr>
      <td style="padding:7px 0;font-size:13px;color:#888;font-family:Arial,sans-serif;">Shipping</td>
      <td style="padding:7px 0;text-align:right;font-size:13px;color:#555;font-family:Arial,sans-serif;">${currency(order.shippingCost)}</td>
    </tr>
    <tr>
      <td style="padding:7px 0;font-size:13px;color:#888;font-family:Arial,sans-serif;">Tax</td>
      <td style="padding:7px 0;text-align:right;font-size:13px;color:#555;font-family:Arial,sans-serif;">${currency(order.tax)}</td>
    </tr>
    <tr>
      <td style="padding:7px 0;font-size:13px;color:#c0392b;font-family:Arial,sans-serif;">Discount</td>
      <td style="padding:7px 0;text-align:right;font-size:13px;color:#c0392b;font-family:Arial,sans-serif;">−${currency(order.discount)}</td>
    </tr>
    <tr>
      <td style="padding:14px 16px;background:#111;font-size:15px;font-weight:700;color:#fff;font-family:Arial,sans-serif;border-radius:6px 0 0 6px;">Total</td>
      <td style="padding:14px 16px;background:#111;text-align:right;font-size:15px;font-weight:700;color:#c8a96e;font-family:Arial,sans-serif;border-radius:0 6px 6px 0;">${currency(order.totalAmount)}</td>
    </tr>
  </table>`;

// ─── Address Block ────────────────────────────────────────────────────────────

const buildAddressBlock = (address?: AddressSnapshot | null) => {
  if (!address) return "";
  const locationLine = [address.zone?.zoneName, address.city?.city, address.province?.name]
    .filter(Boolean)
    .join(", ");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
      <tr>
        <td style="background:#F7F5F2;border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;padding:20px 24px;">
          <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#9a8a72;font-family:Arial,sans-serif;font-weight:700;">📦 Shipping Address</p>
          <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#111;font-family:Arial,sans-serif;">${address.fullName}</p>
          <p style="margin:0 0 4px;font-size:13px;color:#555;font-family:Arial,sans-serif;">${address.phone}</p>
          <p style="margin:0 0 4px;font-size:13px;color:#555;font-family:Arial,sans-serif;">${address.address}${address.landmark ? `, near ${address.landmark}` : ""}</p>
          <p style="margin:0;font-size:13px;color:#555;font-family:Arial,sans-serif;">${locationLine}</p>
        </td>
      </tr>
    </table>`;
};

// ─── Section Divider ──────────────────────────────────────────────────────────

const divider = () => `
  <tr>
    <td style="padding:0 40px;">
      <div style="height:1px;background:linear-gradient(to right,transparent,#e8e2da,transparent);margin:4px 0;"></div>
    </td>
  </tr>`;

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusBadge = (label: string, color: string, bg: string) => `
  <span style="display:inline-block;padding:5px 16px;background:${bg};color:${color};font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;border-radius:100px;font-family:Arial,sans-serif;border:1px solid ${color};">${label}</span>`;

// ─── CTA Button ───────────────────────────────────────────────────────────────

const ctaButton = (label: string, url: string) => `
  <table cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
    <tr>
      <td style="background:#111;border-radius:6px;padding:14px 32px;">
        <a href="${url}" style="color:#c8a96e;font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;font-family:Arial,sans-serif;">${label}</a>
      </td>
    </tr>
  </table>`;

// ─── 1. Order Placed Email ────────────────────────────────────────────────────

export function buildOrderPlacedEmail(
  order: OrderWithRelations,
  address?: AddressSnapshot | null
) {
  const subject = `✅ Order Confirmed: ${order.orderNumber}`;
  const customerName = order.user?.fullName || "Valued Customer";
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || "https://nityagro.com";

  const html = baseHtml(`
    <table width="100%" cellpadding="0" cellspacing="0" border="0">

      ${accentBanner("🛍️", "Order Confirmed", "#2d7a4f", "#edf7f1")}

      <tr>
        <td style="padding:36px 40px 0;">
          <p style="margin:0 0 6px;font-size:13px;color:#888;font-family:Arial,sans-serif;">Hello,</p>
          <h2 style="margin:0 0 16px;font-size:24px;color:#111;font-weight:400;font-family:'Georgia',serif;">${customerName} 👋</h2>
          <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;font-family:Arial,sans-serif;">
            Great news! We've received your order and it's now being prepared. You'll receive another update when it ships.
          </p>

          <!-- Order Badge -->
          <table cellpadding="0" cellspacing="0" border="0" style="background:#f7f5f2;border-radius:8px;padding:16px 20px;width:100%;">
            <tr>
              <td>
                <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#9a8a72;font-family:Arial,sans-serif;">Order Number</p>
                <p style="margin:0;font-size:20px;font-weight:700;color:#111;font-family:'Georgia',serif;letter-spacing:0.05em;">${order.orderNumber}</p>
              </td>
              <td style="text-align:right;">
                ${statusBadge("Confirmed", "#2d7a4f", "#edf7f1")}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Items -->
      <tr>
        <td style="padding:28px 40px 0;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#9a8a72;font-family:Arial,sans-serif;">Your Items</p>
          ${buildItemsTable(order)}
        </td>
      </tr>

      <!-- Totals -->
      <tr>
        <td style="padding:20px 40px 0;">
          ${buildTotalsBlock(order)}
        </td>
      </tr>

      <!-- Address -->
      <tr>
        <td style="padding:0 40px;">
          ${buildAddressBlock(address)}
        </td>
      </tr>

      <!-- Invoice note -->
      <tr>
        <td style="padding:20px 40px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background:#fffbf2;border:1px solid #e8d9b5;border-radius:8px;padding:16px 20px;">
                
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CTA -->
      

    </table>
  `);

  return { subject, html, text: `Order ${order.orderNumber} confirmed. Thank you for shopping with Nityagro.` };
}

// ─── 2. Order Status Update Email ─────────────────────────────────────────────

export function buildOrderStatusEmail(order: OrderWithRelations) {
  const status = String(order.orderStatus || "processing");
  const subject = `📦 Order Update: ${order.orderNumber} is now ${status.toUpperCase()}`;
  const customerName = order.user?.fullName || "Valued Customer";
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || "https://nityagro.com";

  const statusConfig: Record<string, { icon: string; color: string; bg: string; label: string; message: string }> = {
    processing:  { icon: "⚙️",  color: "#1a6eb5", bg: "#e8f2fc", label: "Processing",  message: "Your order is being carefully prepared by our team." },
    shipped:     { icon: "🚚",  color: "#7a3db5", bg: "#f2eafc", label: "Shipped",      message: "Your order is on its way! Expect delivery soon." },
    delivered:   { icon: "✅",  color: "#2d7a4f", bg: "#edf7f1", label: "Delivered",    message: "Your order has been delivered. We hope you love it!" },
    cancelled:   { icon: "❌",  color: "#c0392b", bg: "#fdecea", label: "Cancelled",    message: "Your order has been cancelled. Contact us if you have questions." },
    on_hold:     { icon: "⏸️",  color: "#b57a1a", bg: "#fdf5e8", label: "On Hold",      message: "Your order is temporarily on hold. We'll update you shortly." },
  };

  const cfg = statusConfig[status.toLowerCase()] || statusConfig["processing"];

  const html = baseHtml(`
    <table width="100%" cellpadding="0" cellspacing="0" border="0">

      ${accentBanner(cfg.icon, `Order ${cfg.label}`, cfg.color, cfg.bg)}

      <tr>
        <td style="padding:36px 40px 0;">
          <p style="margin:0 0 6px;font-size:13px;color:#888;font-family:Arial,sans-serif;">Hello,</p>
          <h2 style="margin:0 0 16px;font-size:24px;color:#111;font-weight:400;font-family:'Georgia',serif;">${customerName}</h2>
          <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.7;font-family:Arial,sans-serif;">${cfg.message}</p>

          <!-- Status Card -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f5f2;border-radius:8px;padding:20px;margin-bottom:8px;">
            <tr>
              <td>
                <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#9a8a72;font-family:Arial,sans-serif;">Order</p>
                <p style="margin:0;font-size:18px;font-weight:700;color:#111;font-family:'Georgia',serif;">${order.orderNumber}</p>
              </td>
              <td style="text-align:right;vertical-align:middle;">
                ${statusBadge(cfg.label, cfg.color, cfg.bg)}
              </td>
            </tr>
          </table>

          <!-- Timeline -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0;">
            <tr>
              <td width="25%" style="text-align:center;padding:0 4px;">
                <div style="width:28px;height:28px;border-radius:50%;background:${["processing","shipped","delivered"].includes(status.toLowerCase()) ? "#111" : "#ddd"};margin:0 auto 6px;line-height:28px;text-align:center;font-size:12px;color:#fff;font-family:Arial,sans-serif;">1</div>
                <p style="margin:0;font-size:10px;color:#888;font-family:Arial,sans-serif;letter-spacing:0.1em;text-transform:uppercase;">Placed</p>
              </td>
              <td width="25%" style="text-align:center;padding:0 4px;">
                <div style="width:28px;height:28px;border-radius:50%;background:${["processing","shipped","delivered"].includes(status.toLowerCase()) ? "#111" : "#ddd"};margin:0 auto 6px;line-height:28px;text-align:center;font-size:12px;color:#fff;font-family:Arial,sans-serif;">2</div>
                <p style="margin:0;font-size:10px;color:#888;font-family:Arial,sans-serif;letter-spacing:0.1em;text-transform:uppercase;">Processing</p>
              </td>
              <td width="25%" style="text-align:center;padding:0 4px;">
                <div style="width:28px;height:28px;border-radius:50%;background:${["shipped","delivered"].includes(status.toLowerCase()) ? "#111" : "#ddd"};margin:0 auto 6px;line-height:28px;text-align:center;font-size:12px;color:${["shipped","delivered"].includes(status.toLowerCase()) ? "#fff" : "#aaa"};font-family:Arial,sans-serif;">3</div>
                <p style="margin:0;font-size:10px;color:#888;font-family:Arial,sans-serif;letter-spacing:0.1em;text-transform:uppercase;">Shipped</p>
              </td>
              <td width="25%" style="text-align:center;padding:0 4px;">
                <div style="width:28px;height:28px;border-radius:50%;background:${status.toLowerCase() === "delivered" ? "#2d7a4f" : "#ddd"};margin:0 auto 6px;line-height:28px;text-align:center;font-size:12px;color:${status.toLowerCase() === "delivered" ? "#fff" : "#aaa"};font-family:Arial,sans-serif;">✓</div>
                <p style="margin:0;font-size:10px;color:#888;font-family:Arial,sans-serif;letter-spacing:0.1em;text-transform:uppercase;">Delivered</p>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      

    </table>
  `);

  return { subject, html, text: `Your order ${order.orderNumber} is now ${status.toUpperCase()}.` };
}

// ─── 3. Payment Update Email ──────────────────────────────────────────────────

export function buildOrderPaymentEmail(order: OrderWithRelations) {
  const payment = String(order.paymentStatus || "unpaid");
  const subject = `💳 Payment Update for Order ${order.orderNumber}`;
  const customerName = order.user?.fullName || "Valued Customer";
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || "https://nityagro.com";

  const paymentConfig: Record<string, { icon: string; color: string; bg: string; label: string; message: string }> = {
    paid:    { icon: "✅", color: "#2d7a4f", bg: "#edf7f1", label: "Payment Received",  message: "We've received your payment. Your order is now confirmed and being prepared." },
    unpaid:  { icon: "⏳", color: "#b57a1a", bg: "#fdf5e8", label: "Payment Pending",   message: "We're waiting for your payment to confirm this order. Please complete payment to proceed." },
    failed:  { icon: "❌", color: "#c0392b", bg: "#fdecea", label: "Payment Failed",    message: "Unfortunately your payment could not be processed. Please try again or use a different method." },
    refunded:{ icon: "↩️", color: "#1a6eb5", bg: "#e8f2fc", label: "Payment Refunded",  message: "Your refund has been processed. Please allow 5–7 business days for it to appear." },
  };

  const cfg = paymentConfig[payment.toLowerCase()] || paymentConfig["unpaid"];

  const html = baseHtml(`
    <table width="100%" cellpadding="0" cellspacing="0" border="0">

      ${accentBanner(cfg.icon, cfg.label, cfg.color, cfg.bg)}

      <tr>
        <td style="padding:36px 40px 0;">
          <p style="margin:0 0 6px;font-size:13px;color:#888;font-family:Arial,sans-serif;">Hello,</p>
          <h2 style="margin:0 0 16px;font-size:24px;color:#111;font-weight:400;font-family:'Georgia',serif;">${customerName}</h2>
          <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.7;font-family:Arial,sans-serif;">${cfg.message}</p>

          <!-- Payment Summary Card -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f5f2;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:16px 20px;border-bottom:1px solid #ede9e3;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:13px;color:#888;font-family:Arial,sans-serif;">Order</td>
                    <td style="text-align:right;font-size:13px;font-weight:700;color:#111;font-family:Arial,sans-serif;">${order.orderNumber}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px;border-bottom:1px solid #ede9e3;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:13px;color:#888;font-family:Arial,sans-serif;">Payment Status</td>
                    <td style="text-align:right;">${statusBadge(cfg.label, cfg.color, cfg.bg)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px;background:#111;border-radius:0 0 8px 8px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:14px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">Amount</td>
                    <td style="text-align:right;font-size:18px;font-weight:700;color:#c8a96e;font-family:'Georgia',serif;">${currency(order.totalAmount)}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Breakdown -->
      <tr>
        <td style="padding:24px 40px 0;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#9a8a72;font-family:Arial,sans-serif;">Breakdown</p>
          ${buildTotalsBlock(order)}
        </td>
      </tr>

      
    </table>
  `);

  return { subject, html, text: `Payment status for order ${order.orderNumber} is now ${payment.toUpperCase()}.` };
}

// ─── 4. Return Status Email ───────────────────────────────────────────────────

export function buildReturnStatusEmail(params: {
  orderNumber: string | number;
  customerName?: string | null;
  status: string;
  reason?: string | null;
  productName?: string | null;
}) {
  const subject = `↩️ Return Update for Order ${params.orderNumber}`;

  const returnConfig: Record<string, { icon: string; color: string; bg: string; label: string; message: string }> = {
    requested: { icon: "📋", color: "#1a6eb5", bg: "#e8f2fc", label: "Return Requested",  message: "We've received your return request and our team will review it within 1–2 business days." },
    approved:  { icon: "✅", color: "#2d7a4f", bg: "#edf7f1", label: "Return Approved",   message: "Your return has been approved. Please ship the item back using the instructions below." },
    rejected:  { icon: "❌", color: "#c0392b", bg: "#fdecea", label: "Return Rejected",   message: "Unfortunately your return request could not be approved. Please contact us for more details." },
    received:  { icon: "📦", color: "#7a3db5", bg: "#f2eafc", label: "Item Received",     message: "We've received your returned item and are inspecting it. A refund will follow shortly." },
    refunded:  { icon: "💚", color: "#2d7a4f", bg: "#edf7f1", label: "Refund Issued",     message: "Your refund has been processed. It will appear on your original payment method in 5–7 days." },
  };

  const cfg = returnConfig[params.status.toLowerCase()] || returnConfig["requested"];

  const html = baseHtml(`
    <table width="100%" cellpadding="0" cellspacing="0" border="0">

      ${accentBanner(cfg.icon, cfg.label, cfg.color, cfg.bg)}

      <tr>
        <td style="padding:36px 40px 0;">
          <p style="margin:0 0 6px;font-size:13px;color:#888;font-family:Arial,sans-serif;">Hello,</p>
          <h2 style="margin:0 0 16px;font-size:24px;color:#111;font-weight:400;font-family:'Georgia',serif;">${params.customerName || "Valued Customer"}</h2>
          <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.7;font-family:Arial,sans-serif;">${cfg.message}</p>

          <!-- Return Details Card -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f5f2;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:16px 20px;border-bottom:1px solid #ede9e3;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#9a8a72;font-family:Arial,sans-serif;">Order Number</td>
                    <td style="text-align:right;font-size:14px;font-weight:700;color:#111;font-family:Arial,sans-serif;">${params.orderNumber}</td>
                  </tr>
                </table>
              </td>
            </tr>
            ${params.productName ? `
            <tr>
              <td style="padding:16px 20px;border-bottom:1px solid #ede9e3;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#9a8a72;font-family:Arial,sans-serif;">Product</td>
                    <td style="text-align:right;font-size:13px;color:#444;font-family:Arial,sans-serif;">${params.productName}</td>
                  </tr>
                </table>
              </td>
            </tr>` : ""}
            ${params.reason ? `
            <tr>
              <td style="padding:16px 20px;border-bottom:1px solid #ede9e3;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#9a8a72;font-family:Arial,sans-serif;">Reason</td>
                    <td style="text-align:right;font-size:13px;color:#444;font-family:Arial,sans-serif;">${params.reason}</td>
                  </tr>
                </table>
              </td>
            </tr>` : ""}
            <tr>
              <td style="padding:16px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#9a8a72;font-family:Arial,sans-serif;">Status</td>
                    <td style="text-align:right;">${statusBadge(cfg.label, cfg.color, cfg.bg)}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          ${params.status.toLowerCase() === "approved" ? `
          <!-- Return Instructions -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
            <tr>
              <td style="background:#fffbf2;border:1px solid #e8d9b5;border-radius:8px;padding:20px 24px;">
                <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#7a6020;font-family:Arial,sans-serif;">📬 Return Instructions</p>
                <p style="margin:0 0 6px;font-size:13px;color:#555;font-family:Arial,sans-serif;">1. Pack the item securely in its original packaging.</p>
                <p style="margin:0 0 6px;font-size:13px;color:#555;font-family:Arial,sans-serif;">2. Include your order number (${params.orderNumber}) inside the package.</p>
                <p style="margin:0;font-size:13px;color:#555;font-family:Arial,sans-serif;">3. Ship to: <strong>Nityagro Returns, Kathmandu, Nepal</strong></p>
              </td>
            </tr>
          </table>` : ""}

        </td>
      </tr>

    </table>
  `);

  return { subject, html, text: `Your return request for order ${params.orderNumber} is now ${params.status}.` };
}
