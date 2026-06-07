import path from "node:path";

const PUBLIC_UPLOAD_ROOT_ENV_KEYS = [
  "UPLOAD_PUBLIC_DIR",
  "PUBLIC_UPLOAD_DIR",
  "PUBLIC_ASSET_DIR",
];

export function getPublicUploadDir(...segments: string[]) {
  const configuredRoot =
    process.env.NODE_ENV === "production"
      ? PUBLIC_UPLOAD_ROOT_ENV_KEYS.map((key) => process.env[key]?.trim()).find(
          Boolean,
        )
      : null;

  if (configuredRoot) {
    return path.join(configuredRoot, ...segments);
  }

  return path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "public",
    ...segments,
  );
}
