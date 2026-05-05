export async function GET() {
  return Response.json({
    products: [
      {
        id: 1,
        name: "Test Product",
        productCode: "P001",
        sellPrice: 100,
        actualPrice: 120,
        availableQuantity: 10,
        status: 1,
        categoryName: "Test Category",
        brandName: "Test Brand",
      },
    ],
  });
}
