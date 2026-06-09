import crypto from "crypto";
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const fromProjectRoot = (...segments: string[]) =>
  path.join(/* turbopackIgnore: true */ process.cwd(), ...segments);

const normalizeEnvValue = (value?: string | null): string => {
  const raw = String(value || "").trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1).trim();
  }
  return raw.replace(/\\\$/g, "$");
};

const readRawEnvValue = (key: string): string => {
  try {
    const envPath = fromProjectRoot(".env");
    if (!fs.existsSync(envPath)) return "";
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      if (!trimmed.startsWith(`${key}=`)) continue;
      return normalizeEnvValue(trimmed.slice(key.length + 1));
    }
  } catch {
    // Fall back to process.env when the raw .env file is not readable.
  }
  return "";
};

const envCandidates = (...keys: string[]) => {
  const values: string[] = [];
  for (const key of keys) {
    const raw = readRawEnvValue(key);
    const expanded = normalizeEnvValue(process.env[key]);
    if (raw) values.push(raw);
    if (expanded) values.push(expanded);
  }
  return Array.from(new Set(values.filter((value) => value.trim())));
};

const resolvePfxPath = (): string => {
  const customPath = normalizeEnvValue(process.env.CONNECTIPS_PFX_PATH);
  if (customPath) {
    return path.isAbsolute(customPath) ? customPath : fromProjectRoot(customPath);
  }

  const fileName = normalizeEnvValue(process.env.CONNECTIPS_PFX_FILE);
  if (fileName) {
    return fromProjectRoot("signatures", fileName);
  }

  const candidates = ["CREDITOR.pfx", "BKGROUP.pfx"];
  for (const candidate of candidates) {
    const candidatePath = fromProjectRoot("signatures", candidate);
    if (fs.existsSync(candidatePath)) {
      return candidatePath;
    }
  }

  return fromProjectRoot("signatures", "CREDITOR.pfx");
};

const readPkcs12WithPass = (pfxPath: string, password: string): string => {
  let stdout = "";
  try {
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
        { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
      );
    } catch {
    // Fallback for environments where -legacy flag is unavailable.
      stdout = execFileSync(
        "openssl",
        ["pkcs12", "-in", pfxPath, "-nocerts", "-nodes", "-passin", `pass:${password}`],
        { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
      );
    }
  } catch (error) {
    const stderr = typeof error === "object" && error && "stderr" in error
      ? String((error as { stderr?: Buffer | string }).stderr || "")
      : "";
    const detail = stderr.toLowerCase().includes("invalid password") || stderr.toLowerCase().includes("mac verify")
      ? "invalid PKCS12 password"
      : "unable to read PKCS12 certificate";
    throw new Error(`ConnectIPS ${detail}`);
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
  const candidates = envCandidates(
    "CONNECTIPS_PFX_PASSWORD",
    "CONNECTIPS_CREDITOR_PASSWORD",
    "CONNECTIPS_AUTH_PASSWORD",
  );

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
