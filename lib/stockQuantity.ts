export function toStockInteger(value: unknown) {
  const quantity = Number(value ?? 0);
  if (!Number.isFinite(quantity) || quantity <= 0) return 0;
  // Prisma stock fields are BigInt; never round up inventory from a fractional OMS value.
  return Math.floor(quantity);
}

export function toStockBigInt(value: unknown) {
  return BigInt(toStockInteger(value));
}
