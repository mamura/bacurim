import { ApiError } from "./api-error.ts";
import { readHttpError } from "./read-http-error.ts";
import { buildRequestUrl, normalizeApiBaseUrl } from "./url.ts";
import type { HttpClient, HttpClientConfig } from "./types.ts";

export function createHttpClient(config: HttpClientConfig): HttpClient {
  const base = normalizeApiBaseUrl(config.baseUrl);
  const transport = config.fetch ?? globalThis.fetch;

  return {
    async request(path, options = {}) {
      const method = options.method ?? "GET";
      if (method === "GET" && options.body !== undefined)
        throw new ApiError("configuration");
      const url = buildRequestUrl(base, path, options.query);
      const headers = new Headers({
        Accept: "application/json, application/problem+json",
      });
      new Headers(config.headers).forEach((value, key) =>
        headers.set(key, value),
      );
      new Headers(options.headers).forEach((value, key) =>
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
        headers.set("Content-Type", "application/json");
      }

      let response: Response;
      try {
        response = await transport(url, {
          method,
          headers,
          body,
          signal: options.signal,
          credentials: options.credentials ?? config.credentials ?? "omit",
          cache: "no-store",
          redirect: "error",
        });
      } catch {
        throw new ApiError("network");
      }
      if (!response.ok) throw await readHttpError(response);
      if (response.status === 204)
        return {
          status: response.status,
          data: undefined,
          headers: response.headers,
        };
      let text: string;
      try {
        text = await response.text();
      } catch {
        throw new ApiError("network");
      }
      if (!text)
        return {
          status: response.status,
          data: undefined,
          headers: response.headers,
        };
      const mediaType = response.headers
        .get("content-type")
        ?.split(";")[0]
        .trim();
      if (mediaType !== "application/json" && !mediaType?.endsWith("+json"))
        throw new ApiError("invalid-response");
      try {
        return {
          status: response.status,
          data: JSON.parse(text),
          headers: response.headers,
        };
      } catch {
        throw new ApiError("invalid-response");
      }
    },
  };
}
