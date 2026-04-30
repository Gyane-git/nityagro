import { NextResponse } from "next/server";

// TEMP: fake in-memory data (for testing)
let products = [
  { id: 1, name: "Product 1" },
  { id: 2, name: "Product 2" },
];

export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id);

    // check if product exists
    const productExists = products.find((p) => p.id === id);

    if (!productExists) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // delete product
    products = products.filter((p) => p.id !== id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting product" }, { status: 500 });
  }
}
