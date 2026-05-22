import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import { buildOrderPlacedEmail } from "@/lib/orderEmail";
import { generateInvoicePdf } from "@/lib/invoicePdf";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function normalizeOrderStatus(value: string | null | undefined) {
  const v = String(value || "").toLowerCase().trim();
  if (!v || v === "placed" || v === "pending") return "processing";
  if (["processing", "shipped", "delivered", "cancelled", "returns"].includes(v)) {
    return v;
  }
  return "processing";
}

function normalizePaymentStatus(value: string | null | undefined) {
  const v = String(value || "").toLowerCase().trim();
  if (!v || v === "pending") return "unpaid";
  if (["unpaid", "paid", "partial", "refunded"].includes(v)) return v;
  return "unpaid";
}

function getProductDisplayName(product: {
  subGroupName?: string | null;
  productName?: string | null;
}) {
  const group = String(product?.subGroupName || "").trim();
  const variant = String(product?.productName || "").trim();
  if (group && variant && group.toLowerCase() !== variant.toLowerCase()) {
    return `${group} (${variant})`;
  }
  return group || variant || "N/A";
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdRaw = searchParams.get("userId") || "1";
    const status = String(searchParams.get("status") || "all").toLowerCase();
    const search = String(searchParams.get("search") || "").trim().toLowerCase();

    const userId = BigInt(userIdRaw);

    const orders = await prisma.orders.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            productCode: true,
            productName: true,
            subGroupName: true,
            pImage: true,
          },
        },
        paymentDetails: {
          orderBy: { paymentDetailsId: "desc" },
          take: 1,
          select: {
            paymentMode: true,
            transactionId: true,
            paymentStatus: true,
            paymentAmount: true,
            paymentDate: true,
          },
        },
        shippingDetails: {
          orderBy: { shippingDetailsId: "desc" },
          take: 1,
          select: {
            shippingStatus: true,
            shippingDate: true,
            shippingRemark: true,
            shippingCourier: true,
            trackingNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = orders.map((order) => {
      const orderStatus = normalizeOrderStatus(order.orderStatus);
      const payment = order.paymentDetails?.[0] || null;
      const shipping = order.shippingDetails?.[0] || null;
      return {
        id: order.orderId.toString(),
        orderNumber: `NG-${order.orderId.toString()}`,
        orderStatus,
        paymentStatus: normalizePaymentStatus(order.paymentStatus),
        totalAmount: Number(order.totalAmount || 0),
        createdAt: order.createdAt,
        paymentMethod: payment?.paymentMode || "COD",
        transactionId: payment?.transactionId || "",
        shipping: {
          status: shipping?.shippingStatus || "PENDING",
          shippingDate: shipping?.shippingDate || null,
          remark: shipping?.shippingRemark || "",
          courier: shipping?.shippingCourier || "",
          trackingNumber: shipping?.trackingNumber || "",
        },
        items: [
          {
            id: `${order.orderId}-1`,
            productCode: order.product?.productCode || "",
            name: getProductDisplayName(order.product || {}),
            image: order.product?.pImage || "/products/mustard-oil.png",
            qty: 1,
            unitPrice: Number(order.totalAmount || 0),
            subtotal: Number(order.totalAmount || 0),
          },
        ],
      };
    });

    const filtered = mapped.filter((order) => {
      if (status !== "all" && order.orderStatus !== status) return false;

      if (search) {
        const hay = [
          order.orderNumber,
          order.items[0]?.name,
          order.items[0]?.productCode,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(search)) return false;
      }

      return true;
    });

    return NextResponse.json(
      {
        success: true,
        data: filtered,
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch orders",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

type CheckoutItemInput = {
  id: number | string;
  qty?: number;
  unitPrice?: number;
  total?: number;
  name?: string;
};

type AddressInput = {
  fullName?: string;
  phone?: string;
  email?: string;
  region?: string;
  city?: string;
  area?: string;
  address?: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const paymentMethod = String(body?.paymentMethod || "").toLowerCase();
    const connectipsReferenceId = String(body?.connectipsReferenceId || "").trim();
    const items: CheckoutItemInput[] = Array.isArray(body?.items) ? body.items : [];
    const address: AddressInput | null = body?.address ?? null;
    const userId = Number(body?.userId ?? 1);

    if (paymentMethod !== "connectips") {
      return NextResponse.json(
        { success: false, message: "Unsupported payment method" },
        { status: 400, headers: corsHeaders },
      );
    }
    if (!connectipsReferenceId) {
      return NextResponse.json(
        { success: false, message: "Missing ConnectIPS reference id" },
        { status: 400, headers: corsHeaders },
      );
    }
    if (!items.length) {
      return NextResponse.json(
        { success: false, message: "No checkout items provided" },
        { status: 400, headers: corsHeaders },
      );
    }

    const normalizedItems = items
      .map((item) => ({
        productId: Number(item.id),
        qty: Math.max(1, Number(item.qty ?? 1)),
        unitPrice: Number(item.unitPrice ?? item.total ?? 0),
      }))
      .filter((item) => Number.isFinite(item.productId) && item.productId > 0);

    if (!normalizedItems.length) {
      return NextResponse.json(
        { success: false, message: "Invalid checkout item ids" },
        { status: 400, headers: corsHeaders },
      );
    }

    const productIds = normalizedItems.map((row) => BigInt(row.productId));
    const products = await prisma.products.findMany({
      where: { productId: { in: productIds } },
      select: {
        productId: true,
        productName: true,
        subGroupName: true,
        sellingPrice: true,
        productStatus: true,
      },
    });
    const productMap = new Map(products.map((p) => [p.productId.toString(), p]));
    if (products.length !== normalizedItems.length) {
      return NextResponse.json(
        { success: false, message: "Some products no longer exist" },
        { status: 400, headers: corsHeaders },
      );
    }

    const inactive = normalizedItems.filter((item) => {
      const p = productMap.get(String(item.productId));
      return !p?.productStatus;
    });
    if (inactive.length > 0) {
      return NextResponse.json(
        { success: false, message: "Some products are inactive" },
        { status: 400, headers: corsHeaders },
      );
    }

    const now = new Date();
    const created = await prisma.$transaction(async (tx) => {
      const createdOrders: { orderId: bigint; productId: bigint; totalAmount: number }[] = [];
      for (const row of normalizedItems) {
        const product = productMap.get(String(row.productId));
        const unitPrice = row.unitPrice > 0 ? row.unitPrice : Number(product?.sellingPrice || 0);
        const lineTotal = Number((unitPrice * row.qty).toFixed(2));

        const order = await tx.orders.create({
          data: {
            userId: BigInt(userId),
            productId: BigInt(row.productId),
            totalAmount: lineTotal,
            orderStatus: "PLACED",
            paymentStatus: "PAID",
          },
        });

        await tx.paymentDetails.create({
          data: {
            orderId: order.orderId,
            userId: BigInt(userId),
            paymentMode: "CONNECTIPS",
            paymentAmount: lineTotal,
            paymentDate: now,
            transactionId: connectipsReferenceId,
            paymentStatus: "PAID",
          },
        });

        const shippingDetails = await tx.shippingDetails.create({
          data: {
            orderId: order.orderId,
            productId: BigInt(row.productId),
            shippingStatus: "PENDING",
            shippingRemark: address
              ? [
                  address.fullName,
                  address.phone,
                  address.address,
                  address.city,
                  address.region,
                  address.area,
                ]
                  .filter(Boolean)
                  .join(" | ")
              : "",
          },
        });

        await tx.deliveryDetails.create({
          data: {
            orderId: order.orderId,
            shippingDetailsId: shippingDetails.shippingDetailsId,
            paymentMode: "CONNECTIPS",
            transactionId: connectipsReferenceId,
            deliveryStatus: "PENDING",
            deliveryRemark: "Order paid via ConnectIPS. Awaiting dispatch.",
          },
        });

        createdOrders.push({
          orderId: order.orderId,
          productId: order.productId,
          totalAmount: order.totalAmount,
        });
      }
      return createdOrders;
    });

    const grandTotal = created.reduce((sum, o) => sum + Number(o.totalAmount), 0);

    try {
      const user = await prisma.users.findUnique({
        where: { userId: BigInt(userId) },
        select: { name: true, email: true },
      });

      if (user?.email) {
        const orderRows = await prisma.orders.findMany({
          where: { orderId: { in: created.map((o) => o.orderId) } },
          include: { product: { select: { productName: true, subGroupName: true } } },
        });

        const lines = orderRows.map((row) => ({
          orderId: row.orderId.toString(),
          productName: row.product?.subGroupName || row.product?.productName || "Product",
          qty: 1,
          amount: Number(row.totalAmount || 0),
        }));

        const addressText = address
          ? [
              address.fullName,
              address.phone,
              address.address,
              address.city,
              address.region,
              address.area,
            ]
              .filter(Boolean)
              .join(", ")
          : "";

        const emailContent = buildOrderPlacedEmail({
          customerName: user.name || "Customer",
          transactionId: connectipsReferenceId,
          items: lines.map((line) => ({
            name: line.productName,
            qty: line.qty,
            amount: line.amount,
          })),
          totalAmount: grandTotal,
          addressText,
        });

        const invoicePdf = await generateInvoicePdf({
          customerName: user.name || "Customer",
          transactionId: connectipsReferenceId,
          lines,
          totalAmount: grandTotal,
          addressText,
        });

        await sendMail({
          to: user.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
          attachments: [
            {
              filename: `invoice-${connectipsReferenceId}.pdf`,
              content: invoicePdf,
              contentType: "application/pdf",
            },
          ],
        });
      }
    } catch (mailError) {
      console.error("ConnectIPS order email send failed:", mailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Paid order placed successfully",
        data: {
          orderIds: created.map((o) => o.orderId.toString()),
          transactionId: connectipsReferenceId,
          itemCount: created.length,
          grandTotal,
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to place paid order",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
