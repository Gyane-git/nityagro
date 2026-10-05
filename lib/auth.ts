import { cookies, headers } from "next/headers";
import { verifyToken } from "./jwt";
import { canAccessAdminPermission } from "./adminPermissions";
import { prisma } from "./prisma";

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

export const requireAdminPermission = async (permission: string) => {
  const auth = await requireAdminRole();
  const user = await prisma.users.findUnique({
    where: { userId: BigInt(auth.sub) },
    select: { role: true, rolePermission: true, status: true },
  });

  if (!user?.status || !canAccessAdminPermission(user.role, user.rolePermission, permission)) {
    throw new Error("FORBIDDEN");
  }

  return { ...auth, role: user.role, rolePermission: user.rolePermission };
};
