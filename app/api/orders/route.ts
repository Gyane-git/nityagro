import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import { buildOrderPlacedEmail } from "@/lib/orderEmail";
import { generateInvoicePdf } from "@/lib/invoicePdf";
import { syncOmsOrderSafely } from "@/lib/omsOrderSync";
import { requireAuth } from "@/lib/auth";
import { refreshLocalStockFromOms } from "@/lib/omsStock";
import {
  decrementComboItemsStock,
  getComboAvailability,
  resolveComboItems,
} from "@/lib/comboItems";

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

function getOrderAmounts(order: {
  quantity?: bigint | number | null;
  unitPrice?: number | null;
  productTotal?: number | null;
  deliveryCharge?: number | null;
  totalAmount?: number | null;
  product?: { sellingPrice?: number | null } | null;
}) {
  const qty = Math.max(1, Number(order.quantity || 1));
  const unitPrice =
    Number(order.unitPrice || 0) > 0
      ? Number(order.unitPrice)
      : Number(order.product?.sellingPrice || 0) > 0
        ? Number(order.product?.sellingPrice)
        : Number(order.totalAmount || 0) / qty;
  const productTotal =
    Number(order.productTotal || 0) > 0
      ? Number(order.productTotal)
      : Number((unitPrice * qty).toFixed(2));
  const deliveryCharge =
    Number(order.deliveryCharge || 0) > 0
      ? Number(order.deliveryCharge)
      : Math.max(0, Number(order.totalAmount || 0) - productTotal);
  const totalAmount =
    Number(order.totalAmount || 0) > 0
      ? Number(order.totalAmount)
      : Number((productTotal + deliveryCharge).toFixed(2));

  return { qty, unitPrice, productTotal, deliveryCharge, totalAmount };
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
            sellingPrice: true,
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
      const amounts = getOrderAmounts(order);
      return {
        id: order.orderId.toString(),
        orderNumber: `NG-${order.orderId.toString()}`,
        orderStatus,
        paymentStatus: normalizePaymentStatus(order.paymentStatus),
        totalAmount: amounts.totalAmount,
        subtotal: amounts.productTotal,
        shippingCost: amounts.deliveryCharge,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
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
            productId: order.productId.toString(),
            productCode: order.product?.productCode || "",
            name: getProductDisplayName(order.product || {}),
            image: order.product?.pImage || "/products/mustard-oil.png",
            qty: amounts.qty,
            unitPrice: amounts.unitPrice,
            subtotal: amounts.productTotal,
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
  type?: string;
  comboProductId?: number | string;
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

function hasShippingAddress(address: AddressInput | null) {
  if (!address) return false;
  return Boolean(
    String(address.fullName || "").trim() &&
      String(address.phone || "").trim() &&
      String(address.city || "").trim() &&
      String(address.region || "").trim(),
  );
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    const body = await req.json();
    const paymentMethod = String(body?.paymentMethod || "").toLowerCase();
    const connectipsReferenceId = String(body?.connectipsReferenceId || "").trim();
    const items: CheckoutItemInput[] = Array.isArray(body?.items) ? body.items : [];
    const address: AddressInput | null = body?.address ?? null;
    const userId = Number(auth.sub);
    const paidTotalAmount = Math.max(0, Number(body?.totalAmount || 0));

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

    if (!hasShippingAddress(address)) {
      return NextResponse.json(
        { success: false, message: "Please set shipping address before placing order" },
        { status: 400, headers: corsHeaders },
      );
    }

    const isComboCheckout = items.every(
      (item) =>
        String(item?.type || "").toLowerCase() === "combo" &&
        Number(item?.comboProductId || item?.id || 0) > 0,
    );

    if (isComboCheckout) {
      const normalizedComboItems = items
        .map((item) => ({
          comboProductId: Number(item.comboProductId || item.id),
          qty: Math.max(1, Number(item.qty ?? 1)),
          unitPrice: Number(item.unitPrice ?? item.total ?? 0),
        }))
        .filter(
          (item) =>
            Number.isFinite(item.comboProductId) && item.comboProductId > 0,
        );

      if (normalizedComboItems.length !== items.length) {
        return NextResponse.json(
          { success: false, message: "Invalid combo checkout item ids" },
          { status: 400, headers: corsHeaders },
        );
      }

      const combos = await prisma.comboProduct.findMany({
        where: {
          comboProductId: {
            in: normalizedComboItems.map((item) => BigInt(item.comboProductId)),
          },
          comboStatus: true,
        },
        select: {
          comboProductId: true,
          comboName: true,
          comboPrice: true,
          productCodes: true,
        },
      });
      const comboMap = new Map(
        combos.map((combo) => [combo.comboProductId.toString(), combo]),
      );

      if (combos.length !== normalizedComboItems.length) {
        return NextResponse.json(
          { success: false, message: "Some combo products are not available" },
          { status: 400, headers: corsHeaders },
        );
      }

      const comboStockChecks = await Promise.all(
        normalizedComboItems.map(async (row) => {
          const combo = comboMap.get(String(row.comboProductId));
          const comboItems = await resolveComboItems(prisma, combo?.productCodes || "");
          return {
            row,
            combo,
            comboItems,
            availability: getComboAvailability(comboItems, row.qty),
          };
        }),
      );
      const unavailableCombo = comboStockChecks.find(
        (check) => check.availability.comboOutOfStock,
      );
      if (unavailableCombo) {
        const itemNames = unavailableCombo.availability.outOfStockItems
          .map((item: any) => item.name)
          .filter(Boolean)
          .join(", ");
        return NextResponse.json(
          {
            success: false,
            message: itemNames
              ? `Combo is out of stock. Unavailable item(s): ${itemNames}`
              : "Combo is out of stock",
          },
          { status: 400, headers: corsHeaders },
        );
      }

      const calculatedItemTotal = normalizedComboItems.reduce((sum, row) => {
        const combo = comboMap.get(String(row.comboProductId));
        const unitPrice =
          row.unitPrice > 0 ? row.unitPrice : Number(combo?.comboPrice || 0);
        return sum + unitPrice * row.qty;
      }, 0);
      const deliveryDifference = Math.max(
        0,
        Number((paidTotalAmount - calculatedItemTotal).toFixed(2)),
      );

      const created = await prisma.$transaction(async (tx) => {
        const createdOrders: {
          comboOrderId: bigint;
          comboProductId: bigint;
          quantity: bigint;
          productTotal: number;
          deliveryCharge: number;
          totalAmount: number;
        }[] = [];

        for (const [index, row] of normalizedComboItems.entries()) {
          const combo = comboMap.get(String(row.comboProductId));
          const stockCheck = comboStockChecks.find(
            (check) =>
              Number(check.row.comboProductId) === Number(row.comboProductId),
          );
          const unitPrice =
            row.unitPrice > 0 ? row.unitPrice : Number(combo?.comboPrice || 0);
          const lineTotal = Number((unitPrice * row.qty).toFixed(2));
          const lineDeliveryCharge = index === 0 ? deliveryDifference : 0;
          const lineGrandTotal = Number(
            (lineTotal + lineDeliveryCharge).toFixed(2),
          );

          const order = await tx.comboOrders.create({
            data: {
              userId: BigInt(userId),
              comboProductId: BigInt(row.comboProductId),
              quantity: BigInt(row.qty),
              unitPrice,
              productTotal: lineTotal,
              deliveryCharge: lineDeliveryCharge,
              totalAmount: lineGrandTotal,
              orderStatus: "PLACED",
              paymentStatus: "PAID",
            },
          });

          await decrementComboItemsStock(tx, stockCheck?.comboItems || [], row.qty);

          createdOrders.push({
            comboOrderId: order.comboOrderId,
            comboProductId: order.comboProductId,
            quantity: order.quantity,
            productTotal: order.productTotal,
            deliveryCharge: order.deliveryCharge,
            totalAmount: order.totalAmount,
          });
        }

        return createdOrders;
      });

      const grandTotal = created.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0,
      );

      await syncOmsOrderSafely({
        prisma,
        orderType: "COMBO_ORDER",
        localOrderIds: created.map((order) => order.comboOrderId),
        items: (
          await Promise.all(
            normalizedComboItems.map(async (row) => {
              const combo = comboMap.get(String(row.comboProductId));
              const comboItems = await resolveComboItems(prisma, combo?.productCodes || "");
              return comboItems.map((item) => ({
                itemCode: item.code,
                qty: row.qty,
                rate: Number(item.price || 0),
                totalAmt: Number(item.price || 0) * row.qty,
              }));
            }),
          )
        ).flat(),
        paymentMode: "connectips",
        paymentAmount: grandTotal,
        deliveryCharge: deliveryDifference,
        customer: {
          name: address?.fullName,
          phone: address?.phone,
          memberCode: String(userId),
          userCode: String(userId),
        },
      }).catch((error) => console.error("OMS combo ConnectIPS sync log failed:", error));

      try {
        const user = await prisma.users.findUnique({
          where: { userId: BigInt(userId) },
          select: { name: true, email: true },
        });

        if (user?.email) {
          const lines = created.map((row) => {
            const combo = comboMap.get(String(row.comboProductId));
            return {
              orderId: `NC-${row.comboOrderId.toString()}`,
              productName: combo?.comboName || "Combo Product",
              qty: Number(row.quantity || 1),
              amount: Number(row.productTotal || row.totalAmount || 0),
            };
          });
          const subtotalAmount = lines.reduce((sum, line) => sum + line.amount, 0);
          const totalDeliveryCharge = created.reduce(
            (sum, row) => sum + Number(row.deliveryCharge || 0),
            0,
          );
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
            subtotalAmount,
            discountAmount: 0,
            deliveryCharge: totalDeliveryCharge,
            totalAmount: grandTotal,
            addressText,
          });
          const invoicePdf = await generateInvoicePdf({
            customerName: user.name || "Customer",
            transactionId: connectipsReferenceId,
            lines,
            subtotalAmount,
            discountAmount: 0,
            deliveryCharge: totalDeliveryCharge,
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
        console.error("ConnectIPS combo order email send failed:", mailError);
      }

      return NextResponse.json(
        {
          success: true,
          message: "Paid combo order placed successfully",
          data: {
            orderIds: created.map((order) => order.comboOrderId.toString()),
            transactionId: connectipsReferenceId,
            itemCount: created.length,
            grandTotal,
            orderType: "combo",
          },
        },
        { status: 200, headers: corsHeaders },
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

    const requestedProductIds = normalizedItems.map((row) => BigInt(row.productId));
    const directProducts = await prisma.products.findMany({
      where: { productId: { in: requestedProductIds } },
      select: {
        productId: true,
        productCode: true,
        productName: true,
        subGroupName: true,
        sellingPrice: true,
        productStatus: true,
        stockQuantity: true,
        availableQuantity: true,
      },
    });
    const directProductMap = new Map(directProducts.map((p) => [p.productId.toString(), p]));
    const unresolved = normalizedItems.filter(
      (item) => !directProductMap.has(String(item.productId)),
    );
    const variantRows =
      unresolved.length > 0
        ? await prisma.productVariant.findMany({
            where: {
              variantId: {
                in: unresolved.map((item) => BigInt(item.productId)),
              },
            },
            select: {
              variantId: true,
              pCode: true,
            },
          })
        : [];
    const variantCodeByVariantId = new Map(
      variantRows.map((row) => [row.variantId.toString(), row.pCode]),
    );
    const fallbackProductCodes = Array.from(
      new Set(
        unresolved
          .map((item) => variantCodeByVariantId.get(String(item.productId)))
          .filter((code): code is string => Boolean(code)),
      ),
    );
    const fallbackProducts =
      fallbackProductCodes.length > 0
        ? await prisma.products.findMany({
            where: { productCode: { in: fallbackProductCodes } },
            select: {
              productId: true,
              productCode: true,
              productName: true,
              subGroupName: true,
              sellingPrice: true,
              productStatus: true,
              stockQuantity: true,
              availableQuantity: true,
            },
          })
        : [];
    const fallbackProductByCode = new Map(
      fallbackProducts.map((product) => [product.productCode, product]),
    );
    const resolvedItems = normalizedItems
      .map((item) => {
        const direct = directProductMap.get(String(item.productId));
        if (direct) return { ...item, productId: Number(direct.productId) };

        const productCode = variantCodeByVariantId.get(String(item.productId));
        const fallbackProduct = productCode ? fallbackProductByCode.get(productCode) : null;
        if (!fallbackProduct) return null;
        return { ...item, productId: Number(fallbackProduct.productId) };
      })
      .filter(Boolean) as Array<{ productId: number; qty: number; unitPrice: number }>;

    if (resolvedItems.length !== normalizedItems.length) {
      return NextResponse.json(
        { success: false, message: "Some products/variants no longer exist" },
        { status: 400, headers: corsHeaders },
      );
    }

    const productIds = resolvedItems.map((row) => BigInt(row.productId));
    const products = await prisma.products.findMany({
      where: { productId: { in: productIds } },
      select: {
        productId: true,
        productCode: true,
        productName: true,
        subGroupName: true,
        sellingPrice: true,
        productStatus: true,
        stockQuantity: true,
        availableQuantity: true,
      },
    });
    const productMap = new Map(products.map((p) => [p.productId.toString(), p]));
    const liveStockByCode = await refreshLocalStockFromOms(
      products.map((product) => product.productCode),
    ).catch((error) => {
      console.warn("Live OMS stock refresh before paid order failed", error);
      return new Map<string, number>();
    });
    const variantStocks = await prisma.productVariant.findMany({
      where: { pCode: { in: products.map((product) => product.productCode) } },
      select: { pCode: true, stockQuantity: true },
    });
    const variantStockByCode = new Map(
      variantStocks.map((variant) => [variant.pCode, variant.stockQuantity]),
    );
    const getAvailableStock = (product: (typeof products)[number] | undefined) =>
      product?.productCode && liveStockByCode.has(product.productCode)
        ? Number(liveStockByCode.get(product.productCode) || 0)
        : Math.max(
            Number(product?.productCode ? variantStockByCode.get(product.productCode) ?? 0 : 0),
            Number(product?.availableQuantity ?? 0),
            Number(product?.stockQuantity ?? 0),
          );

    const inactive = resolvedItems.filter((item) => {
      const p = productMap.get(String(item.productId));
      return !p?.productStatus;
    });
    if (inactive.length > 0) {
      return NextResponse.json(
        { success: false, message: "Some products are inactive" },
        { status: 400, headers: corsHeaders },
      );
    }

    const insufficientStock = resolvedItems.find((item) => {
      const product = productMap.get(String(item.productId));
      const available = getAvailableStock(product);
      return available <= 0 || item.qty > available;
    });
    if (insufficientStock) {
      return NextResponse.json(
        { success: false, message: "Selected quantity is not available in stock" },
        { status: 400, headers: corsHeaders },
      );
    }

    const calculatedItemTotal = resolvedItems.reduce((sum, row) => {
      const product = productMap.get(String(row.productId));
      const unitPrice = row.unitPrice > 0 ? row.unitPrice : Number(product?.sellingPrice || 0);
      return sum + unitPrice * row.qty;
    }, 0);
    const deliveryDifference = Math.max(
      0,
      Number((paidTotalAmount - calculatedItemTotal).toFixed(2)),
    );

    const now = new Date();
    const created = await prisma.$transaction(async (tx) => {
      const createdOrders: {
        orderId: bigint;
        productId: bigint;
        quantity: bigint;
        productTotal: number;
        deliveryCharge: number;
        totalAmount: number;
      }[] = [];
      for (const [index, row] of resolvedItems.entries()) {
        const product = productMap.get(String(row.productId));
        const unitPrice = row.unitPrice > 0 ? row.unitPrice : Number(product?.sellingPrice || 0);
        const available = getAvailableStock(product);
        const remainingStock = Math.max(0, available - row.qty);
        const lineTotal = Number((unitPrice * row.qty).toFixed(2));
        const lineDeliveryCharge = index === 0 ? deliveryDifference : 0;
        const lineGrandTotal = Number((lineTotal + lineDeliveryCharge).toFixed(2));

        const order = await tx.orders.create({
          data: {
            userId: BigInt(userId),
            productId: BigInt(row.productId),
            quantity: BigInt(row.qty),
            unitPrice,
            productTotal: lineTotal,
            deliveryCharge: lineDeliveryCharge,
            totalAmount: lineGrandTotal,
            orderStatus: "PLACED",
            paymentStatus: "PAID",
          },
        });

        await tx.paymentDetails.create({
          data: {
            orderId: order.orderId,
            userId: BigInt(userId),
            paymentMode: "CONNECTIPS",
            paymentAmount: lineGrandTotal,
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

        await tx.products.update({
          where: { productId: BigInt(row.productId) },
          data: {
            stockQuantity: BigInt(remainingStock),
            availableQuantity: BigInt(remainingStock),
          },
        });

        if (product?.productCode) {
          await tx.productVariant.updateMany({
            where: { pCode: product.productCode },
            data: { stockQuantity: BigInt(remainingStock) },
          });
        }

        createdOrders.push({
          orderId: order.orderId,
          productId: order.productId,
          quantity: order.quantity,
          productTotal: order.productTotal,
          deliveryCharge: order.deliveryCharge,
          totalAmount: order.totalAmount,
        });
      }
      return createdOrders;
    });

    const grandTotal = created.reduce((sum, o) => sum + Number(o.totalAmount), 0);

    await syncOmsOrderSafely({
      prisma,
      orderType: "ORDER",
      localOrderIds: created.map((order) => order.orderId),
      items: resolvedItems.map((row) => {
        const product = productMap.get(String(row.productId));
        const unitPrice = row.unitPrice > 0 ? row.unitPrice : Number(product?.sellingPrice || 0);
        return {
          itemCode: product?.productCode || String(row.productId),
          qty: row.qty,
          rate: unitPrice,
          totalAmt: unitPrice * row.qty,
        };
      }),
      paymentMode: "connectips",
      paymentAmount: grandTotal,
      deliveryCharge: deliveryDifference,
      customer: {
        name: address?.fullName,
        phone: address?.phone,
        memberCode: String(userId),
        userCode: String(userId),
      },
    }).catch((error) => console.error("OMS ConnectIPS sync log failed:", error));

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
          productName: getProductDisplayName(row.product),
          qty: Number(row.quantity || 1),
          amount: Number(row.productTotal || row.totalAmount || 0),
        }));
        const subtotalAmount = orderRows.reduce(
          (sum, row) => sum + Number(row.productTotal || 0),
          0,
        );
        const totalDeliveryCharge = orderRows.reduce(
          (sum, row) => sum + Number(row.deliveryCharge || 0),
          0,
        );

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
          subtotalAmount,
          discountAmount: 0,
          deliveryCharge: totalDeliveryCharge,
          totalAmount: grandTotal,
          addressText,
        });

        const invoicePdf = await generateInvoicePdf({
          customerName: user.name || "Customer",
          transactionId: connectipsReferenceId,
          lines,
          subtotalAmount,
          discountAmount: 0,
          deliveryCharge: totalDeliveryCharge,
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
    const message = error instanceof Error ? error.message : "Failed to place paid order";
    return NextResponse.json(
      {
        success: false,
        message: message === "UNAUTHORIZED" ? "Please login before placing order" : message,
      },
      { status: message === "UNAUTHORIZED" ? 401 : 500, headers: corsHeaders },
    );
  }
}
