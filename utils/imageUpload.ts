import path from "path";

const isProd = process.env.NODE_ENV === "production";

// 🔥 Auto-switch base dir
export const UPLOAD_BASE_DIR = isProd
  ? process.env.UPLOAD_DIR || "/var/www/yuemi/uploads"
  : path.join(process.cwd(), "public", "uploads");

export const GET_UPLOAD_BASE_DIR = isProd
  ? process.env.GET_UPLOAD_BASE_DIR || "/var/www/yuemi"
  : process.cwd();

export function getProductImageDir(productCode: string) {
  return path.join(
    UPLOAD_BASE_DIR,
    "products",
    productCode,
    "images"
  );
}

export function urlToFilePath(imageUrl: string) {
  const relativePath = imageUrl
    .replace(/^\/+/, "")
    .replace(/^uploads\//, "");

  return path.join(UPLOAD_BASE_DIR, relativePath);
}

export function getCategoryImageDir() {
  return path.join(UPLOAD_BASE_DIR, "categories");
}

export function getPublicImageUrl(
  productCode: string,
  fileName: string
) {
  return `/uploads/products/${productCode}/images/${fileName}`;
}
