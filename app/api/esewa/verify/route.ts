export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const transaction_uuid = searchParams.get("transaction_uuid");
  const total_amount = searchParams.get("total_amount");

  const url = "https://rc.esewa.com.np/api/epay/transaction/status/";
  //    real
  //   const url = "https://epay.esewa.com.np/api/epay/transaction/status/";

  const params = new URLSearchParams({
    product_code: process.env.ESEWA_MERCHANT_CODE || "EPAYTEST",
    total_amount: total_amount!,
    transaction_uuid: transaction_uuid!,
  });

  const res = await fetch(`${url}?${params.toString()}`);
  const data = await res.json();

  return Response.json(data);
}
