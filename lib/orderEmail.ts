type EmailOrderItem = {
  name: string;
  qty: number;
  amount: number;
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
  orderStatus: string;
  paymentStatus: string;
  amount: number;
};

const currency = (value: number) => `NPR ${Number(value || 0).toLocaleString()}`;

const baseHtml = (content: string) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nityagro</title>
  </head>
  <body style="margin:0;padding:20px;background:#f5f6f8;font-family:Arial,sans-serif;color:#1f2937;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr>
        <td style="padding:18px 24px;background:#00462C;color:#fff;">
          <h2 style="margin:0;font-size:20px;">Nityagro</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;">${content}</td>
      </tr>
      <tr>
        <td style="padding:14px 24px;background:#f9fafb;color:#6b7280;font-size:12px;">
          © ${new Date().getFullYear()} Nityagro · Kathmandu, Nepal
        </td>
      </tr>
    </table>
  </body>
</html>`;

export function buildOrderPlacedEmail(input: OrderPlacedEmailInput) {
  const itemsHtml = input.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;">${item.name}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.qty}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:right;">${currency(item.amount)}</td>
      </tr>`,
    )
    .join("");

  const html = baseHtml(`
    <h3 style="margin:0 0 8px;">Order Confirmed</h3>
    <p style="margin:0 0 14px;">Hello ${input.customerName}, your order has been placed successfully.</p>
    <p style="margin:0 0 16px;"><strong>Transaction:</strong> ${input.transactionId}</p>

    <h4 style="margin:0 0 8px;color:#00462C;">Invoice</h4>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="text-align:left;padding:10px 8px;">Item</th>
          <th style="text-align:center;padding:10px 8px;">Qty</th>
          <th style="text-align:right;padding:10px 8px;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <p style="margin:16px 0 4px;text-align:right;"><strong>Total: ${currency(input.totalAmount)}</strong></p>
    ${
      input.addressText
        ? `<p style="margin:10px 0 0;"><strong>Shipping Address:</strong> ${input.addressText}</p>`
        : ""
    }
  `);

  return {
    subject: `Order Invoice - ${input.transactionId}`,
    html,
    text: `Order confirmed. Transaction ${input.transactionId}. Total ${currency(input.totalAmount)}`,
  };
}

export function buildOrderStatusEmail(input: OrderStatusEmailInput) {
  const html = baseHtml(`
    <h3 style="margin:0 0 8px;">Order Update</h3>
    <p style="margin:0 0 12px;">Hello ${input.customerName},</p>
    <p style="margin:0 0 8px;">Your order <strong>#${input.orderId}</strong> for <strong>${input.productName}</strong> has been updated.</p>
    <p style="margin:0 0 8px;"><strong>Order Status:</strong> ${String(input.orderStatus).toUpperCase()}</p>
    <p style="margin:0 0 8px;"><strong>Payment Status:</strong> ${String(input.paymentStatus).toUpperCase()}</p>
    <p style="margin:0;"><strong>Amount:</strong> ${currency(input.amount)}</p>
  `);

  return {
    subject: `Order #${input.orderId} update`,
    html,
    text: `Order #${input.orderId} status: ${input.orderStatus}, payment: ${input.paymentStatus}`,
  };
}

