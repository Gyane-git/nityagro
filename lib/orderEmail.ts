// ─── Types ────────────────────────────────────────────────────────────────────

export type EmailOrderItem = {
  name: string;
  qty: number;
  amount: number;
  pImage?: string; // product image URL from API
};

export type OrderPlacedEmailInput = {
  customerName: string;
  transactionId: string;
  items: EmailOrderItem[];
  totalAmount: number;
  addressText?: string;
};

export type OrderStatusEmailInput = {
  customerName: string;
  orderId: string;
  productName: string;
  pImage?: string; // product image URL from API
  orderStatus: string;
  paymentStatus: string;
  amount: number;
};

// ─── Config ───────────────────────────────────────────────────────────────────

// IMPORTANT: Email clients require absolute URLs.
// Relative paths like /logo.png will NOT load in Gmail, Outlook, etc.
// Set this to your actual production domain:
const BASE_URL = "http://192.168.1.144:3000";

const currency = (value: number) =>
  `NPR ${Number(value || 0).toLocaleString()}`;

// ─── Lucide Icons (inlined SVG paths — exact paths from lucide-react) ─────────
// Used inline in HTML email strings. No import needed.

/** lucide: file-text */
const ICON_FILE_TEXT = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`;

/** lucide: package */
const ICON_PACKAGE = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/></svg>`;

/** lucide: indian-rupee */
const ICON_RUPEE = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>`;

/** lucide: map-pin */
const ICON_MAP_PIN = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`;

/** lucide: truck */
const ICON_TRUCK = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`;

/** lucide: circle-check-big  — order confirmed / delivered */
const ICON_CIRCLE_CHECK = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#1B5E35" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`;

/** lucide: loader — processing */
const ICON_LOADER = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>`;

/** lucide: package-check — shipped */
const ICON_PACKAGE_CHECK = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 2 2 4-4"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/></svg>`;

/** lucide: circle-x — cancelled */
const ICON_CIRCLE_X = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;

/** lucide: headphones — help section */
const ICON_HEADPHONES = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B5E35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>`;

/** lucide: mail */
const ICON_MAIL = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1B5E35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;

/** lucide: phone */
const ICON_PHONE = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1B5E35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.34 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.28-1.28a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

/** lucide: leaf */
const ICON_LEAF = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;

/** lucide: utensils-crossed */
const ICON_UTENSILS = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/></svg>`;

/** lucide: shield-check */
const ICON_SHIELD_CHECK = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`;

/** lucide: heart (filled red) */
const ICON_HEART_FILLED = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#E53935" stroke="#E53935" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;

/** lucide: activity (pulse line — used for status) */
const activityIcon = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>`;

// ─── Icon badge (40×40 grey circle with a Lucide icon centered) ───────────────

const iconBadge = (icon: string) =>
  `<div style="width:40px;height:40px;background:#F3F4F6;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;text-align:center;line-height:0;">
    <!--[if mso]><table><tr><td style="width:40px;height:40px;text-align:center;vertical-align:middle;background:#F3F4F6;border-radius:50%;"><!-[endif]-->
    <div style="display:inline-block;vertical-align:middle;padding:10px;line-height:0;">${icon}</div>
    <!--[if mso]></td></tr></table><![endif]-->
  </div>`;

// ─── Header: /emailheader.png as background, /logo.png centered ───────────────

const emailHeader = () => `
<!--[if mso]>
<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
  <v:fill type="frame" src="${BASE_URL}/emailheader.png" color="#F5F0E8"/>
  <v:textbox inset="0,0,0,0">
<![endif]-->
<table width="100%" cellpadding="0" cellspacing="0" border="0"
  style="background-image:url('${BASE_URL}/emailheader.png');background-size:cover;background-position:center top;background-repeat:no-repeat;">
  <tr>
    <td style="padding:36px 24px 28px;text-align:center;">
      <img src="${BASE_URL}/logo.png"
        alt="Nityagro"
        width="160"
        style="display:inline-block;max-width:160px;height:auto;border:0;outline:none;text-decoration:none;" />
      <div style="margin-top:10px;font-family:Georgia,serif;font-size:12px;color:#5D4E2E;letter-spacing:1.2px;font-style:italic;">
        Traditional Foods, Made the Right Way
      </div>
    </td>
  </tr>
</table>
<!--[if mso]>
  </v:textbox>
</v:rect>
<![endif]-->
<div style="height:5px;background:#1B5E35;font-size:0;line-height:0;">&nbsp;</div>`;

// ─── Feature Badges ───────────────────────────────────────────────────────────

const featureBadges = () => `
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td width="25%" style="text-align:center;padding:18px 6px 16px;vertical-align:top;">
      <div style="display:inline-block;background:#E8F5E9;border-radius:50%;padding:10px;margin-bottom:8px;line-height:0;">${ICON_LEAF}</div>
      <div style="font-family:Georgia,serif;font-size:11px;font-weight:bold;color:#1B5E35;margin-bottom:3px;">100% Natural</div>
      <div style="font-size:10px;color:#6B7280;line-height:1.5;">No added<br/>preservatives</div>
    </td>
    <td width="25%" style="text-align:center;padding:18px 6px 16px;vertical-align:top;">
      <div style="display:inline-block;background:#E8F5E9;border-radius:50%;padding:10px;margin-bottom:8px;line-height:0;">${ICON_UTENSILS}</div>
      <div style="font-family:Georgia,serif;font-size:11px;font-weight:bold;color:#1B5E35;margin-bottom:3px;">Traditionally<br/>Prepared</div>
      <div style="font-size:10px;color:#6B7280;line-height:1.5;">Made the<br/>right way</div>
    </td>
    <td width="25%" style="text-align:center;padding:18px 6px 16px;vertical-align:top;">
      <div style="display:inline-block;background:#E8F5E9;border-radius:50%;padding:10px;margin-bottom:8px;line-height:0;">${ICON_SHIELD_CHECK}</div>
      <div style="font-family:Georgia,serif;font-size:11px;font-weight:bold;color:#1B5E35;margin-bottom:3px;">Quality<br/>Assured</div>
      <div style="font-size:10px;color:#6B7280;line-height:1.5;">Carefully sourced<br/>and packed</div>
    </td>
    <td width="25%" style="text-align:center;padding:18px 6px 16px;vertical-align:top;">
      <div style="display:inline-block;background:#FEE2E2;border-radius:50%;padding:10px;margin-bottom:8px;line-height:0;">${ICON_HEART_FILLED}</div>
      <div style="font-family:Georgia,serif;font-size:11px;font-weight:bold;color:#1B5E35;margin-bottom:3px;">Healthy &amp;<br/>Nutritious</div>
      <div style="font-size:10px;color:#6B7280;line-height:1.5;">Good for you<br/>and your family</div>
    </td>
  </tr>
</table>`;

// ─── Help Section ─────────────────────────────────────────────────────────────

const helpSection = () => `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF7F2;border-radius:10px;">
  <tr>
    <td style="padding:16px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="50" valign="middle" style="padding-right:12px;">
            <div style="width:44px;height:44px;background:#E8F5E9;border-radius:50%;text-align:center;line-height:0;display:inline-block;">
              <div style="display:inline-block;vertical-align:middle;padding:11px;line-height:0;">${ICON_HEADPHONES}</div>
            </div>
          </td>
          <td valign="middle">
            <div style="font-family:Georgia,serif;font-size:14px;font-weight:bold;color:#1F2937;margin-bottom:2px;">Need Help?</div>
            <div style="font-size:12px;color:#6B7280;">We're here for you! Contact us anytime.</div>
          </td>
          <td valign="middle" align="right">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-bottom:5px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-right:5px;vertical-align:middle;line-height:0;">${ICON_MAIL}</td>
                      <td style="font-size:12px;color:#1B5E35;vertical-align:middle;">support@nityagro.com</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-right:5px;vertical-align:middle;line-height:0;">${ICON_PHONE}</td>
                      <td style="font-size:12px;color:#1B5E35;vertical-align:middle;">+977 9800000000</td>
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
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1B5E35;">
  <tr>
    <td style="padding:14px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <!-- Social icons -->
          <td valign="middle" width="130">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <!-- Facebook -->
                <td style="padding-right:8px;">
                  <a href="#" style="text-decoration:none;display:block;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="34" height="34" style="background:rgba(255,255,255,0.2);border-radius:8px;text-align:center;vertical-align:middle;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                          </svg>
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
                <!-- Instagram -->
                <td style="padding-right:8px;">
                  <a href="#" style="text-decoration:none;display:block;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="34" height="34" style="background:rgba(255,255,255,0.2);border-radius:8px;text-align:center;vertical-align:middle;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                            <circle cx="12" cy="12" r="4"/>
                            <circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none"/>
                          </svg>
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
                <!-- WhatsApp -->
                <td>
                  <a href="#" style="text-decoration:none;display:block;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="34" height="34" style="background:rgba(255,255,255,0.2);border-radius:8px;text-align:center;vertical-align:middle;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.85L.057 23.428a.5.5 0 0 0 .617.609l5.717-1.501A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.95 9.95 0 0 1-5.14-1.428l-.368-.218-3.812 1.001 1.018-3.714-.24-.38A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                          </svg>
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
              </tr>
            </table>
          </td>
          <!-- Website -->
          <td valign="middle" align="center">
            <span style="font-size:13px;color:#A5D6A7;font-family:Arial,sans-serif;">www.nityagro.com</span>
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

// ─── Status icon & colour maps ────────────────────────────────────────────────

const STATUS_ICONS: Record<string, string> = {
  processing: ICON_LOADER,
  shipped:    ICON_PACKAGE_CHECK,
  delivered:  ICON_CIRCLE_CHECK,
  cancelled:  ICON_CIRCLE_X,
  default:    ICON_CIRCLE_CHECK,
};

const STATUS_COLORS: Record<string, string> = {
  processing: "#F59E0B",
  shipped:    "#3B82F6",
  delivered:  "#1B5E35",
  cancelled:  "#EF4444",
  default:    "#1B5E35",
};

// ─── Chilli SVG fallback (shown when no pImage provided) ─────────────────────

const chilliSvg = () => `
<svg width="100" height="100" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="55" cy="80" rx="45" ry="18" fill="#A0522D" opacity="0.2"/>
  <path d="M15 65 Q10 80 55 88 Q100 80 95 65 Z" fill="#8B4513"/>
  <ellipse cx="55" cy="65" rx="40" ry="14" fill="#A0522D"/>
  <ellipse cx="55" cy="60" rx="34" ry="12" fill="#C0392B"/>
  <path d="M21 60 Q30 45 55 42 Q80 45 89 60" fill="#E74C3C"/>
  <path d="M70 30 Q85 20 88 35 Q85 45 78 50 Q72 46 70 30Z" fill="#E74C3C"/>
  <path d="M70 30 Q68 25 72 22" stroke="#4CAF50" stroke-width="2" fill="none"/>
  <path d="M30 35 Q20 25 22 38 Q25 48 33 50 Q36 45 30 35Z" fill="#C0392B"/>
  <path d="M30 35 Q32 30 28 27" stroke="#4CAF50" stroke-width="2" fill="none"/>
  <ellipse cx="15" cy="65" rx="8" ry="14" fill="#4CAF50" transform="rotate(-20 15 65)"/>
  <ellipse cx="95" cy="65" rx="8" ry="14" fill="#388E3C" transform="rotate(20 95 65)"/>
</svg>`;

// ─── Base Email HTML wrapper ──────────────────────────────────────────────────

const baseEmail = (body: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Nityagro</title>
</head>
<body style="margin:0;padding:20px 10px;background:#E5E7EB;font-family:Arial,Helvetica,sans-serif;color:#1F2937;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" border="0"
          style="max-width:640px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.10);">

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
              <div style="display:inline-block;line-height:0;margin-bottom:6px;">${ICON_HEART_FILLED}</div>
              <p style="font-family:Georgia,serif;font-size:13px;color:#9CA3AF;font-style:italic;margin:4px 0 0;">Happy Shopping!</p>
            </td>
          </tr>

          <!-- SOCIAL FOOTER -->
          <tr><td style="padding:0;">${socialFooter()}</td></tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ─── Row label helper ─────────────────────────────────────────────────────────

const rowLabel = (text: string) =>
  `<div style="font-size:11px;color:#9CA3AF;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.6px;">${text}</div>`;

// ─── buildOrderPlacedEmail ────────────────────────────────────────────────────

export function buildOrderPlacedEmail(input: OrderPlacedEmailInput) {
  const itemsHtml = input.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 10px;border-bottom:1px solid #F3F4F6;vertical-align:middle;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${
                item.pImage
                  ? `<td style="padding-right:10px;vertical-align:middle;">
                      <img src="${item.pImage}" alt="${item.name}" width="56" height="56"
                        style="display:block;width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #E5E7EB;" />
                    </td>`
                  : ""
              }
              <td style="vertical-align:middle;">
                <div style="font-size:14px;color:#374151;font-weight:500;">${item.name}</div>
              </td>
            </tr>
          </table>
        </td>
        <td style="padding:12px 10px;border-bottom:1px solid #F3F4F6;text-align:center;font-size:14px;color:#6B7280;vertical-align:middle;">x${item.qty}</td>
        <td style="padding:12px 10px;border-bottom:1px solid #F3F4F6;text-align:right;font-size:14px;font-weight:600;color:#1F2937;vertical-align:middle;white-space:nowrap;">${currency(item.amount)}</td>
      </tr>`,
    )
    .join("");

  const body = `
    <!-- Confirmed icon + title -->
    <div style="text-align:center;margin-bottom:20px;">
      <div style="display:inline-block;margin-bottom:10px;">${ICON_CIRCLE_CHECK}</div>
      <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#1B5E35;">Order Confirmed!</h1>
    </div>

    <p style="text-align:center;font-size:16px;font-weight:bold;color:#1F2937;margin:0 0 4px;">Hello ${input.customerName},</p>
    <p style="text-align:center;font-size:14px;color:#6B7280;margin:0 0 26px;">
      Thank you for shopping with Nityagro.<br/>Your order has been placed successfully.
    </p>

    <!-- Details card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">

      <!-- Transaction ID -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="52" valign="middle" style="padding-right:14px;">${iconBadge(ICON_FILE_TEXT)}</td>
              <td valign="middle">
                ${rowLabel("Transaction ID")}
                <div style="font-size:14px;font-weight:bold;color:#1F2937;">${input.transactionId}</div>
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
              <td width="52" valign="top" style="padding-right:14px;">${iconBadge(ICON_PACKAGE)}</td>
              <td valign="top">
                ${rowLabel("Order Summary")}
                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                  style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;margin-top:6px;">
                  <thead>
                    <tr style="background:#F9FAFB;">
                      <th style="text-align:left;padding:9px 10px;font-size:11px;color:#6B7280;font-weight:600;">Item</th>
                      <th style="text-align:center;padding:9px 10px;font-size:11px;color:#6B7280;font-weight:600;">Qty</th>
                      <th style="text-align:right;padding:9px 10px;font-size:11px;color:#6B7280;font-weight:600;">Amount</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Total Amount -->
      <tr>
        <td style="padding:16px 18px;border-bottom:${input.addressText ? "1px solid #E5E7EB" : "none"};">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="52" valign="middle" style="padding-right:14px;">${iconBadge(ICON_RUPEE)}</td>
              <td valign="middle">
                ${rowLabel("Total Amount")}
                <div style="font-size:20px;font-weight:bold;color:#1B5E35;">${currency(input.totalAmount)}</div>
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
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="52" valign="middle" style="padding-right:14px;">${iconBadge(ICON_MAP_PIN)}</td>
              <td valign="middle">
                ${rowLabel("Shipping Address")}
                <div style="font-size:14px;color:#374151;">${input.addressText}</div>
              </td>
              <td width="52" valign="middle" align="right">${iconBadge(ICON_TRUCK)}</td>
            </tr>
          </table>
        </td>
      </tr>`
          : ""
      }
    </table>`;

  return {
    subject: `Order Confirmed – ${input.transactionId}`,
    html:    baseEmail(body),
    text:    `Order confirmed. Transaction: ${input.transactionId}. Total: ${currency(input.totalAmount)}`,
  };
}

// ─── buildOrderStatusEmail ────────────────────────────────────────────────────

export function buildOrderStatusEmail(input: OrderStatusEmailInput) {
  const statusKey    = input.orderStatus.toLowerCase();
  const icon         = STATUS_ICONS[statusKey]  ?? STATUS_ICONS.default;
  const color        = STATUS_COLORS[statusKey] ?? STATUS_COLORS.default;
  const statusLabel  = input.orderStatus.toUpperCase();
  const paymentLabel = input.paymentStatus.toUpperCase();

  const statusMessages: Record<string, { title: string; subtitle: string }> = {
    processing: { title: "Order Processing",  subtitle: "Your order is being processed and will be packed shortly." },
    shipped:    { title: "Order Shipped!",     subtitle: "Your order is on its way. You'll receive it soon." },
    delivered:  { title: "Order Delivered!",   subtitle: "Your order has been delivered. Enjoy your Nityagro products!" },
    cancelled:  { title: "Order Cancelled",    subtitle: "Your order has been cancelled. Contact us if you need help." },
    default:    { title: "Order Update",       subtitle: "There's an update regarding your order." },
  };

  const msg = statusMessages[statusKey] ?? statusMessages.default;

  const paymentColor =
    input.paymentStatus.toLowerCase() === "paid"    ? "#1B5E35"
    : input.paymentStatus.toLowerCase() === "pending" ? "#F59E0B"
    : "#EF4444";

  const body = `
    <!-- Status icon + title -->
    <div style="text-align:center;margin-bottom:20px;">
      <div style="display:inline-block;margin-bottom:10px;">${icon}</div>
      <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:bold;color:${color};">${msg.title}</h1>
    </div>

    <p style="text-align:center;font-size:16px;font-weight:bold;color:#1F2937;margin:0 0 4px;">Hello ${input.customerName},</p>
    <p style="text-align:center;font-size:14px;color:#6B7280;margin:0 0 26px;">${msg.subtitle}</p>

    <!-- Details card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">

      <!-- Order ID -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="52" valign="middle" style="padding-right:14px;">${iconBadge(ICON_FILE_TEXT)}</td>
              <td valign="middle">
                ${rowLabel("Order ID")}
                <div style="font-size:14px;font-weight:bold;color:#1F2937;">#${input.orderId}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Product + image -->
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #E5E7EB;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="middle">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="52" valign="middle" style="padding-right:14px;">${iconBadge(ICON_PACKAGE)}</td>
                    <td valign="middle">
                      ${rowLabel("Product")}
                      <div style="font-size:15px;font-weight:600;color:#1F2937;">${input.productName}</div>
                    </td>
                  </tr>
                </table>
              </td>
              <td width="108" valign="middle" align="right">
                ${
                  input.pImage
                    ? `<img src="${input.pImage}" alt="${input.productName}" width="100" height="100"
                        style="display:block;width:100px;height:100px;object-fit:cover;border-radius:10px;border:1px solid #E5E7EB;" />`
                    : chilliSvg()
                }
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
              <td width="52" valign="middle" style="padding-right:14px;">
                <div style="width:40px;height:40px;background:#F3F4F6;border-radius:50%;text-align:center;line-height:0;">
                  <div style="display:inline-block;vertical-align:middle;padding:10px;line-height:0;">${activityIcon(color)}</div>
                </div>
              </td>
              <td valign="middle">
                ${rowLabel("Order Status")}
                <span style="display:inline-block;background:${color}20;color:${color};font-size:12px;font-weight:700;
                  padding:4px 12px;border-radius:20px;border:1px solid ${color}50;">${statusLabel}</span>
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
              <td width="52" valign="middle" style="padding-right:14px;">${iconBadge(ICON_RUPEE)}</td>
              <td valign="middle">
                ${rowLabel("Payment Status")}
                <span style="display:inline-block;background:${paymentColor}20;color:${paymentColor};font-size:12px;font-weight:700;
                  padding:4px 12px;border-radius:20px;border:1px solid ${paymentColor}50;">${paymentLabel}</span>
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
              <td width="52" valign="middle" style="padding-right:14px;">${iconBadge(ICON_RUPEE)}</td>
              <td valign="middle">
                ${rowLabel("Amount")}
                <div style="font-size:20px;font-weight:bold;color:#1B5E35;">${currency(input.amount)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;

  return {
    subject: `Order #${input.orderId} – ${msg.title}`,
    html:    baseEmail(body),
    text:    `Order #${input.orderId} status: ${input.orderStatus}, payment: ${input.paymentStatus}, amount: ${currency(input.amount)}`,
  };
}