const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ""
)
  .trim()
  .replace(/\/$/, "");

function resolveUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  if (!API_BASE) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiRequest(
  path: string,
  tokenReq = false,
  options: RequestInit & { withCredentials?: boolean } = {},
) {
  const url = resolveUrl(path);
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(tokenReq && token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: options.withCredentials ? "include" : "same-origin",
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || `Request failed: ${response.status}`);
  }

  return data;
}
