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
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

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
  address?: string;
  city?: string;
  region?: string;
  area?: string;
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

function getProductDisplayName(product: {
  subGroupName?: string | null;
  productName?: string | null;
}) {
  const group = String(product?.subGroupName || "").trim();
  const variant = String(product?.productName || "").trim();
  if (group && variant && group.toLowerCase() !== variant.toLowerCase()) {
    return `${group} (${variant})`;
  }
  return group || variant || "Product";
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    const body = await req.json();
    const items: CheckoutItemInput[] = Array.isArray(body?.items) ? body.items : [];
    const address: AddressInput | null = body?.address ?? null;
    const userId = Number(auth.sub);
    const deliveryCharge = Math.max(0, Number(body?.deliveryCharge || 0));

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

      const txCode = `COD-COMBO-${Date.now()}`;
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
          const lineDeliveryCharge = index === 0 ? deliveryCharge : 0;
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
              paymentStatus: "PENDING",
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
        paymentMode: "COD",
        paymentAmount: 0,
        deliveryCharge,
        customer: {
          name: address?.fullName,
          phone: address?.phone,
          memberCode: String(userId),
          userCode: String(userId),
        },
      }).catch((error) => console.error("OMS combo COD sync log failed:", error));

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
          const orderReference = lines.map((line) => line.orderId).join(", ");
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
            transactionId: orderReference,
            referenceLabel: "Order ID",
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
            transactionId: orderReference,
            referenceLabel: "Order ID",
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
                filename: `invoice-${txCode}.pdf`,
                content: invoicePdf,
                contentType: "application/pdf",
              },
            ],
          });
        }
      } catch (mailError) {
        console.error("Combo order email send failed:", mailError);
      }

      return NextResponse.json(
        {
          success: true,
          message: "Combo order placed successfully (Cash on Delivery)",
          data: {
            orderIds: created.map((order) => order.comboOrderId.toString()),
            transactionId: txCode,
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
        unitPrice: Number(item.unitPrice ?? 0),
      }))
      .filter((item) => Number.isFinite(item.productId) && item.productId > 0);

    if (!normalizedItems.length) {
      return NextResponse.json(
        { success: false, message: "Invalid checkout item ids" },
        { status: 400, headers: corsHeaders },
      );
    }

    const requestedProductIds = normalizedItems.map((item) => BigInt(item.productId));
    const directProducts = await prisma.products.findMany({
      where: { productId: { in: requestedProductIds } },
      select: {
        productId: true,
        productCode: true,
        productName: true,
        sellingPrice: true,
        actualPrice: true,
        productStatus: true,
        stockQuantity: true,
        availableQuantity: true,
      },
    });

    const directProductMap = new Map(
      directProducts.map((p) => [p.productId.toString(), p]),
    );

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
            where: {
              productCode: { in: fallbackProductCodes },
            },
            select: {
              productId: true,
              productCode: true,
              productName: true,
              sellingPrice: true,
              actualPrice: true,
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
        if (direct) {
          return {
            ...item,
            productId: Number(direct.productId),
            source: "product",
          };
        }

        const productCode = variantCodeByVariantId.get(String(item.productId));
        const fallbackProduct = productCode
          ? fallbackProductByCode.get(productCode)
          : null;

        if (!fallbackProduct) {
          return null;
        }

        return {
          ...item,
          productId: Number(fallbackProduct.productId),
          source: "variant",
        };
      })
      .filter(Boolean) as Array<{
      productId: number;
      qty: number;
      unitPrice: number;
      source: "product" | "variant";
    }>;

    if (resolvedItems.length !== normalizedItems.length) {
      return NextResponse.json(
        { success: false, message: "Some products/variants no longer exist" },
        { status: 400, headers: corsHeaders },
      );
    }

    const resolvedProductIds = resolvedItems.map((item) => BigInt(item.productId));
    const resolvedProducts = await prisma.products.findMany({
      where: { productId: { in: resolvedProductIds } },
      select: {
        productId: true,
        productCode: true,
        sellingPrice: true,
        productStatus: true,
        stockQuantity: true,
        availableQuantity: true,
      },
    });
    const resolvedProductMap = new Map(
      resolvedProducts.map((product) => [product.productId.toString(), product]),
    );
    const liveStockByCode = await refreshLocalStockFromOms(
      resolvedProducts.map((product) => product.productCode),
    ).catch((error) => {
      console.warn("Live OMS stock refresh before COD order failed", error);
      return new Map<string, number>();
    });
    const variantStocks = await prisma.productVariant.findMany({
      where: {
        pCode: {
          in: resolvedProducts.map((product) => product.productCode),
        },
      },
      select: {
        pCode: true,
        stockQuantity: true,
      },
    });
    const variantStockByCode = new Map(
      variantStocks.map((variant) => [variant.pCode, variant.stockQuantity]),
    );
    const getAvailableStock = (product: (typeof resolvedProducts)[number] | undefined) =>
      product?.productCode && liveStockByCode.has(product.productCode)
        ? Number(liveStockByCode.get(product.productCode) || 0)
        : Math.max(
            Number(product?.productCode ? variantStockByCode.get(product.productCode) ?? 0 : 0),
            Number(product?.availableQuantity ?? 0),
            Number(product?.stockQuantity ?? 0),
          );

    const inactive = resolvedItems.filter((item) => {
      const p = resolvedProductMap.get(String(item.productId));
      return !p?.productStatus;
    });
    if (inactive.length > 0) {
      return NextResponse.json(
        { success: false, message: "Some products are inactive" },
        { status: 400, headers: corsHeaders },
      );
    }

    const insufficientStock = resolvedItems.find((item) => {
      const product = resolvedProductMap.get(String(item.productId));
      const available = getAvailableStock(product);
      return available <= 0 || item.qty > available;
    });
    if (insufficientStock) {
      return NextResponse.json(
        { success: false, message: "Selected quantity is not available in stock" },
        { status: 400, headers: corsHeaders },
      );
    }

    const txCode = `COD-${Date.now()}`;
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
        const product = resolvedProductMap.get(String(row.productId));
        const unitPrice = row.unitPrice > 0 ? row.unitPrice : Number(product?.sellingPrice ?? 0);
        const available = getAvailableStock(product);
        const remainingStock = Math.max(0, available - row.qty);
        const lineTotal = Number((unitPrice * row.qty).toFixed(2));
        const lineDeliveryCharge = index === 0 ? deliveryCharge : 0;
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
            paymentStatus: "PENDING",
          },
        });

        await tx.paymentDetails.create({
          data: {
            orderId: order.orderId,
            userId: BigInt(userId),
            paymentMode: "COD",
            paymentAmount: lineGrandTotal,
            paymentDate: now,
            transactionId: txCode,
            paymentStatus: "PENDING",
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
            paymentMode: "COD",
            transactionId: txCode,
            deliveryStatus: "PENDING",
            deliveryRemark: "Order placed. Awaiting dispatch.",
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
        const product = resolvedProductMap.get(String(row.productId));
        const unitPrice = row.unitPrice > 0 ? row.unitPrice : Number(product?.sellingPrice ?? 0);
        return {
          itemCode: product?.productCode || String(row.productId),
          qty: row.qty,
          rate: unitPrice,
          totalAmt: unitPrice * row.qty,
        };
      }),
      paymentMode: "COD",
      paymentAmount: 0,
      deliveryCharge,
      customer: {
        name: address?.fullName,
        phone: address?.phone,
        memberCode: String(userId),
        userCode: String(userId),
      },
    }).catch((error) => console.error("OMS COD sync log failed:", error));

    // Send invoice email without breaking order placement on mail failure.
    try {
      const user = await prisma.users.findUnique({
        where: { userId: BigInt(userId) },
        select: { name: true, email: true },
      });

      if (user?.email) {
        const orderRows = await prisma.orders.findMany({
          where: { orderId: { in: created.map((o) => o.orderId) } },
          include: {
            product: { select: { productName: true, subGroupName: true } },
          },
        });

        const lines = orderRows.map((row) => ({
          orderId: row.orderId.toString(),
          productName: getProductDisplayName(row.product),
          qty: Number(row.quantity || 1),
          amount: Number(row.productTotal || row.totalAmount || 0),
        }));
        const orderReference = lines.map((line) => `NG-${line.orderId}`).join(", ");
        const subtotalAmount = orderRows.reduce(
          (sum, row) => sum + Number(row.productTotal || 0),
          0,
        );
        const totalDeliveryCharge = orderRows.reduce(
          (sum, row) => sum + Number(row.deliveryCharge || 0),
          0,
        );

        const emailContent = buildOrderPlacedEmail({
          customerName: user.name || "Customer",
          transactionId: orderReference,
          referenceLabel: "Order ID",
          items: lines.map((line) => ({
            name: line.productName,
            qty: line.qty,
            amount: line.amount,
          })),
          subtotalAmount,
          discountAmount: 0,
          deliveryCharge: totalDeliveryCharge,
          totalAmount: grandTotal,
          addressText: address
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
            : "",
        });

        const invoicePdf = await generateInvoicePdf({
          customerName: user.name || "Customer",
          transactionId: orderReference,
          referenceLabel: "Order ID",
          lines: lines.map((line) => ({
            orderId: line.orderId,
            productName: line.productName,
            qty: line.qty,
            amount: line.amount,
          })),
          subtotalAmount,
          discountAmount: 0,
          deliveryCharge: totalDeliveryCharge,
          totalAmount: grandTotal,
          addressText: address
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
            : "",
        });

        await sendMail({
          to: user.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
          attachments: [
            {
              filename: `invoice-${txCode}.pdf`,
              content: invoicePdf,
              contentType: "application/pdf",
            },
          ],
        });
      }
    } catch (mailError) {
      console.error("Order email send failed:", mailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully (Cash on Delivery)",
        data: {
          orderIds: created.map((o) => o.orderId.toString()),
          transactionId: txCode,
          itemCount: created.length,
          grandTotal,
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Order placement failed";
    return NextResponse.json(
      {
        success: false,
        message: message === "UNAUTHORIZED" ? "Please login before placing order" : message,
      },
      { status: message === "UNAUTHORIZED" ? 401 : 500, headers: corsHeaders },
    );
  }
}
