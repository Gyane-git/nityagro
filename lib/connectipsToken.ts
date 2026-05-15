import crypto from "crypto";
import fs from "fs";
import path from "path";
import pem from "pem";

const resolvePfxPath = (): string => {
  const customPath = String(process.env.CONNECTIPS_PFX_PATH || "").trim();
  if (customPath) {
    return path.isAbsolute(customPath)
      ? customPath
      : path.join(process.cwd(), customPath);
  }

  const fileName = String(process.env.CONNECTIPS_PFX_FILE || "").trim();
  if (fileName) {
    return path.join(process.cwd(), "signatures", fileName);
  }

  const candidates = ["CREDITOR.pfx", "CREDITOR1.pfx"];
  for (const candidate of candidates) {
    const candidatePath = path.join(process.cwd(), "signatures", candidate);
    if (fs.existsSync(candidatePath)) {
      return candidatePath;
    }
  }

  return path.join(process.cwd(), "signatures", "CREDITOR.pfx");
};

const readPkcs12WithPass = (pfx: Buffer, password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    pem.readPkcs12(pfx, { p12Password: password }, (err, cert: any) => {
      if (err || !cert) {
        reject(err || new Error("Failed to read PKCS12 certificate"));
        return;
      }
      const key = cert.key || cert.privateKey || cert.clientKey || cert.serviceKey;
      if (!key) {
        reject(new Error("Private key not found in PKCS12 certificate"));
        return;
      }
      resolve(String(key));
    });
  });
};

export async function getConnectIPSPrivateKey(): Promise<string> {
  const pfxPath = resolvePfxPath();
  const pfx = fs.readFileSync(pfxPath);
  const candidates = [
    process.env.CONNECTIPS_PFX_PASSWORD,
    process.env.CONNECTIPS_CREDITOR_PASSWORD,
  ].filter((v): v is string => Boolean(v && String(v).trim()));

  if (!candidates.length) {
    throw new Error("Missing PKCS12 password env var");
  }

  let lastError: unknown;
  for (const candidate of candidates) {
    try {
      return await readPkcs12WithPass(pfx, String(candidate).trim());
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to read PKCS12 private key");
}

export async function generateConnectIPSToken(
  payload: Record<string, unknown>,
  orderedKeys: readonly string[]
): Promise<string> {
  const message = orderedKeys
    .map((key) => `${key}=${payload?.[key] ?? ""}`)
    .join(",");

  const privateKey = await getConnectIPSPrivateKey();
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(message, "utf8");
  sign.end();
  return sign.sign(privateKey, "base64");
}
