export async function isAuthenticatedClient() {
  if (typeof window === "undefined") return false;
  const token = window.localStorage.getItem("token");
  return Boolean(token);
}

