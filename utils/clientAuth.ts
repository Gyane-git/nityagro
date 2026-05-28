export async function isAuthenticatedClient() {
  if (typeof window === "undefined") return false;
  const token = window.localStorage.getItem("token");
  const cachedUser = window.localStorage.getItem("auth_user");
  if (token || cachedUser) return true;

  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success || !payload?.data?.userId) {
      return false;
    }
    window.localStorage.setItem("auth_user", JSON.stringify(payload.data));
    window.localStorage.setItem("userId", payload.data.userId);
    return true;
  } catch {
    return false;
  }
}
