import "server-only";

import { getApiBaseUrl, getApiTimeoutMs } from "../config/api.ts";
import { createHttpClient } from "./client.ts";
import { getApiMockScenario } from "./testing/mock-policy.ts";
import type { HttpClient, HttpClientConfig } from "./types.ts";

// A fresh instance per request/context; no shared credentials or global fetch override.
export async function createServerApiClient(
  options: Omit<HttpClientConfig, "baseUrl"> = {},
): Promise<HttpClient> {
  const scenario = getApiMockScenario(process.env);
  let transport = options.fetch;
  if (scenario) {
    const { createApiMockFetch } = await import("./testing/mock-fetch.ts");
    transport = createApiMockFetch(scenario);
  }
  return createHttpClient({
    ...options,
    baseUrl: getApiBaseUrl(),
    timeoutMs: options.timeoutMs ?? getApiTimeoutMs(),
    fetch: transport,
  });
}
