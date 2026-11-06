import { ApiError } from "./api-error";
import { createHttpClient } from "./client";

export function readXsrfCookie(cookie: string): string | undefined {
  const value = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("XSRF-TOKEN="))
    ?.slice("XSRF-TOKEN=".length);
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
}
export function createBrowserApiClient(
  origin = process.env.NEXT_PUBLIC_API_ORIGIN ??
    "http://api-bacurim.mamura.test",
) {
  const url = new URL(origin);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new ApiError("configuration");
  return createHttpClient({
    baseUrl: url.origin,
    credentials: "include",
    sendRequestId: false,
    getHeaders: ({ method }) => {
      if (method === "GET") return new Headers();
      const token = readXsrfCookie(
        typeof document === "undefined" ? "" : document.cookie,
      );
      if (!token) throw new ApiError("http", { status: 419 });
      return { "X-XSRF-TOKEN": token };
    },
  });
}
