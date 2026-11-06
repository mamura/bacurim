import { ApiError } from "./api-error.ts";
import { safeRequestId } from "./problem-details.ts";
import { readHttpError } from "./read-http-error.ts";
import {
  createRequestId,
  createRequestScope,
  getRetryDelay,
  validateInteger,
  waitForRetry,
  withAbort,
} from "./request-lifecycle.ts";
import type {
  HttpClient,
  HttpClientConfig,
  HttpRequestOptions,
} from "./types.ts";
import { buildRequestUrl, normalizeApiBaseUrl } from "./url.ts";

export function createHttpClient(config: HttpClientConfig): HttpClient {
  const base = normalizeApiBaseUrl(config.baseUrl);
  const transport = config.fetch ?? globalThis.fetch;

  return {
    async request<TResponse, TBody = unknown>(
      path: string,
      options: HttpRequestOptions<TBody> = {},
    ) {
      const method = options.method ?? "GET";
      if (
        !["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method) ||
        (method === "GET" && options.body !== undefined)
      )
        throw new ApiError("configuration");
      const url = buildRequestUrl(base, path, options.query);
      const timeoutMs = validateInteger(
        options.timeoutMs ?? config.timeoutMs ?? 10_000,
        1,
        120_000,
      );
      const retries = validateInteger(
        options.retries ?? config.retries ?? 0,
        0,
        2,
      );
      const retryDelayMs = validateInteger(config.retryDelayMs ?? 200, 0, 1000);
      const headers = new Headers({
        Accept: "application/json, application/problem+json",
      });
      new Headers(config.headers).forEach((value, key) =>
        headers.set(key, value),
      );
      let body: string | undefined;
      if (options.body !== undefined) {
        try {
          body = JSON.stringify(options.body);
        } catch {
          throw new ApiError("configuration");
        }
        if (body === undefined) throw new ApiError("configuration");
      }
      const scope = createRequestScope(timeoutMs, options.signal);
      let requestId: string | undefined;
      try {
        if (scope.signal.aborted) throw new ApiError(scope.kind());
        if (config.getHeaders) {
          const extra = await withAbort(
            Promise.resolve().then(() =>
              config.getHeaders!({
                method,
                url: new URL(url),
                signal: scope.signal,
              }),
            ),
            scope.signal,
          );
          new Headers(extra).forEach((value, key) => headers.set(key, value));
        }
        new Headers(options.headers).forEach((value, key) =>
          headers.set(key, value),
        );
        if (body !== undefined) headers.set("Content-Type", "application/json");
        requestId =
          safeRequestId(headers.get("X-Request-ID")) ?? createRequestId();
        if (config.sendRequestId !== false)
          headers.set("X-Request-ID", requestId);

        for (let attempt = 0; ; attempt++) {
          let response: Response | undefined;
          try {
            if (scope.signal.aborted)
              throw new ApiError(scope.kind(), { requestId });
            response = await withAbort(
              transport(url, {
                method,
                headers,
                body,
                signal: scope.signal,
                credentials:
                  options.credentials ?? config.credentials ?? "omit",
                cache: "no-store",
                redirect: "error",
              }),
              scope.signal,
            );
            const responseId =
              safeRequestId(response.headers.get("X-Request-ID")) ?? requestId;
            if (!response.ok)
              throw await withAbort(
                readHttpError(response, responseId),
                scope.signal,
              );
            let data: unknown;
            if (response.status !== 204) {
              const text = await withAbort(response.text(), scope.signal);
              if (text) {
                const mediaType = response.headers
                  .get("content-type")
                  ?.split(";")[0]
                  .trim();
                if (
                  mediaType !== "application/json" &&
                  !mediaType?.endsWith("+json")
                )
                  throw new ApiError("invalid-response", {
                    requestId: responseId,
                  });
                try {
                  data = JSON.parse(text);
                } catch {
                  throw new ApiError("invalid-response", {
                    requestId: responseId,
                  });
                }
              }
            }
            return {
              status: response.status,
              data: data as TResponse | undefined,
              headers: response.headers,
              requestId: responseId,
            };
          } catch (cause) {
            const error = scope.signal.aborted
              ? new ApiError(scope.kind(), { requestId })
              : cause instanceof ApiError
                ? cause
                : new ApiError("network", { requestId });
            const retryable =
              error.kind === "network" ||
              (error.kind === "http" &&
                [429, 502, 503, 504].includes(error.status ?? 0));
            if (method !== "GET" || !retryable || attempt >= retries)
              throw error;
            const delay = getRetryDelay(response, retryDelayMs, attempt);
            if (delay === undefined) throw error;
            await waitForRetry(delay, scope.signal);
          }
        }
      } catch (cause) {
        if (scope.signal.aborted)
          throw new ApiError(scope.kind(), { requestId });
        if (cause instanceof ApiError) throw cause;
        throw new ApiError("network", { requestId });
      } finally {
        scope.dispose();
      }
    },
  };
}
