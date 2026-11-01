import assert from "node:assert/strict";
import test from "node:test";

import { createHttpClient } from "../../src/shared/http/client.ts";
import { ApiError } from "../../src/shared/http/api-error.ts";

test("bounds a stalled fetch and stalled response body with the same timeout", async () => {
  for (const stalledBody of [false, true]) {
    const client = createHttpClient({
      baseUrl: "https://api.example.test/api/v1",
      timeoutMs: 25,
      fetch: async () =>
        stalledBody
          ? new Response(new ReadableStream({ start() {} }), {
              headers: { "Content-Type": "application/json" },
            })
          : new Promise<Response>(() => {}),
    });
    await assert.rejects(
      client.request("health"),
      (error) => error instanceof ApiError && error.kind === "timeout",
    );
  }
});

test("distinguishes caller cancellation and never sends a pre-cancelled request", async () => {
  const controller = new AbortController();
  controller.abort();
  let calls = 0;
  const client = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    fetch: async () => {
      calls++;
      return Response.json({});
    },
  });
  await assert.rejects(
    client.request("health", { signal: controller.signal }),
    (error) => error instanceof ApiError && error.kind === "cancelled",
  );
  assert.equal(calls, 0);
  const during = new AbortController();
  const stalled = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    fetch: async () => new Promise<Response>(() => {}),
  });
  const result = stalled.request("health", { signal: during.signal });
  during.abort();
  await assert.rejects(
    result,
    (error) => error instanceof ApiError && error.kind === "cancelled",
  );
});

test("retries only opted-in GET and reuses the logical request correlation id", async () => {
  let calls = 0;
  const ids: string[] = [];
  const client = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    retries: 2,
    retryDelayMs: 0,
    fetch: async (_, init) => {
      calls++;
      ids.push(new Headers(init?.headers).get("X-Request-ID")!);
      if (calls < 3) return Response.json({}, { status: 503 });
      return Response.json(
        { status: "ok" },
        { headers: { "X-Request-ID": "upstream-123" } },
      );
    },
  });
  const response = await client.request("health");
  assert.equal(calls, 3);
  assert.equal(new Set(ids).size, 1);
  assert.match(ids[0], /^[a-f0-9-]+$/);
  assert.equal(response.requestId, "upstream-123");
});

test("does not retry by default or automatically repeat mutations, validation or authentication errors", async () => {
  for (const method of ["GET", "POST", "PUT", "PATCH", "DELETE"] as const) {
    let calls = 0;
    const client = createHttpClient({
      baseUrl: "https://api.example.test/api/v1",
      retryDelayMs: 0,
      fetch: async () => {
        calls++;
        return Response.json({}, { status: 503 });
      },
    });
    await assert.rejects(
      client.request("examples", { method, retries: method === "GET" ? 0 : 2 }),
    );
    assert.equal(calls, 1);
  }
  for (const status of [401, 403, 404, 409, 422, 500]) {
    let calls = 0;
    const client = createHttpClient({
      baseUrl: "https://api.example.test/api/v1",
      retries: 2,
      retryDelayMs: 0,
      fetch: async () => {
        calls++;
        return Response.json({}, { status });
      },
    });
    await assert.rejects(client.request("examples"));
    assert.equal(calls, 1);
  }
});

test("honors long Retry-After without retrying early and allows cancellation during backoff", async () => {
  let calls = 0;
  const client = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    retries: 2,
    fetch: async () => {
      calls++;
      return Response.json(
        {},
        { status: 429, headers: { "Retry-After": "60" } },
      );
    },
  });
  await assert.rejects(client.request("health"));
  assert.equal(calls, 1);
  const controller = new AbortController();
  const retrying = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    retries: 2,
    retryDelayMs: 500,
    fetch: async () => {
      setTimeout(() => controller.abort(), 10);
      return Response.json({}, { status: 503 });
    },
  });
  await assert.rejects(
    retrying.request("health", { signal: controller.signal }),
    (error) => error instanceof ApiError && error.kind === "cancelled",
  );
});

test("auth extension is request scoped and cannot stall beyond the request deadline", async () => {
  let calls = 0;
  const client = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    getHeaders: () => ({ Authorization: "Bearer scoped-test-value" }),
    fetch: async (_, init) => {
      calls++;
      assert.equal(
        new Headers(init?.headers).get("Authorization"),
        "Bearer scoped-test-value",
      );
      return Response.json({});
    },
  });
  await client.request("health");
  assert.equal(calls, 1);
  const stalled = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    timeoutMs: 20,
    getHeaders: async () => new Promise<HeadersInit>(() => {}),
  });
  await assert.rejects(
    stalled.request("health"),
    (error) => error instanceof ApiError && error.kind === "timeout",
  );
});

test("server adapter applies the private timeout configuration", async () => {
  const { createServerApiClient } =
    await import("../../src/shared/http/server.ts");
  const previous = process.env.API_TIMEOUT_MS;
  process.env.API_TIMEOUT_MS = "20";
  try {
    const client = await createServerApiClient({
      fetch: async () => new Promise<Response>(() => {}),
    });
    await assert.rejects(
      client.request("health"),
      (error) => error instanceof ApiError && error.kind === "timeout",
    );
  } finally {
    if (previous === undefined) delete process.env.API_TIMEOUT_MS;
    else process.env.API_TIMEOUT_MS = previous;
  }
});
