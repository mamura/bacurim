import { vi } from "vitest";
import { createApiMockFetch } from "@shared/http/testing/mock-fetch";
import type { ApiMockScenario } from "@shared/http/testing/mock-policy";

// Intercepts only the test process; no network fallback is allowed.
export function mockApi(scenario: ApiMockScenario = "success") {
  vi.stubEnv("API_MOCKS_ENABLED", "false");
  vi.stubEnv("API_BASE_URL", "https://api.example.test/api/v1");
  vi.stubEnv("API_TIMEOUT_MS", "50");
  const fetch = vi.fn(createApiMockFetch(scenario));
  vi.stubGlobal("fetch", fetch);
  return fetch;
}
