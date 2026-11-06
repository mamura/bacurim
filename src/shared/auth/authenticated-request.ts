import type { HttpRequestOptions } from "@shared/http";
import { ApiError } from "@shared/http";
import { createBrowserApiClient } from "@shared/http/browser";

let epoch = 0;
const listeners = new Set<() => void>();
export function advanceAuthEpoch() {
  epoch++;
}
export function subscribeUnauthorized(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export async function authenticatedRequest<T>(
  path: string,
  options: HttpRequestOptions = {},
) {
  const startedAt = epoch;
  try {
    return await createBrowserApiClient().request<T>(path, options);
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 401 &&
      epoch === startedAt
    ) {
      epoch++;
      listeners.forEach((listener) => listener());
    }
    throw error;
  }
}
