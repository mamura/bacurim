import { ApiError } from "./api-error.ts";
import type { QueryParameters } from "./types.ts";

export function normalizeApiBaseUrl(value: string): URL {
  let base: URL;
  try {
    base = new URL(value);
  } catch {
    throw new ApiError("configuration");
  }
  if (
    !["http:", "https:"].includes(base.protocol) ||
    base.username ||
    base.password ||
    base.search ||
    base.hash
  ) {
    throw new ApiError("configuration");
  }
  if (!base.pathname.endsWith("/")) base.pathname += "/";
  return base;
}

export function buildRequestUrl(
  base: URL,
  path: string,
  query?: QueryParameters,
): URL {
  if (
    !path ||
    /^[a-z][a-z0-9+.-]*:/i.test(path) ||
    path.startsWith("//") ||
    path.includes("#") ||
    path.includes("\\")
  ) {
    throw new ApiError("configuration");
  }
  try {
    const decodedPath = decodeURIComponent(path.split("?")[0]);
    if (decodedPath.includes("\\") || decodedPath.split("/").includes(".."))
      throw new Error();
    const url = new URL(path.replace(/^\//, ""), base);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname))
      throw new Error();
    if (query instanceof URLSearchParams) {
      for (const [key, value] of query) url.searchParams.append(key, value);
    } else if (query) {
      for (const [key, value] of Object.entries(query)) {
        for (const item of Array.isArray(value) ? value : [value]) {
          if (item !== null && item !== undefined)
            url.searchParams.append(key, String(item));
        }
      }
    }
    return url;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("configuration");
  }
}
