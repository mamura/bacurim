import "server-only";

type DevelopmentPreview = "ui" | "architecture" | "http";

export function isDevelopmentPreviewEnabled(
  preview: DevelopmentPreview,
): boolean {
  if (process.env.NODE_ENV === "development") return true;

  const flags = {
    ui: process.env.ENABLE_UI_PREVIEW,
    architecture: process.env.ENABLE_ARCHITECTURE_PREVIEW,
    http: process.env.ENABLE_HTTP_PREVIEW,
  };
  return flags[preview] === "true";
}
