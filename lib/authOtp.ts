import { createHash, randomInt, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

export type AuthOtpPurpose = "VERIFY_EMAIL" | "RESET_PASSWORD";

const OTP_TTL_MINUTES = 10;
const OTP_PEPPER = process.env.JWT_SECRET || "nityagro-local-development-secret";

export function generateOtpCode() {
  return String(randomInt(100000, 1000000));
}

function normalizeEmail(email: string) {
  return String(email || "").trim().toLowerCase();
}

function hashOtpCode(email: string, purpose: AuthOtpPurpose, code: string) {
  return createHash("sha256")
    .update(`${normalizeEmail(email)}:${purpose}:${code}:${OTP_PEPPER}`)
    .digest("hex");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export async function saveAuthOtp(email: string, purpose: AuthOtpPurpose, code: string) {
  const normalizedEmail = normalizeEmail(email);
  const now = new Date();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await prisma.authOtp.updateMany({
    where: {
      email: normalizedEmail,
      purpose,
      consumed: false,
    },
    data: {
      consumed: true,
      updatedAt: now,
    },
  });

  return prisma.authOtp.create({
    data: {
      email: normalizedEmail,
      purpose,
      codeHash: hashOtpCode(normalizedEmail, purpose, code),
      expiresAt,
      consumed: false,
    },
  });
}

export async function verifyAuthOtp(email: string, purpose: AuthOtpPurpose, code: string) {
  const normalizedEmail = normalizeEmail(email);
  const otp = await prisma.authOtp.findFirst({
    where: {
      email: normalizedEmail,
      purpose,
      consumed: false,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otp) return false;

  const isValid = safeEqual(
    otp.codeHash,
    hashOtpCode(normalizedEmail, purpose, code),
  );

  if (!isValid) return false;

  await prisma.authOtp.update({
    where: {
      authOtpId: otp.authOtpId,
    },
    data: {
      consumed: true,
    },
  });

  return true;
}
