import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

type OtpPurpose = "VERIFY_EMAIL" | "RESET_PASSWORD";

type StoredOtp = {
  purpose: OtpPurpose;
  hash: string;
  expiresAt: number;
};

const OTP_LENGTH = 6;
const HASH_PREFIX = "sha256";

export function generateOtpCode() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
}

function hashOtpCode(otpCode: string) {
  const salt = randomBytes(16).toString("hex");
  const digest = createHash("sha256")
    .update(`${salt}:${otpCode}`)
    .digest("hex");

  return `${HASH_PREFIX}$${salt}$${digest}`;
}

function compareOtpCode(otpCode: string, storedHash: string) {
  const [prefix, salt, digest] = storedHash.split("$");
  if (prefix !== HASH_PREFIX || !salt || !digest) return false;

  const nextDigest = createHash("sha256")
    .update(`${salt}:${otpCode}`)
    .digest("hex");

  const storedBuffer = Buffer.from(digest, "hex");
  const nextBuffer = Buffer.from(nextDigest, "hex");

  return (
    storedBuffer.length === nextBuffer.length &&
    timingSafeEqual(storedBuffer, nextBuffer)
  );
}

function parseStoredOtp(rawToken: string | null): StoredOtp | null {
  if (!rawToken) return null;

  try {
    const parsed = JSON.parse(rawToken) as StoredOtp;
    if (!parsed.hash || !parsed.purpose || !parsed.expiresAt) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function saveUserOtp(
  userId: bigint,
  purpose: OtpPurpose,
  otpCode: string,
  ttlMinutes = 10
) {
  const hash = hashOtpCode(otpCode);
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;

  await (prisma as any).users.update({
    where: { userId },
    data: {
      rememberToken: JSON.stringify({
        purpose,
        hash,
        expiresAt,
      } satisfies StoredOtp),
      updatedAt: new Date(),
    },
  });
}

export async function verifyUserOtp(
  rememberToken: string | null,
  purpose: OtpPurpose,
  otpCode: string
) {
  const stored = parseStoredOtp(rememberToken);
  if (!stored) return false;
  if (stored.purpose !== purpose) return false;
  if (Date.now() > stored.expiresAt) return false;

  return compareOtpCode(otpCode, stored.hash);
}
