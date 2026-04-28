// app/checkout/page.tsx
import AccountSidebar       from "./components/AccountSidebar";
import DeliveryAddressForm  from "./components/DeliveryAddressForm";
import OrderSummary         from "./components/OrderSummary";
import Breadcrumb           from "./components/Breadcrumb";

export default function CheckoutPage() {
  return (
    /*
     * Full-page wrapper — centers content at 1440px max-width, matching
     * the Nityagro Figma canvas width. Outer bg is white.
     */
    <div className="min-h-screen bg-white">
      <div
        className="mx-auto px-10 py-10"
        style={{ maxWidth: "1440px" }}
      >

        {/* ── Page title ───────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1
            className="font-bold mb-2"
            style={{ fontSize: "28px", color: "#00462C" }}
          >
            Checkout
          </h1>
          {/* Dark-green underline */}
          <div
            style={{
              width: "120px",
              height: "2.5px",
              background: "#00462C",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <div className="mb-8">
          <Breadcrumb />
        </div>

        {/* ── Three-column layout ──────────────────────────────────────── */}
        {/*
         *  Column 1 → AccountSidebar   (240px fixed)
         *  Column 2 → DeliveryAddressForm (flex-1, fills remaining space)
         *  Column 3 → OrderSummary     (280px fixed)
         *
         *  gap-5 = 20px between columns
         */}
        <div className="flex items-start gap-5">
          <AccountSidebar />
          <DeliveryAddressForm />
          <OrderSummary />
        </div>

      </div>
    </div>
  );
}