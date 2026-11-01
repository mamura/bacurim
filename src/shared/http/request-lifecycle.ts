import { ApiError } from "./api-error.ts";

export function validateInteger(
  value: number,
  min: number,
  max: number,
): number {
  if (!Number.isInteger(value) || value < min || value > max)
    throw new ApiError("configuration");
  return value;
}

export function createRequestScope(timeoutMs: number, external?: AbortSignal) {
  const controller = new AbortController();
  let kind: "timeout" | "cancelled" = "cancelled";
  function abort(reason: typeof kind) {
    if (!controller.signal.aborted) {
      kind = reason;
      controller.abort();
    }
  }
  const onCancel = () => abort("cancelled");
  external?.addEventListener("abort", onCancel, { once: true });
  if (external?.aborted) onCancel();
  const timer = setTimeout(() => abort("timeout"), timeoutMs);
  return {
    signal: controller.signal,
    kind: () => kind,
    dispose: () => {
      clearTimeout(timer);
      external?.removeEventListener("abort", onCancel);
    },
  };
}

export function withAbort<T>(
  promise: Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      signal.removeEventListener("abort", onAbort);
      reject(new DOMException("Aborted", "AbortError"));
    };
    if (signal.aborted) {
      promise.catch(() => {});
      onAbort();
      return;
    }
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(
      (value) => {
        signal.removeEventListener("abort", onAbort);
        resolve(value);
      },
      (error: unknown) => {
        signal.removeEventListener("abort", onAbort);
        reject(error);
      },
    );
  });
}

export function waitForRetry(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const cleanup = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
    };
    const onAbort = () => {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);
  });
}

export function getRetryDelay(
  response: Response | undefined,
  baseDelay: number,
  attempt: number,
): number | undefined {
  const header = response?.headers.get("Retry-After");
  if (header !== null && header !== undefined) {
    const value = /^\d+$/.test(header)
      ? Number(header) * 1000
      : Date.parse(header) - Date.now();
    if (Number.isFinite(value))
      return value <= 1000 ? Math.max(0, value) : undefined;
  }
  return Math.min(baseDelay * 2 ** attempt, 1000);
}

export function createRequestId(
  source: {
    randomUUID?: () => string;
    getRandomValues: (array: Uint8Array) => Uint8Array;
  } = globalThis.crypto,
): string {
  return (
    source.randomUUID?.() ??
    Array.from(source.getRandomValues(new Uint8Array(16)), (value) =>
      value.toString(16).padStart(2, "0"),
    ).join("")
  );
}
