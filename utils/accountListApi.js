function authHeaders() {
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
    credentials: "include",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "Request failed");
  }
  return payload;
}

export function addCartToDb(item) {
  return request("/api/account/cart", {
    method: "POST",
    body: JSON.stringify({
      productId: item.productId || item.id,
      quantity: item.qty || 1,
    }),
  });
}

export function updateCartQtyInDb(id, qty) {
  return request("/api/account/cart", {
    method: "PUT",
    body: JSON.stringify({ productId: id, quantity: qty }),
  });
}

export function removeCartFromDb(id) {
  return request("/api/account/cart", {
    method: "DELETE",
    body: JSON.stringify({ productId: id }),
  });
}

export function clearCartInDb() {
  return request("/api/account/cart", {
    method: "DELETE",
    body: JSON.stringify({ clear: true }),
  });
}

export function addWishlistToDb(item) {
  return request("/api/account/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId: item.productId || item.id }),
  });
}

export function removeWishlistFromDb(id) {
  return request("/api/account/wishlist", {
    method: "DELETE",
    body: JSON.stringify({ productId: id }),
  });
}

export function clearWishlistInDb() {
  return request("/api/account/wishlist", {
    method: "DELETE",
    body: JSON.stringify({ clear: true }),
  });
}
