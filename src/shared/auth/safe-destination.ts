export function safeDestination(
  value: string | null | undefined,
  fallback = "/app",
): string {
  if (
    !value ||
    /[\\\\\u0000-\u0020\u007f]/.test(value) ||
    !value.startsWith("/app") ||
    (value !== "/app" &&
      !value.startsWith("/app/") &&
      !value.startsWith("/app?"))
  )
    return fallback;
  try {
    const url = new URL(value, "https://bacurim.invalid");
    if (
      url.origin !== "https://bacurim.invalid" ||
      (url.pathname !== "/app" && !url.pathname.startsWith("/app/"))
    )
      return fallback;
    if (/%(?:2f|5c|0[0-9a-f]|1[0-9a-f])/i.test(value)) return fallback;
    return url.pathname + url.search;
  } catch {
    return fallback;
  }
}
