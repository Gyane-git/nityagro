export function parseComboProductCodes(value: unknown) {
  return String(value || "")
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);
}

export async function resolveComboItems(prisma: any, productCodes: unknown) {
  const codes = parseComboProductCodes(productCodes);
  if (codes.length === 0) return [];

  const [variants, products] = await Promise.all([
    prisma.productVariant.findMany({
      where: { pCode: { in: codes } },
      select: {
        pCode: true,
        subGroupName: true,
        variationName: true,
        salesRate: true,
        stockQuantity: true,
      },
    }),
    prisma.products.findMany({
      where: { productCode: { in: codes } },
      select: {
        productCode: true,
        productName: true,
        subGroupName: true,
        pImage: true,
        sellingPrice: true,
        actualPrice: true,
        stockQuantity: true,
        availableQuantity: true,
      },
    }),
  ]);

  const variantByCode = new Map<string, any>(
    variants.map((variant: any) => [String(variant.pCode), variant]),
  );
  const productByCode = new Map<string, any>(
    products.map((product: any) => [String(product.productCode), product]),
  );

  return codes.map((code) => {
    const variant = variantByCode.get(code);
    const product = productByCode.get(code);
    const groupName =
      variant?.subGroupName || product?.subGroupName || product?.productName || "";
    const variationName = variant?.variationName || product?.productName || code;
    const name = groupName && groupName !== variationName
      ? `${groupName} - ${variationName}`
      : variationName;

    return {
      code,
      pCode: code,
      name,
      productName: product?.productName || variationName,
      subGroupName: groupName,
      variationName,
      image: product?.pImage || "/no-image.png",
      price: Number(variant?.salesRate ?? product?.sellingPrice ?? 0),
      stockQuantity: (
        variant?.stockQuantity ??
        product?.availableQuantity ??
        product?.stockQuantity ??
        0
      )?.toString?.() || "0",
    };
  });
}

export function getComboAvailability(comboItems: any[], requestedQty = 1) {
  const qty = Math.max(1, Number(requestedQty || 1));
  const items = Array.isArray(comboItems) ? comboItems : [];
  const stocks = items.map((item) => Number(item?.stockQuantity ?? 0));
  const comboStockQuantity = stocks.length ? Math.min(...stocks) : 0;
  const outOfStockItems = items.filter(
    (item) => Number(item?.stockQuantity ?? 0) < qty,
  );

  return {
    comboStockQuantity,
    comboOutOfStock: items.length === 0 || outOfStockItems.length > 0,
    outOfStockItems,
  };
}

export async function decrementComboItemsStock(
  tx: any,
  comboItems: any[],
  requestedQty = 1,
) {
  const qty = Math.max(1, Number(requestedQty || 1));
  const decrementBy = BigInt(qty);
  const items = Array.isArray(comboItems) ? comboItems : [];

  for (const item of items) {
    const pCode = String(item?.pCode || item?.code || "").trim();
    if (!pCode) continue;

    const variantUpdate = await tx.productVariant.updateMany({
      where: {
        pCode,
        stockQuantity: { gte: decrementBy },
      },
      data: {
        stockQuantity: { decrement: decrementBy },
      },
    });

    if (variantUpdate.count === 0) {
      throw new Error(`${item?.name || pCode} does not have enough stock`);
    }

    await tx.products.updateMany({
      where: {
        productCode: pCode,
        stockQuantity: { gte: decrementBy },
      },
      data: {
        stockQuantity: { decrement: decrementBy },
        availableQuantity: { decrement: decrementBy },
      },
    });
  }
}

export async function restoreComboItemsStock(
  tx: any,
  comboItems: any[],
  requestedQty = 1,
) {
  const qty = Math.max(1, Number(requestedQty || 1));
  const incrementBy = BigInt(qty);
  const items = Array.isArray(comboItems) ? comboItems : [];

  for (const item of items) {
    const pCode = String(item?.pCode || item?.code || "").trim();
    if (!pCode) continue;

    const variants = await tx.productVariant.findMany({
      where: { pCode },
      select: { variantId: true, stockQuantity: true },
    });

    await Promise.all(
      variants.map((variant: any) =>
        tx.productVariant.update({
          where: { variantId: variant.variantId },
          data: {
            stockQuantity: BigInt(variant.stockQuantity ?? 0) + incrementBy,
          },
        }),
      ),
    );

    const product = await tx.products.findUnique({
      where: { productCode: pCode },
      select: {
        productId: true,
        stockQuantity: true,
        availableQuantity: true,
      },
    });

    if (product) {
      await tx.products.update({
        where: { productId: product.productId },
        data: {
          stockQuantity: BigInt(product.stockQuantity ?? 0) + incrementBy,
          availableQuantity: BigInt(product.availableQuantity ?? 0) + incrementBy,
        },
      });
    }
  }
}

export async function attachComboItems<T extends { productCodes?: unknown }>(
  prisma: any,
  combo: T | null | undefined,
) {
  if (!combo) return combo;
  const comboItems = await resolveComboItems(prisma, combo.productCodes);
  const availability = getComboAvailability(comboItems);
  return {
    ...combo,
    comboItems,
    ...availability,
  };
}

export async function attachComboItemsMany<T extends { productCodes?: unknown }>(
  prisma: any,
  combos: T[],
) {
  return Promise.all(combos.map((combo) => attachComboItems(prisma, combo)));
}
