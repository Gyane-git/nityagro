export function getCurrentAuthUser() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem("auth_user");
    if (!raw) return null;

    const user = JSON.parse(raw);
    return user?.userId ? user : null;
  } catch {
    return null;
  }
}

export function requireLoginForAction(message = "Please login to continue") {
  const user = getCurrentAuthUser();
  if (user) return true;

  if (typeof window !== "undefined") {
    // Google login uses an httpOnly cookie, so a missing localStorage token does
    // not always mean the user is logged out. Only clear client state when no
    // hydrated auth user exists.
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("auth_user");
    window.localStorage.removeItem("userId");

    const next = `${window.location.pathname}${window.location.search}`;
    window.setTimeout(() => {
      window.location.href = `/?login=1&next=${encodeURIComponent(next)}`;
    }, 650);
  }

  return false;
}
