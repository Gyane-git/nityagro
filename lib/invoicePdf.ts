type InvoiceLine = {
  orderId: string;
  productName: string;
  qty: number;
  amount: number;
};

type InvoicePayload = {
  customerName: string;
  transactionId: string;
  lines: InvoiceLine[];
  totalAmount: number;
  addressText?: string;
};

const formatMoney = (value: number) => `NPR ${Number(value || 0).toLocaleString()}`;

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

// Lightweight PDF generator (no extra dependency requirement).
export function generateInvoicePdf(payload: InvoicePayload): Buffer {
  const rows = [
    "NITYAGRO INVOICE",
    `Customer: ${payload.customerName}`,
    `Transaction: ${payload.transactionId}`,
    "",
    ...payload.lines.map(
      (line) =>
        `#${line.orderId} - ${line.productName} x${line.qty} - ${formatMoney(line.amount)}`,
    ),
    "",
    `TOTAL: ${formatMoney(payload.totalAmount)}`,
    payload.addressText ? `Address: ${payload.addressText}` : "",
    "",
    `Generated: ${new Date().toISOString()}`,
  ].filter(Boolean);

  const content = [
    "BT",
    "/F1 11 Tf",
    "40 800 Td",
    ...rows.map((line, index) =>
      index === 0
        ? `(${escapePdfText(line)}) Tj`
        : `T* (${escapePdfText(line)}) Tj`,
    ),
    "ET",
  ].join("\n");

  const objects: string[] = [];
  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
  objects.push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj");
  objects.push(
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj",
  );
  objects.push("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj");
  objects.push(
    `5 0 obj\n<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}\nendstream\nendobj`,
  );

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${obj}\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}

