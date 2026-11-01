import "server-only";

import { getApiBaseUrl, getApiTimeoutMs } from "../config/api.ts";
import { createHttpClient } from "./client.ts";
import type { HttpClient, HttpClientConfig } from "./types.ts";

// Create per request/context; never store credentials in a shared singleton.
export function createServerApiClient(
  options: Omit<HttpClientConfig, "baseUrl"> = {},
): HttpClient {
  return createHttpClient({ ...options, baseUrl: getApiBaseUrl() });
}
