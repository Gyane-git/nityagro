import { randomBytes } from "crypto";

export function randomCode(prefix = "P", length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = randomBytes(length);

  let code = prefix.toUpperCase();

  for (let i = 0; i < length; i++) {
    code += chars[bytes[i] % chars.length];
  }

  return code.toUpperCase();
}
