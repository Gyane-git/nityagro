import jwt from "jsonwebtoken";

export type AppJwtPayload = {
  sub: string;
  role?: string;
  type: "USER" | "ADMIN";
};

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const signToken = (
  payload: AppJwtPayload,
  expiresInSeconds: number = 60 * 60 * 24 * 8 // 8 days
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: expiresInSeconds
  });
};

export const verifyToken = (token: string): AppJwtPayload => {
  return jwt.verify(token, JWT_SECRET) as AppJwtPayload;
};
