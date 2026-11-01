import assert from "node:assert/strict";
import test from "node:test";

import { createHttpClient } from "../../src/shared/http/client.ts";
import { ApiError } from "../../src/shared/http/api-error.ts";
import { createApiMockFetch } from "../../src/shared/http/testing/mock-fetch.ts";
import { getApiMockScenario } from "../../src/shared/http/testing/mock-policy.ts";

test("mock transport preserves health, envelopes, pagination and 204 contracts", async () => {
  const original = globalThis.fetch;
  const client = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    fetch: createApiMockFetch(),
  });
  assert.deepEqual((await client.request("health")).data, { status: "ok" });
  const response = await client.request<{
    data: { id: string; amount: string }[];
    meta: { current_page: number };
  }>("examples", { query: { page: 1 } });
  assert.equal(response.data?.data[0].id, "9007199254740993");
  assert.equal(response.data?.data[0].amount, "1234.56");
  assert.equal(response.data?.meta.current_page, 1);
  assert.equal(
    (await client.request("examples", { method: "DELETE" })).data,
    undefined,
  );
  assert.equal(globalThis.fetch, original);
});

test("mock errors pass through the real client parser", async () => {
  for (const [scenario, status] of [
    ["validation", 422],
    ["unauthenticated", 401],
    ["forbidden", 403],
    ["not-found", 404],
    ["conflict", 409],
    ["server-error", 500],
  ] as const) {
    const client = createHttpClient({
      baseUrl: "https://api.example.test/api/v1",
      fetch: createApiMockFetch(scenario),
    });
    await assert.rejects(
      client.request("health"),
      (error) => error instanceof ApiError && error.status === status,
    );
  }
  for (const scenario of ["network", "timeout"] as const) {
    const client = createHttpClient({
      baseUrl: "https://api.example.test/api/v1",
      fetch: createApiMockFetch(scenario),
      timeoutMs: 20,
    });
    await assert.rejects(
      client.request("health"),
      (error) => error instanceof ApiError && error.kind === scenario,
    );
  }
});

test("mock activation is explicit and rejects production and unknown scenarios", () => {
  assert.equal(getApiMockScenario({ NODE_ENV: "development" }), undefined);
  assert.equal(
    getApiMockScenario({ NODE_ENV: "test", API_MOCKS_ENABLED: "true" }),
    "success",
  );
  assert.equal(
    getApiMockScenario({
      NODE_ENV: "development",
      API_MOCKS_ENABLED: "true",
      API_MOCK_SCENARIO: "timeout",
    }),
    "timeout",
  );
  for (const env of [
    { NODE_ENV: "production", API_MOCKS_ENABLED: "true" },
    { API_MOCKS_ENABLED: "true" },
    { NODE_ENV: "test", API_MOCKS_ENABLED: "1" },
    {
      NODE_ENV: "test",
      API_MOCKS_ENABLED: "true",
      API_MOCK_SCENARIO: "unknown",
    },
  ])
    assert.throws(
      () => getApiMockScenario(env),
      (error) => error instanceof ApiError && error.kind === "configuration",
    );
});

test("separate mock transports do not share scenario or mutate global fetch", async () => {
  const good = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    fetch: createApiMockFetch("success"),
  });
  const bad = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    fetch: createApiMockFetch("forbidden"),
  });
  await assert.rejects(
    bad.request("health"),
    (error) => error instanceof ApiError && error.status === 403,
  );
  assert.deepEqual((await good.request("health")).data, { status: "ok" });
});
