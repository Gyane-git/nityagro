import crypto from "crypto";
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const fromProjectRoot = (...segments: string[]) =>
  path.join(/* turbopackIgnore: true */ process.cwd(), ...segments);

const resolvePfxPath = (): string => {
  const customPath = String(process.env.CONNECTIPS_PFX_PATH || "").trim();
  if (customPath) {
    return path.isAbsolute(customPath) ? customPath : fromProjectRoot(customPath);
  }

  const fileName = String(process.env.CONNECTIPS_PFX_FILE || "").trim();
  if (fileName) {
    return fromProjectRoot("signatures", fileName);
  }

  const candidates = ["BKGROUP.pfx", "BKGROUP.pfx"];
  for (const candidate of candidates) {
    const candidatePath = fromProjectRoot("signatures", candidate);
    if (fs.existsSync(candidatePath)) {
      return candidatePath;
    }
  }

  return fromProjectRoot("signatures", "BKGROUP.pfx");
};

const readPkcs12WithPass = (pfxPath: string, password: string): string => {
  let stdout = "";
  try {
    stdout = execFileSync(
      "openssl",
      [
        "pkcs12",
        "-legacy",
        "-in",
        pfxPath,
        "-nocerts",
        "-nodes",
        "-passin",
        `pass:${password}`,
      ],
      { encoding: "utf8" },
    );
  } catch {
    // Fallback for environments where -legacy flag is unavailable.
    stdout = execFileSync(
      "openssl",
      ["pkcs12", "-in", pfxPath, "-nocerts", "-nodes", "-passin", `pass:${password}`],
      { encoding: "utf8" },
    );
  }
  const match = stdout.match(
    /-----BEGIN(?: RSA)? PRIVATE KEY-----[\s\S]*?-----END(?: RSA)? PRIVATE KEY-----/,
  );
  if (!match?.[0]) {
    throw new Error("Private key not found in PKCS12 certificate");
  }
  return match[0];
};

export async function getConnectIPSPrivateKey(): Promise<string> {
  const pfxPath = resolvePfxPath();
  if (!fs.existsSync(pfxPath)) {
    throw new Error(`PKCS12 file not found at ${pfxPath}`);
  }
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
      return readPkcs12WithPass(pfxPath, String(candidate).trim());
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
