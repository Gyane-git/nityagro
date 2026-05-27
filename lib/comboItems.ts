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
      stockQuantity: variant?.stockQuantity?.toString?.() || null,
    };
  });
}

export async function attachComboItems<T extends { productCodes?: unknown }>(
  prisma: any,
  combo: T | null | undefined,
) {
  if (!combo) return combo;
  return {
    ...combo,
    comboItems: await resolveComboItems(prisma, combo.productCodes),
  };
}

export async function attachComboItemsMany<T extends { productCodes?: unknown }>(
  prisma: any,
  combos: T[],
) {
  return Promise.all(combos.map((combo) => attachComboItems(prisma, combo)));
}
