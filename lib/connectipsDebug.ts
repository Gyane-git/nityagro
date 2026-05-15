import fs from "fs/promises";
import path from "path";

type DebugValue = string | number | boolean | null | undefined | object;

type ConnectIPSDebugEvent = {
  step: string;
  referenceId?: string;
  txnId?: string;
  data?: Record<string, DebugValue>;
};

const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "connectips-debug.ndjson");

function maskSensitiveValue(key: string, value: DebugValue): DebugValue {
  const lowered = key.toLowerCase();
  if (
    lowered.includes("token") ||
    lowered.includes("password") ||
    lowered.includes("authorization")
  ) {
    const str = String(value ?? "");
    if (!str) return "";
    if (str.length <= 10) return "***";
    return `${str.slice(0, 6)}...${str.slice(-4)}`;
  }
  return value;
}

function maskObject(input?: Record<string, DebugValue>) {
  if (!input) return undefined;
  return Object.entries(input).reduce<Record<string, DebugValue>>(
    (acc, [key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        acc[key] = maskObject(value as Record<string, DebugValue>);
        return acc;
      }
      acc[key] = maskSensitiveValue(key, value);
      return acc;
    },
    {}
  );
}

export async function logConnectIPSDebug(event: ConnectIPSDebugEvent) {
  try {
    const payload = {
      at: new Date().toISOString(),
      step: event.step,
      referenceId: event.referenceId || null,
      txnId: event.txnId || null,
      data: maskObject(event.data),
    };
    await fs.mkdir(LOG_DIR, { recursive: true });
    await fs.appendFile(LOG_FILE, `${JSON.stringify(payload)}\n`, "utf8");
  } catch (error) {
    console.error("CONNECTIPS_DEBUG_LOG_WRITE_ERROR", error);
  }
}

export const CONNECTIPS_DEBUG_FILE = LOG_FILE;
