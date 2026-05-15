import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/prisma-client";

type OtpPurpose = "VERIFY_EMAIL" | "RESET_PASSWORD";

type StoredOtp = {
  purpose: OtpPurpose;
  hash: string;
  expiresAt: number;
};

const OTP_LENGTH = 6;

export function generateOtpCode() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
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
  const hash = await bcrypt.hash(otpCode, 10);
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;

  await prisma.user.update({
    where: { id: userId },
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

  return bcrypt.compare(otpCode, stored.hash);
}

