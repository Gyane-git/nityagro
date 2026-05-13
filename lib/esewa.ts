import { createHmac } from "node:crypto";

export function generateSignature(
  total_amount: string,
  transaction_uuid: string,
  product_code: string,
) {
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  return createHmac("sha256", process.env.ESEWA_SECRET_KEY || "")
    .update(message)
    .digest("base64");
}
