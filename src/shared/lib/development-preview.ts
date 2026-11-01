import "server-only";

type DevelopmentPreview = "ui" | "architecture";

export function isDevelopmentPreviewEnabled(
  preview: DevelopmentPreview,
): boolean {
  if (process.env.NODE_ENV === "development") return true;

  return preview === "ui"
    ? process.env.ENABLE_UI_PREVIEW === "true"
    : process.env.ENABLE_ARCHITECTURE_PREVIEW === "true";
}
