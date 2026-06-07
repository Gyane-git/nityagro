import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

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

function normalizeOrderStatus(value: string | null | undefined) {
  const status = String(value || "").toLowerCase().trim();
  if (!status || status === "placed" || status === "pending") return "processing";
  if (["processing", "shipped", "delivered", "cancelled", "returns"].includes(status)) {
    return status;
  }
  return status;
}

function getReturnStatus(item: {
  returnStatus: boolean;
  orders?: {
    shippingDetails?: Array<{ shippingStatus: string | null }>;
    paymentDetails?: Array<{ paymentStatus: string | null }>;
  } | null;
}) {
  const latestPayment = item.orders?.paymentDetails?.[0];
  if (String(latestPayment?.paymentStatus || "").toUpperCase() === "REFUNDED") {
    return "refunded";
  }

  if (!item.returnStatus) return "cancelled";

  const latestShipping = item.orders?.shippingDetails?.[0];
  if (String(latestShipping?.shippingStatus || "").toUpperCase() === "RETURN_SHIPPED") {
    return "shipped";
  }

  return "new";
}

function mapReturn(item: any) {
  const quantity = Number(item.orders?.quantity || 1);

  return {
    id: item.orderReturnId.toString(),
    orderReturnId: item.orderReturnId.toString(),
    reason: item.reason || "",
    returnImage: item.returnImage || "",
    status: getReturnStatus(item),
    quantity,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    productCode: item.product?.productCode || "",
    user: {
      id: item.userId.toString(),
      fullName: item.users?.name || "N/A",
      email: item.users?.email || "",
      phone: item.users?.phone || "",
    },
    order: {
      id: item.orderId.toString(),
      orderNumber: `NG-${item.orderId.toString()}`,
      orderStatus: normalizeOrderStatus(item.orders?.orderStatus),
      paymentStatus: item.orders?.paymentStatus || "",
      totalAmount: Number(item.orders?.totalAmount || 0),
      createdAt: item.orders?.createdAt || null,
    },
    cancellation: item.orders?.orderCancellation?.[0]
      ? {
          id: item.orders.orderCancellation[0].orderCancellationId.toString(),
          reason: item.orders.orderCancellation[0].cancellationReason || "",
          adminReason: item.orders.orderCancellation[0].adminCancellationReason || "",
          status: Boolean(item.orders.orderCancellation[0].cancellationStatus),
          createdAt: item.orders.orderCancellation[0].createdAt,
          updatedAt: item.orders.orderCancellation[0].updatedAt,
        }
      : null,
    shipment: item.orders?.shippingDetails?.[0]
      ? {
          courierName: item.orders.shippingDetails[0].shippingCourier || "",
          cnNumber: item.orders.shippingDetails[0].trackingNumber || "",
          cnDate: item.orders.shippingDetails[0].shippingDate || null,
          remark: item.orders.shippingDetails[0].shippingRemark || "",
          status: item.orders.shippingDetails[0].shippingStatus || "",
          updatedAt: item.orders.shippingDetails[0].updatedAt,
        }
      : null,
    refund: item.orders?.paymentDetails?.[0] &&
      String(item.orders.paymentDetails[0].paymentStatus || "").toUpperCase() === "REFUNDED"
        ? {
            mode: item.orders.paymentDetails[0].paymentMode || "",
            amount: Number(item.orders.paymentDetails[0].paymentAmount || 0),
            transactionId: item.orders.paymentDetails[0].transactionId || "",
            status: item.orders.paymentDetails[0].paymentStatus || "",
            paymentDate: item.orders.paymentDetails[0].paymentDate || null,
            updatedAt: item.orders.paymentDetails[0].updatedAt,
          }
        : null,
    product: {
      id: item.productId.toString(),
      code: item.product?.productCode || "",
      name: getProductDisplayName(item.product || {}),
      image: item.product?.pImage || "/no-image.png",
      price: Number(item.product?.sellingPrice || 0),
    },
  };
}

function getComboReturnStatus(item: any) {
  const orderStatus = String(item.orderStatus || "").toLowerCase();
  if (!item.returnStatus) return "cancelled";
  if (orderStatus === "shipped") return "shipped";
  if (String(item.paymentStatus || "").toUpperCase() === "REFUNDED") return "refunded";
  return "new";
}

async function fetchComboReturns() {
  try {
    return await prisma.$queryRaw`
      SELECT
        cor.comboOrderReturnId,
        cor.comboOrderId,
        cor.userId,
        cor.comboProductId,
        cor.comboName,
        cor.comboItems,
        cor.reason,
        cor.returnImage,
        cor.returnStatus,
        cor.createdAt,
        cor.updatedAt,
        co.quantity,
        co.orderStatus,
        co.paymentStatus,
        co.totalAmount,
        co.createdAt AS orderCreatedAt,
        u.name AS userName,
        u.email AS userEmail,
        u.phone AS userPhone,
        cp.comboCode,
        cp.comboName AS comboProductName,
        cp.comboPrice,
        (
          SELECT pi.imageUrl
          FROM productImage pi
          WHERE pi.comboProductId = cor.comboProductId
          ORDER BY pi.isMain DESC, pi.createdAt ASC
          LIMIT 1
        ) AS image
      FROM comboOrderReturn cor
      LEFT JOIN comboOrders co ON co.comboOrderId = cor.comboOrderId
      LEFT JOIN users u ON u.userId = cor.userId
      LEFT JOIN comboProduct cp ON cp.comboProductId = cor.comboProductId
      ORDER BY cor.createdAt DESC
    `;
  } catch (error) {
    console.warn("Admin combo return list unavailable", error);
    return [];
  }
}

function mapComboReturn(item: any) {
  const status = getComboReturnStatus(item);
  const comboName = item.comboName || item.comboProductName || "Combo Product";

  return {
    id: `combo-${item.comboOrderReturnId.toString()}`,
    rawId: item.comboOrderReturnId.toString(),
    orderReturnId: item.comboOrderReturnId.toString(),
    orderType: "combo",
    reason: item.reason || "",
    returnImage: item.returnImage || "",
    status,
    quantity: Number(item.quantity || 1),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    productCode: item.comboCode || "COMBO",
    comboItems: item.comboItems || "",
    user: {
      id: item.userId?.toString?.() || "",
      fullName: item.userName || "N/A",
      email: item.userEmail || "",
      phone: item.userPhone || "",
    },
    order: {
      id: item.comboOrderId.toString(),
      orderNumber: `NC-${item.comboOrderId.toString()}`,
      orderStatus: normalizeOrderStatus(item.orderStatus),
      paymentStatus: item.paymentStatus || "",
      totalAmount: Number(item.totalAmount || 0),
      createdAt: item.orderCreatedAt || null,
    },
    cancellation: null,
    shipment: status === "shipped"
      ? {
          courierName: "",
          cnNumber: "",
          cnDate: null,
          remark: "Combo return marked as shipped",
          status: "RETURN_SHIPPED",
          updatedAt: item.updatedAt,
        }
      : null,
    refund: status === "refunded"
      ? {
          mode: "",
          amount: Number(item.totalAmount || 0),
          transactionId: "",
          status: "REFUNDED",
          paymentDate: null,
          updatedAt: item.updatedAt,
        }
      : null,
    product: {
      id: item.comboProductId.toString(),
      code: item.comboCode || "COMBO",
      name: comboName,
      image: item.image || "/no-image.png",
      price: Number(item.comboPrice || 0),
    },
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = String(searchParams.get("status") || "all").toLowerCase();

    const [rows, comboRows] = await Promise.all([
      prisma.orderReturn.findMany({
      include: {
        users: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        product: {
          select: {
            productCode: true,
            productName: true,
            subGroupName: true,
            pImage: true,
            sellingPrice: true,
          },
        },
        orders: {
          select: {
            orderStatus: true,
            paymentStatus: true,
            quantity: true,
            totalAmount: true,
            createdAt: true,
            shippingDetails: {
              orderBy: { shippingDetailsId: "desc" },
              take: 1,
              select: {
                shippingCourier: true,
                trackingNumber: true,
                shippingDate: true,
                shippingRemark: true,
                shippingStatus: true,
                updatedAt: true,
              },
            },
            paymentDetails: {
              orderBy: { paymentDetailsId: "desc" },
              take: 1,
              select: {
                paymentMode: true,
                paymentAmount: true,
                paymentDate: true,
                transactionId: true,
                paymentStatus: true,
                updatedAt: true,
              },
            },
            orderCancellation: {
              orderBy: { orderCancellationId: "desc" },
              take: 1,
              select: {
                orderCancellationId: true,
                cancellationReason: true,
                adminCancellationReason: true,
                cancellationStatus: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
      fetchComboReturns(),
    ]);

    const data = [
      ...rows.map((row) => ({ ...mapReturn(row), orderType: "normal" })),
      ...(comboRows as any[]).map(mapComboReturn),
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      )
      .filter((item) => status === "all" || item.status === status);

    return NextResponse.json(
      { success: true, data },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch returns",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
