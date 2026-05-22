import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;
const HASH_PREFIX = "scrypt";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return `${HASH_PREFIX}$${salt}$${hash}`;
}

export function isHashedPassword(value: string | null | undefined) {
  return String(value || "").startsWith(`${HASH_PREFIX}$`);
}

export function verifyPassword(password: string, storedPassword: string) {
  if (!storedPassword) return false;

  if (!isHashedPassword(storedPassword)) {
    const passwordBuffer = Buffer.from(password);
    const storedBuffer = Buffer.from(storedPassword);

    return (
      passwordBuffer.length === storedBuffer.length &&
      timingSafeEqual(passwordBuffer, storedBuffer)
    );
  }

  const [, salt, storedHash] = storedPassword.split("$");
  if (!salt || !storedHash) return false;

  const nextHash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  const nextBuffer = Buffer.from(nextHash, "hex");
  const storedBuffer = Buffer.from(storedHash, "hex");

  return (
    nextBuffer.length === storedBuffer.length &&
    timingSafeEqual(nextBuffer, storedBuffer)
  );
}
