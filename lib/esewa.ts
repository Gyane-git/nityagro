import CryptoJS from "crypto-js";

export function generateSignature(
  total_amount: string,
  transaction_uuid: string,
  product_code: string,
) {
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  const hash = CryptoJS.HmacSHA256(message, process.env.ESEWA_SECRET_KEY!);

  return CryptoJS.enc.Base64.stringify(hash);
}
