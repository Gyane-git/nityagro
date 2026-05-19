type EmailOrderItem = {
  name: string;
  qty: number;
  amount: number;
  pImage?: string; // product image URL from API
};

type OrderPlacedEmailInput = {
  customerName: string;
  transactionId: string;
  items: EmailOrderItem[];
  totalAmount: number;
  addressText?: string;
};

type OrderStatusEmailInput = {
  customerName: string;
  orderId: string;
  productName: string;
  pImage?: string; // product image URL from API
  orderStatus: string;
  paymentStatus: string;
  amount: number;
};

const currency = (value: number) => `NPR ${Number(value || 0).toLocaleString()}`;

// ─── Base URL — set to your production domain ─────────────────────────────────
// Email clients require absolute URLs; relative paths like /logo.png won't load.
const BASE_URL = "http://localhost:3000"; // ← change to your actual domain

// ─── Shared Assets ────────────────────────────────────────────────────────────

const LOGO_SVG = `
<svg width="140" height="44" viewBox="0 0 140 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Sun -->
  <ellipse cx="70" cy="10" rx="9" ry="9" fill="#F5A623"/>
  <!-- Sun rays -->
  <line x1="70" y1="0" x2="70" y2="3" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
  <line x1="70" y1="18" x2="70" y2="21" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
  <line x1="60" y1="10" x2="57" y2="10" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
  <line x1="80" y1="10" x2="83" y2="10" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
  <line x1="62.9" y1="2.9" x2="60.8" y2="0.8" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
  <line x1="77.1" y1="17.1" x2="79.2" y2="19.2" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
  <line x1="77.1" y1="2.9" x2="79.2" y2="0.8" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
  <line x1="62.9" y1="17.1" x2="60.8" y2="19.2" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
  <!-- Green badge -->
  <rect x="20" y="20" width="100" height="22" rx="4" fill="#1B5E35"/>
  <text x="70" y="35" text-anchor="middle" font-family="Georgia, serif" font-size="13" font-weight="bold" fill="#ffffff" letter-spacing="0.5">Nityagro®</text>
</svg>`;

const HEADER_BG = `#F5F0E8`;

// Leaf decorations as inline SVG strings
const LEFT_LEAVES = `<svg width="80" height="90" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;">
  <ellipse cx="15" cy="30" rx="12" ry="28" fill="#4CAF50" transform="rotate(-30 15 30)"/>
  <ellipse cx="35" cy="15" rx="9" ry="22" fill="#388E3C" transform="rotate(-50 35 15)"/>
  <ellipse cx="8" cy="55" rx="8" ry="18" fill="#66BB6A" transform="rotate(-15 8 55)"/>
</svg>`;

const RIGHT_LEAVES = `<svg width="80" height="90" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;right:0;">
  <ellipse cx="65" cy="30" rx="12" ry="28" fill="#4CAF50" transform="rotate(30 65 30)"/>
  <ellipse cx="45" cy="15" rx="9" ry="22" fill="#388E3C" transform="rotate(50 45 15)"/>
  <ellipse cx="72" cy="55" rx="8" ry="18" fill="#66BB6A" transform="rotate(15 72 55)"/>
</svg>`;

// Landscape sketch illustration (simplified SVG)
const LANDSCAPE_SVG = `<svg width="620" height="60" viewBox="0 0 620 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Mountains -->
  <polyline points="0,60 60,20 120,50 180,15 250,45 310,10 370,40 430,18 500,45 560,20 620,50 620,60" fill="none" stroke="#C8B89A" stroke-width="1.2"/>
  <!-- Hills -->
  <ellipse cx="100" cy="58" rx="80" ry="12" fill="#D4C9B0" opacity="0.5"/>
  <ellipse cx="300" cy="58" rx="120" ry="14" fill="#D4C9B0" opacity="0.5"/>
  <ellipse cx="520" cy="58" rx="90" ry="12" fill="#D4C9B0" opacity="0.5"/>
  <!-- Trees left -->
  <rect x="30" y="40" width="3" height="15" fill="#8B7355"/>
  <ellipse cx="31.5" cy="38" rx="6" ry="8" fill="#5D8A3C"/>
  <rect x="50" y="43" width="2.5" height="12" fill="#8B7355"/>
  <ellipse cx="51.25" cy="41" rx="5" ry="7" fill="#4A7A2E"/>
  <!-- House -->
  <rect x="140" y="44" width="22" height="14" fill="#C8A87A"/>
  <polygon points="140,44 162,44 151,36" fill="#A0522D"/>
  <rect x="148" y="50" width="6" height="8" fill="#8B6914"/>
  <!-- Trees right -->
  <rect x="470" y="40" width="3" height="15" fill="#8B7355"/>
  <ellipse cx="471.5" cy="38" rx="6" ry="8" fill="#5D8A3C"/>
  <rect x="490" y="43" width="2.5" height="12" fill="#8B7355"/>
  <ellipse cx="491.25" cy="41" rx="5" ry="7" fill="#4A7A2E"/>
  <!-- Birds -->
  <path d="M400,8 Q403,5 406,8" stroke="#888" stroke-width="1" fill="none"/>
  <path d="M410,12 Q413,9 416,12" stroke="#888" stroke-width="1" fill="none"/>
  <path d="M420,6 Q423,3 426,6" stroke="#888" stroke-width="1" fill="none"/>
</svg>`;

// Checkmark circle
const CHECK_CIRCLE = `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="28" cy="28" r="26" stroke="#1B5E35" stroke-width="2.5" fill="none"/>
  <polyline points="17,28 24,35 39,20" stroke="#1B5E35" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

// Status icon variants
const STATUS_ICONS: Record<string, string> = {
  processing: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" stroke="#F59E0B" stroke-width="2.5" fill="none"/><circle cx="28" cy="28" r="10" stroke="#F59E0B" stroke-width="2.5" fill="none" stroke-dasharray="15 10"/></svg>`,
  shipped: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" stroke="#3B82F6" stroke-width="2.5" fill="none"/><path d="M16 28 H32 L38 22 H44 V34 H16 Z" stroke="#3B82F6" stroke-width="2" fill="none" stroke-linejoin="round"/><circle cx="22" cy="36" r="3" stroke="#3B82F6" stroke-width="2" fill="none"/><circle cx="38" cy="36" r="3" stroke="#3B82F6" stroke-width="2" fill="none"/></svg>`,
  delivered: CHECK_CIRCLE,
  cancelled: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" stroke="#EF4444" stroke-width="2.5" fill="none"/><line x1="18" y1="18" x2="38" y2="38" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/><line x1="38" y1="18" x2="18" y2="38" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/></svg>`,
  default: CHECK_CIRCLE,
};

const STATUS_COLORS: Record<string, string> = {
  processing: "#F59E0B",
  shipped: "#3B82F6",
  delivered: "#1B5E35",
  cancelled: "#EF4444",
  default: "#1B5E35",
};

// ─── Feature Badges ───────────────────────────────────────────────────────────

const featureBadges = () => `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0;">
  <tr>
    <!-- 100% Natural -->
    <td width="25%" style="text-align:center;padding:16px 6px;">
      <div style="margin-bottom:8px;">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" stroke="#E8F5E9" stroke-width="2" fill="#E8F5E9"/>
          <ellipse cx="18" cy="20" rx="9" ry="11" fill="#4CAF50" transform="rotate(-10 18 20)"/>
          <path d="M18 28 Q14 20 18 12" stroke="#1B5E35" stroke-width="1.5" fill="none"/>
        </svg>
      </div>
      <div style="font-family:Georgia,serif;font-size:11px;font-weight:bold;color:#1B5E35;margin-bottom:4px;">100% Natural</div>
      <div style="font-size:10px;color:#6B7280;">No added<br/>preservatives</div>
    </td>
    <!-- Traditionally Prepared -->
    <td width="25%" style="text-align:center;padding:16px 6px;">
      <div style="margin-bottom:8px;">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#E8F5E9"/>
          <ellipse cx="18" cy="22" rx="10" ry="8" stroke="#1B5E35" stroke-width="1.5" fill="none"/>
          <path d="M12 22 Q18 10 24 22" stroke="#1B5E35" stroke-width="1.5" fill="none"/>
          <line x1="18" y1="14" x2="18" y2="10" stroke="#1B5E35" stroke-width="1.5"/>
        </svg>
      </div>
      <div style="font-family:Georgia,serif;font-size:11px;font-weight:bold;color:#1B5E35;margin-bottom:4px;">Traditionally<br/>Prepared</div>
      <div style="font-size:10px;color:#6B7280;">Made the<br/>right way</div>
    </td>
    <!-- Quality Assured -->
    <td width="25%" style="text-align:center;padding:16px 6px;">
      <div style="margin-bottom:8px;">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#E8F5E9"/>
          <path d="M18 8 L26 12 V20 C26 24 22 28 18 30 C14 28 10 24 10 20 V12 Z" stroke="#1B5E35" stroke-width="1.5" fill="none"/>
          <polyline points="14,19 17,22 23,16" stroke="#1B5E35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </div>
      <div style="font-family:Georgia,serif;font-size:11px;font-weight:bold;color:#1B5E35;margin-bottom:4px;">Quality<br/>Assured</div>
      <div style="font-size:10px;color:#6B7280;">Carefully sourced<br/>and packed</div>
    </td>
    <!-- Healthy & Nutritious -->
    <td width="25%" style="text-align:center;padding:16px 6px;">
      <div style="margin-bottom:8px;">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#E8F5E9"/>
          <path d="M18 26 C18 26 9 21 9 15 C9 12 11.5 10 14.5 10 C16 10 17.5 10.8 18 12 C18.5 10.8 20 10 21.5 10 C24.5 10 27 12 27 15 C27 21 18 26 18 26Z" fill="#E53935" stroke="#C62828" stroke-width="1"/>
        </svg>
      </div>
      <div style="font-family:Georgia,serif;font-size:11px;font-weight:bold;color:#1B5E35;margin-bottom:4px;">Healthy &amp;<br/>Nutritious</div>
      <div style="font-size:10px;color:#6B7280;">Good for you<br/>and your family</div>
    </td>
  </tr>
</table>`;

// ─── Help Section ─────────────────────────────────────────────────────────────

const helpSection = () => `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF7F2;border-radius:10px;margin:0;">
  <tr>
    <td style="padding:18px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="44" valign="middle" style="padding-right:14px;">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" fill="#E8F5E9"/>
              <circle cx="20" cy="14" rx="6" fill="none" stroke="#1B5E35" stroke-width="1.8"/>
              <path d="M8 32 C8 26 12 22 20 22 C28 22 32 26 32 32" stroke="#1B5E35" stroke-width="1.8" fill="none"/>
              <path d="M20 22 Q20 17 24 14" stroke="#1B5E35" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            </svg>
          </td>
          <td valign="middle">
            <div style="font-family:Georgia,serif;font-size:14px;font-weight:bold;color:#1F2937;margin-bottom:3px;">Need Help?</div>
            <div style="font-size:12px;color:#6B7280;">We're here for you! Contact us anytime.</div>
          </td>
          <td valign="middle" align="right">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-bottom:6px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-right:6px;">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="#1B5E35" stroke-width="1.3" fill="none"/><polyline points="1,3 8,9 15,3" stroke="#1B5E35" stroke-width="1.3" fill="none"/></svg>
                      </td>
                      <td style="font-size:12px;color:#1B5E35;">support@nityagro.com</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-right:6px;">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 2 C3 2 5 2 6 5 L5 7 C5 7 7 11 11 11 L13 10 C16 11 14 13 14 13 C14 13 3 12 3 2Z" stroke="#1B5E35" stroke-width="1.3" fill="none"/></svg>
                      </td>
                      <td style="font-size:12px;color:#1B5E35;">+977 9800000000</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;

// ─── Social Footer ────────────────────────────────────────────────────────────

const socialFooter = () => `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:whitesmoke;">
  <tr>
    <td style="padding:16px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <!-- Social icons -->
          <td valign="middle" width="120">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <!-- Facebook -->
                <td style="padding-right:10px;">
                  <a href="#" style="text-decoration:none;display:block;width:32px;height:32px;background:rgba(255,255,255,0.18);border-radius:8px;line-height:32px;text-align:center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" style="display:inline-block;vertical-align:middle;">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                </td>
                <!-- Instagram -->
                <td style="padding-right:10px;">
                  <a href="#" style="text-decoration:none;display:block;width:32px;height:32px;background:rgba(255,255,255,0.18);border-radius:8px;line-height:32px;text-align:center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="1.2" fill="white" stroke="none"/>
                    </svg>
                  </a>
                </td>
                <!-- WhatsApp -->
                <td>
                  <a href="#" style="text-decoration:none;display:block;width:32px;height:32px;background:rgba(255,255,255,0.18);border-radius:8px;line-height:32px;text-align:center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" style="display:inline-block;vertical-align:middle;">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.85L.057 23.428a.5.5 0 0 0 .617.609l5.717-1.501A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.95 9.95 0 0 1-5.14-1.428l-.368-.218-3.812 1.001 1.018-3.714-.24-.38A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                  </a>
                </td>
              </tr>
            </table>
          </td>
          <!-- Website -->
          <td valign="middle" align="center">
            <span style="font-size:13px;color:white;font-family:Arial,sans-serif;">www.nityagro.com</span>
          </td>
          <!-- Packed in Nepal -->
          <td valign="middle" align="right">
            <span style="font-size:11px;color:#A5D6A7;font-family:Arial,sans-serif;">Processed &amp; Packed in Nepal with ❤️</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;

// ─── Header Section ───────────────────────────────────────────────────────────

const emailHeader = () => `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${HEADER_BG};position:relative;">
  <tr>
    <td style="padding:28px 24px 20px;text-align:center;position:relative;">
      <!-- Leaf overlays via pseudo-table trick -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="80" valign="top" style="padding-top:0;">
            <svg width="80" height="90" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="15" cy="30" rx="12" ry="28" fill="#4CAF50" transform="rotate(-30 15 30)"/>
              <ellipse cx="35" cy="15" rx="9" ry="22" fill="#388E3C" transform="rotate(-50 35 15)"/>
              <ellipse cx="8" cy="55" rx="8" ry="18" fill="#66BB6A" transform="rotate(-15 8 55)"/>
            </svg>
          </td>
          <td valign="top" style="text-align:center;">
            <!-- Sun -->
            <div style="margin-bottom:6px;">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;">
                <circle cx="18" cy="18" r="11" fill="#F5A623"/>
                <line x1="18" y1="3" x2="18" y2="7" stroke="#F5A623" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="18" y1="29" x2="18" y2="33" stroke="#F5A623" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="3" y1="18" x2="7" y2="18" stroke="#F5A623" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="29" y1="18" x2="33" y2="18" stroke="#F5A623" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="7.9" y1="7.9" x2="10.8" y2="10.8" stroke="#F5A623" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="25.2" y1="25.2" x2="28.1" y2="28.1" stroke="#F5A623" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="28.1" y1="7.9" x2="25.2" y2="10.8" stroke="#F5A623" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="10.8" y1="25.2" x2="7.9" y2="28.1" stroke="#F5A623" stroke-width="2.2" stroke-linecap="round"/>
              </svg>
            </div>
            <!-- Nityagro logo -->
            <div style="display:inline-block;">
              <img src="http://localhost:3000/logo.png" alt="Nityagro" width="160" height="auto" style="display:block;max-width:160px;" />
            </div>
            <div style="margin-top:8px;font-family:Georgia,serif;font-size:12px;color:#5D4E2E;letter-spacing:1px;font-style:italic;">Traditional Foods, Made the Right Way</div>
          </td>
          <td width="80" valign="top" style="padding-top:0;">
            <svg width="80" height="90" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="65" cy="30" rx="12" ry="28" fill="#4CAF50" transform="rotate(30 65 30)"/>
              <ellipse cx="45" cy="15" rx="9" ry="22" fill="#388E3C" transform="rotate(50 45 15)"/>
              <ellipse cx="72" cy="55" rx="8" ry="18" fill="#66BB6A" transform="rotate(15 72 55)"/>
            </svg>
          </td>
        </tr>
      </table>
      <!-- Landscape sketch -->
      <div style="margin-top:10px;">
        ${LANDSCAPE_SVG}
      </div>
    </td>
  </tr>
  <!-- Dark green divider line -->
  <tr>
    <td style="height:5px;background:#1B5E35;line-height:5px;font-size:5px;">&nbsp;</td>
  </tr>
</table>`;

// ─── Divider ──────────────────────────────────────────────────────────────────

const divider = (color = "#E5E7EB") =>
  `<div style="height:1px;background:${color};margin:20px 0;"></div>`;

// ─── Icon Row ─────────────────────────────────────────────────────────────────

const transactionIcon = () => `
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="18" cy="18" r="17" fill="#F3F4F6"/>
  <rect x="10" y="9" width="16" height="20" rx="2" stroke="#6B7280" stroke-width="1.5" fill="none"/>
  <line x1="13" y1="14" x2="23" y2="14" stroke="#6B7280" stroke-width="1.2"/>
  <line x1="13" y1="17.5" x2="23" y2="17.5" stroke="#6B7280" stroke-width="1.2"/>
  <line x1="13" y1="21" x2="20" y2="21" stroke="#6B7280" stroke-width="1.2"/>
</svg>`;

const packageIcon = () => `
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="18" cy="18" r="17" fill="#F3F4F6"/>
  <rect x="10" y="14" width="16" height="13" rx="1.5" stroke="#6B7280" stroke-width="1.5" fill="none"/>
  <polyline points="10,14 18,9 26,14" stroke="#6B7280" stroke-width="1.5" fill="none"/>
  <line x1="18" y1="9" x2="18" y2="27" stroke="#6B7280" stroke-width="1.2"/>
  <line x1="10" y1="14" x2="26" y2="14" stroke="#6B7280" stroke-width="1.2"/>
</svg>`;

const rupeeIcon = () => `
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="18" cy="18" r="17" fill="#F3F4F6"/>
  <text x="18" y="24" text-anchor="middle" font-size="16" fill="#6B7280" font-family="Arial">₹</text>
</svg>`;

const locationIcon = () => `
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="18" cy="18" r="17" fill="#F3F4F6"/>
  <path d="M18 10 C14.5 10 12 12.5 12 16 C12 21 18 27 18 27 C18 27 24 21 24 16 C24 12.5 21.5 10 18 10Z" stroke="#6B7280" stroke-width="1.5" fill="none"/>
  <circle cx="18" cy="16" r="2.5" stroke="#6B7280" stroke-width="1.3" fill="none"/>
</svg>`;

const truckIcon = () => `
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="16" width="26" height="18" rx="2" stroke="#6B7280" stroke-width="1.8" fill="none"/>
  <path d="M30 22 L38 22 L44 28 V34 H30 V22Z" stroke="#6B7280" stroke-width="1.8" fill="none"/>
  <circle cx="12" cy="36" r="3.5" stroke="#6B7280" stroke-width="1.8" fill="none"/>
  <circle cx="38" cy="36" r="3.5" stroke="#6B7280" stroke-width="1.8" fill="none"/>
  <!-- Leaf on truck -->
  <ellipse cx="42" cy="18" rx="5" ry="7" fill="#4CAF50" transform="rotate(-30 42 18)"/>
</svg>`;

// ─── Chilli Powder Illustration ───────────────────────────────────────────────

const chilliIllustration = () => `
<svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Wooden bowl -->
  <ellipse cx="55" cy="80" rx="45" ry="18" fill="#A0522D" opacity="0.2"/>
  <path d="M15 65 Q10 80 55 88 Q100 80 95 65 Z" fill="#8B4513"/>
  <ellipse cx="55" cy="65" rx="40" ry="14" fill="#A0522D"/>
  <!-- Red chilli powder mound -->
  <ellipse cx="55" cy="60" rx="34" ry="12" fill="#C0392B"/>
  <path d="M21 60 Q30 45 55 42 Q80 45 89 60" fill="#E74C3C"/>
  <!-- Powder texture -->
  <ellipse cx="48" cy="54" rx="6" ry="2" fill="#C0392B" opacity="0.4"/>
  <ellipse cx="65" cy="50" rx="5" ry="1.5" fill="#C0392B" opacity="0.4"/>
  <!-- Whole chilli pepper -->
  <path d="M70 30 Q85 20 88 35 Q85 45 78 50 Q72 46 70 30Z" fill="#E74C3C"/>
  <path d="M70 30 Q68 25 72 22" stroke="#4CAF50" stroke-width="2" fill="none"/>
  <!-- Second chilli -->
  <path d="M30 35 Q20 25 22 38 Q25 48 33 50 Q36 45 30 35Z" fill="#C0392B"/>
  <path d="M30 35 Q32 30 28 27" stroke="#4CAF50" stroke-width="2" fill="none"/>
  <!-- Leaves on bowl rim -->
  <ellipse cx="15" cy="65" rx="8" ry="14" fill="#4CAF50" transform="rotate(-20 15 65)"/>
  <ellipse cx="95" cy="65" rx="8" ry="14" fill="#388E3C" transform="rotate(20 95 65)"/>
  <ellipse cx="10" cy="72" rx="6" ry="10" fill="#66BB6A" transform="rotate(-10 10 72)"/>
</svg>`;

// ─── Base Email Wrapper ────────────────────────────────────────────────────────

const baseEmail = (body: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Nityagro</title>
</head>
<body style="margin:0;padding:20px 10px;background:#EBEBEB;font-family:Arial,Helvetica,sans-serif;color:#1F2937;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr><td>${emailHeader()}</td></tr>

          <!-- BODY -->
          <tr><td style="padding:32px 32px 24px;">${body}</td></tr>

          <!-- FEATURE BADGES -->
          <tr>
            <td style="padding:0 20px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;">
                <tr><td>${featureBadges()}</td></tr>
              </table>
            </td>
          </tr>

          <!-- HELP -->
          <tr>
            <td style="padding:0 20px 20px;">${helpSection()}</td>
          </tr>

          <!-- THANK YOU -->
          <tr>
            <td style="text-align:center;padding:8px 20px 20px;">
              <div style="font-family:Georgia,serif;font-size:16px;color:#374151;">Thank you for choosing Nityagro.</div>
              <div style="margin:8px 0;">
                <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="8" x2="8" y2="8" stroke="#C8B89A" stroke-width="1"/>
                  <path d="M10 5 C10 5 8 7 10 9 C12 7 10 5 10 5Z" fill="#E53935"/>
                  <line x1="12" y1="8" x2="20" y2="8" stroke="#C8B89A" stroke-width="1"/>
                </svg>
              </div>
              <div style="font-family:Georgia,serif;font-size:14px;color:#6B7280;font-style:italic;">Happy Shopping!</div>
            </td>
          </tr>

          <!-- SOCIAL FOOTER -->
          <tr><td>${socialFooter()}</td></tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ─── Order Placed Email ───────────────────────────────────────────────────────

export function buildOrderPlacedEmail(input: OrderPlacedEmailInput) {
  const itemsHtml = input.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 10px;border-bottom:1px solid #F3F4F6;font-size:14px;color:#374151;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${
                item.pImage
                  ? `<td style="padding-right:10px;vertical-align:middle;">
                      <img src="${item.pImage}" alt="${item.name}" width="52" height="52"
                        style="display:block;width:52px;height:52px;object-fit:cover;border-radius:8px;border:1px solid #E5E7EB;" />
                    </td>`
                  : ""
              }
              <td style="vertical-align:middle;">
                <div style="font-size:14px;color:#374151;font-weight:500;">${item.name}</div>
              </td>
            </tr>
          </table>
        </td>
        <td style="padding:12px 10px;border-bottom:1px solid #F3F4F6;text-align:center;font-size:14px;color:#374151;vertical-align:middle;">x${item.qty}</td>
        <td style="padding:12px 10px;border-bottom:1px solid #F3F4F6;text-align:right;font-size:14px;font-weight:600;color:#1F2937;vertical-align:middle;">${currency(item.amount)}</td>
      </tr>`,
    )
    .join("");

  const body = `
    <!-- Check + Title -->
    <div style="text-align:center;margin-bottom:24px;">
      ${CHECK_CIRCLE}
      <h1 style="margin:14px 0 4px;font-family:Georgia,serif;font-size:30px;font-weight:bold;color:#1B5E35;letter-spacing:0.5px;">Order Confirmed!</h1>
      <div style="display:inline-block;width:20px;height:20px;">
        <svg width="20" height="12" viewBox="0 0 20 12"><path d="M0 6 L4 2 L4 5 L20 5 L20 7 L4 7 L4 10 Z" fill="#C8B89A" opacity="0.6"/></svg>
      </div>
    </div>

    <!-- Greeting -->
    <p style="text-align:center;font-size:16px;font-weight:bold;color:#1F2937;margin:0 0 6px;">Hello ${input.customerName},</p>
    <p style="text-align:center;font-size:14px;color:#6B7280;margin:0 0 28px;">Thank you for shopping with Nityagro.<br/>Your order has been placed successfully.</p>

    <!-- Details Card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
      <!-- Transaction ID -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="44" valign="middle" style="padding-right:14px;">${transactionIcon()}</td>
              <td valign="middle">
                <div style="font-size:12px;color:#9CA3AF;margin-bottom:3px;">Transaction ID</div>
                <div style="font-size:14px;font-weight:bold;color:#1F2937;">${input.transactionId}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Order Summary + Chilli Illustration -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="top">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="44" valign="top" style="padding-right:14px;">${packageIcon()}</td>
                    <td valign="top">
                      <div style="font-size:12px;color:#9CA3AF;margin-bottom:8px;">Order Summary</div>
                      <table cellpadding="0" cellspacing="0" border="0" width="320">
                        <thead>
                          <tr style="background:#F9FAFB;">
                            <th style="text-align:left;padding:10px;font-size:12px;color:#6B7280;font-weight:600;border-radius:8px 0 0 0;">Item</th>
                            <th style="text-align:center;padding:10px;font-size:12px;color:#6B7280;font-weight:600;">Qty</th>
                            <th style="text-align:right;padding:10px;font-size:12px;color:#6B7280;font-weight:600;border-radius:0 8px 0 0;">Amount</th>
                          </tr>
                        </thead>
                        <tbody>${itemsHtml}</tbody>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
              <td width="120" valign="middle" align="right">
                ${chilliIllustration()}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Total Amount -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="44" valign="middle" style="padding-right:14px;">${rupeeIcon()}</td>
              <td valign="middle">
                <div style="font-size:12px;color:#9CA3AF;margin-bottom:3px;">Total Amount</div>
                <div style="font-size:18px;font-weight:bold;color:#1B5E35;">${currency(input.totalAmount)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      ${
        input.addressText
          ? `<!-- Shipping Address -->
      <tr>
        <td style="padding:16px 18px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="44" valign="middle" style="padding-right:14px;">${locationIcon()}</td>
              <td valign="middle">
                <div style="font-size:12px;color:#9CA3AF;margin-bottom:3px;">Shipping Address</div>
                <div style="font-size:14px;color:#374151;">${input.addressText}</div>
              </td>
              <td width="60" valign="middle" align="right">${truckIcon()}</td>
            </tr>
          </table>
        </td>
      </tr>`
          : ""
      }
    </table>
  `;

  return {
    subject: `Order Confirmed - ${input.transactionId}`,
    html: baseEmail(body),
    text: `Order confirmed. Transaction ${input.transactionId}. Total ${currency(input.totalAmount)}`,
  };
}

// ─── Order Status Email ───────────────────────────────────────────────────────

export function buildOrderStatusEmail(input: OrderStatusEmailInput) {
  const statusKey = input.orderStatus.toLowerCase();
  const icon = STATUS_ICONS[statusKey] ?? STATUS_ICONS.default;
  const color = STATUS_COLORS[statusKey] ?? STATUS_COLORS.default;

  const statusLabel = input.orderStatus.toUpperCase();
  const paymentLabel = input.paymentStatus.toUpperCase();

  const statusMessages: Record<string, { title: string; subtitle: string }> = {
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

  const msg = statusMessages[statusKey] ?? statusMessages.default;

  const paymentColor =
    input.paymentStatus.toLowerCase() === "paid"
      ? "#1B5E35"
      : input.paymentStatus.toLowerCase() === "pending"
        ? "#F59E0B"
        : "#EF4444";

  const body = `
    <!-- Icon + Title -->
    <div style="text-align:center;margin-bottom:24px;">
      ${icon}
      <h1 style="margin:14px 0 4px;font-family:Georgia,serif;font-size:28px;font-weight:bold;color:${color};">${msg.title}</h1>
    </div>

    <!-- Greeting -->
    <p style="text-align:center;font-size:16px;font-weight:bold;color:#1F2937;margin:0 0 6px;">Hello ${input.customerName},</p>
    <p style="text-align:center;font-size:14px;color:#6B7280;margin:0 0 28px;">${msg.subtitle}</p>

    <!-- Details Card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
      <!-- Order ID -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="44" valign="middle" style="padding-right:14px;">${transactionIcon()}</td>
              <td valign="middle">
                <div style="font-size:12px;color:#9CA3AF;margin-bottom:3px;">Order ID</div>
                <div style="font-size:14px;font-weight:bold;color:#1F2937;">#${input.orderId}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Product + Image -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="middle">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="44" valign="middle" style="padding-right:14px;">${packageIcon()}</td>
                    <td valign="middle">
                      <div style="font-size:12px;color:#9CA3AF;margin-bottom:3px;">Product</div>
                      <div style="font-size:15px;font-weight:600;color:#1F2937;">${input.productName}</div>
                    </td>
                  </tr>
                </table>
              </td>
              <td width="110" valign="middle" align="right">
                ${
                  input.pImage
                    ? `<img src="${input.pImage}" alt="${input.productName}" width="100" height="100"
                        style="display:block;width:100px;height:100px;object-fit:cover;border-radius:10px;border:1px solid #E5E7EB;" />`
                    : chilliIllustration()
                }
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Order Status -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="44" valign="middle" style="padding-right:14px;">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="17" fill="#F3F4F6"/>
                  <circle cx="18" cy="18" r="7" stroke="${color}" stroke-width="1.8" fill="none"/>
                  <circle cx="18" cy="18" r="3" fill="${color}"/>
                </svg>
              </td>
              <td valign="middle">
                <div style="font-size:12px;color:#9CA3AF;margin-bottom:3px;">Order Status</div>
                <span style="display:inline-block;background:${color}1A;color:${color};font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;border:1px solid ${color}40;">${statusLabel}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Payment Status -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="44" valign="middle" style="padding-right:14px;">${rupeeIcon()}</td>
              <td valign="middle">
                <div style="font-size:12px;color:#9CA3AF;margin-bottom:3px;">Payment Status</div>
                <span style="display:inline-block;background:${paymentColor}1A;color:${paymentColor};font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;border:1px solid ${paymentColor}40;">${paymentLabel}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Amount -->
      <tr>
        <td style="padding:16px 18px;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="44" valign="middle" style="padding-right:14px;">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="17" fill="#F3F4F6"/>
                  <text x="18" y="24" text-anchor="middle" font-size="15" fill="#6B7280" font-family="Arial">₹</text>
                </svg>
              </td>
              <td valign="middle">
                <div style="font-size:12px;color:#9CA3AF;margin-bottom:3px;">Amount</div>
                <div style="font-size:18px;font-weight:bold;color:#1B5E35;">${currency(input.amount)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return {
    subject: `Order #${input.orderId} – ${msg.title}`,
    html: baseEmail(body),
    text: `Order #${input.orderId} status: ${input.orderStatus}, payment: ${input.paymentStatus}, amount: ${currency(input.amount)}`,
  };
}