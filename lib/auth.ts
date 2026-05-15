import { cookies, headers } from "next/headers";
import { verifyToken } from "./jwt";

export const requireAuth = async () => {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    const cookieStore = await cookies();
    token =
      cookieStore.get("token")?.value ||
      cookieStore.get("admin_token")?.value ||
      undefined;
  }

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  return verifyToken(token);
};

export const requireAdminRole = async (...roles: string[]) => {
  const user = await requireAuth();

  if (user.type !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  if (roles.length) {
    const normalizedRoles = roles.map((role) => role.toUpperCase());
    const userRole = (user.role || "").toUpperCase();

    const isSuper = userRole === "SUPER_ADMIN" || userRole.includes("SUPER");
    if (!normalizedRoles.includes(userRole) && !isSuper) {
      throw new Error("FORBIDDEN");
    }
  }

  return user;
};
