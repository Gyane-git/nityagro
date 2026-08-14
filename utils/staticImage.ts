const NGINX_STATIC_PREFIXES = ["/uploads/", "/categories/", "/banners/", "/popup/"];

export function normalizeImageSrc(src: unknown, fallback = "/no-image.png") {
  if (!src || typeof src !== "string") return fallback;
  if (/^https?:\/\//i.test(src)) return src;
  return src.startsWith("/") ? src : `/${src}`;
}

export function shouldBypassNextImage(src: unknown) {
  if (!src || typeof src !== "string") return false;
  if (src === "/no-image.png") return true;
  return NGINX_STATIC_PREFIXES.some((prefix) => src.startsWith(prefix));
}
