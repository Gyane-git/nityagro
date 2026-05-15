import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { createRequire } from "module";
import type { Order, OrderItem, User, Product, CustomerAddress, Province, ShippingCity, AddressZone } from "@prisma/client";

export type InvoiceOrder = Order & {
  user?: User | null;
  items?: (OrderItem & { product?: Pick<Product, "name" | "productCode"> | null })[];
};

type AddressSnapshot = CustomerAddress & {
  province?: Province | null;
  city?: ShippingCity | null;
  zone?: AddressZone | null;
};

const currency = (value: unknown) => {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) return "Rs. 0";
  return `Rs. ${num.toLocaleString("en-IN")}`;
};

export async function generateInvoicePdf(
  order: InvoiceOrder,
  address?: AddressSnapshot | null
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Ensure PDFKit can find its built-in font data in production
    if (!process.env.PDFKIT_FONTDIR) {
      const candidates: string[] = [];

      try {
        const req = createRequire(process.cwd() + "/");
        const pdfkitPkg = req.resolve("pdfkit/package.json");
        candidates.push(path.join(path.dirname(pdfkitPkg), "js", "data"));
      } catch {
        // ignore and fall back to path search
      }

      const baseDirs = [
        process.env.PWD,
        process.env.INIT_CWD,
        process.cwd(),
        path.join(process.cwd(), ".."),
      ].filter(Boolean) as string[];

      for (const base of baseDirs) {
        candidates.push(path.join(base, "node_modules", "pdfkit", "js", "data"));
      }

      candidates.push(
        "/home/sanjaya/development/nityagro/node_modules/pdfkit/js/data"
      );

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          process.env.PDFKIT_FONTDIR = candidate;
          break;
        }
      }
    }

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).text("Nityagro Nepal", { align: "left" });
    doc.fontSize(10).text("Kathmandu, Nepal");
    doc.moveDown();

    doc.fontSize(16).text("INVOICE", { align: "right" });
    doc.fontSize(10).text(`Invoice #: ${order.orderNumber}`, { align: "right" });
    doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`, { align: "right" });

    doc.moveDown();
    doc.fontSize(12).text("Bill To:");
    doc.fontSize(10);
    doc.text(order.user?.fullName || "Customer");
    doc.text(order.user?.email || "");
    if (address) {
      doc.text(address.phone || "");
      doc.text(address.address || "");
      const location = [address.zone?.zoneName, address.city?.city, address.province?.name]
        .filter(Boolean)
        .join(", ");
      if (location) doc.text(location);
    }

    doc.moveDown();
    doc.fontSize(12).text("Order Details");
    doc.fontSize(10).text(`Status: ${String(order.orderStatus || "processing").toUpperCase()}`);
    doc.text(`Payment: ${String(order.paymentStatus || "unpaid").toUpperCase()}`);

    doc.moveDown();
    doc.fontSize(11).text("Items Ordered", { underline: true });
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const itemX = 40;
    const qtyX = 350;
    const priceX = 430;

    doc.fontSize(10).text("Product", itemX, tableTop);
    doc.text("Qty", qtyX, tableTop);
    doc.text("Price", priceX, tableTop);
    doc.moveDown();

    (order.items || []).forEach((item) => {
      const name = item.product?.name || item.productCode;
      doc.text(name, itemX);
      doc.text(item.quantity.toString(), qtyX);
      doc.text(currency(item.price), priceX);
      doc.moveDown(0.5);
    });

    doc.moveDown();
    doc.text(`Subtotal: ${currency(order.subtotal)}`, { align: "right" });
    doc.text(`Tax: ${currency(order.tax)}`, { align: "right" });
    doc.text(`Shipping: ${currency(order.shippingCost)}`, { align: "right" });
    doc.text(`Discount: -${currency(order.discount)}`, { align: "right" });
    doc.font("Helvetica-Bold").text(`Total: ${currency(order.totalAmount)}`, { align: "right" });
    doc.font("Helvetica");

    doc.moveDown(2);
    doc.fontSize(10).text("Thank you for your business!", { align: "center" });

    doc.end();
  });
}
