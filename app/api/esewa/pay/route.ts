// import { v4 as uuidv4 } from "uuid";
// import CryptoJS from "crypto-js";
// // import { db } from "@/lib/db"; // your prisma/db import

// export async function POST(req: Request) {
//   const { orderId } = await req.json();

//   // REAL ORDER FROM DB
//   const order = await db.order.findUnique({
//     where: { id: orderId },
//   });

//   if (!order) {
//     return Response.json({ error: "Order not found" }, { status: 404 });
//   }

//   const product_code = process.env.ESEWA_MERCHANT_CODE!;
//   const secret = process.env.ESEWA_SECRET_KEY!;

//   const transaction_uuid = `${order.id}-${uuidv4()}`;
//   const total_amount = order.total.toString();

//   const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

//   const hash = CryptoJS.HmacSHA256(message, secret);
//   const signature = CryptoJS.enc.Base64.stringify(hash);

//   return Response.json({
//     amount: total_amount,
//     tax_amount: "0",
//     total_amount,

//     transaction_uuid,
//     product_code,

//     product_service_charge: "0",
//     product_delivery_charge: "0",

//     success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
//     failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,

//     signed_field_names: "total_amount,transaction_uuid,product_code",
//     signature,
//   });
// }

import { createHmac, randomUUID } from "node:crypto";
// import { prisma } from "@/lib/prisma"; // enable when DB ready

export async function POST(req: Request) {
  const { orderId } = await req.json();

  // Replace with DB
  const order = {
    id: orderId,
    total: 1,
  };

  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  const product_code = process.env.ESEWA_MERCHANT_CODE!;
  const secret = process.env.ESEWA_SECRET_KEY!;

  const transaction_uuid = `${order.id}-${randomUUID()}`;
  const total_amount = order.total.toString();

  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const signature = createHmac("sha256", secret)
    .update(message)
    .digest("base64");

  return Response.json({
    amount: total_amount,
    tax_amount: "0",
    total_amount,

    transaction_uuid,
    product_code,

    product_service_charge: "0",
    product_delivery_charge: "0",

    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,

    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,
  });
}
