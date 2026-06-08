import path from "node:path";

const PUBLIC_UPLOAD_ROOT_ENV_KEYS = [
  "UPLOAD_PUBLIC_DIR",
  "PUBLIC_UPLOAD_DIR",
  "PUBLIC_ASSET_DIR",
];

const DEFAULT_PRODUCTION_PUBLIC_UPLOAD_ROOT = "/var/www/nityagro/public";

export function getPublicUploadDir(...segments: string[]) {
  const isProduction = process.env.NODE_ENV === "production";
  const configuredRoot = isProduction
    ? PUBLIC_UPLOAD_ROOT_ENV_KEYS.map((key) => process.env[key]?.trim()).find(
        Boolean,
      )
    : null;

  if (configuredRoot || isProduction) {
    return path.join(
      /* turbopackIgnore: true */ configuredRoot ||
        DEFAULT_PRODUCTION_PUBLIC_UPLOAD_ROOT,
      ...segments,
    );
  }

  return path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "public",
    ...segments,
  );
}
