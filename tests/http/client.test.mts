import assert from "node:assert/strict";

import { test } from "vitest";

import { ApiError } from "../../src/shared/http/api-error.ts";
import { createHttpClient } from "../../src/shared/http/client.ts";
import type { ApiResource } from "../../src/shared/http/contracts.ts";

test("serializes JSON methods and preserves resource envelopes, IDs and decimals", async () => {
  for (const method of ["POST", "PUT", "PATCH", "DELETE"] as const) {
    const client = createHttpClient({
      baseUrl: "https://api.example.test/api/v1",
      fetch: async (input, init) => {
        assert.equal(String(input), "https://api.example.test/api/v1/examples");
        assert.equal(init?.method, method);
        assert.equal(init?.body, '{"name":"Teste"}');
        assert.equal(
          new Headers(init?.headers).get("content-type"),
          "application/json",
        );
        assert.equal(init?.cache, "no-store");
        assert.equal(init?.redirect, "error");
        assert.equal(init?.credentials, "omit");
        return Response.json({
          data: { id: "9007199254740993", amount: "1234.56" },
        });
      },
    });
    const response = await client.request<
      ApiResource<{ id: string; amount: string }>,
      { name: string }
    >("/examples", { method, body: { name: "Teste" } });
    assert.equal(response.data?.data.id, "9007199254740993");
    assert.equal(response.data?.data.amount, "1234.56");
  }
});

test("encodes query values, repeated keys and bracket filters without dropping the base path", async () => {
  const client = createHttpClient({
    baseUrl: "https://api.example.test/api/v1/",
    fetch: async (input, init) => {
      const url = new URL(String(input));
      assert.equal(url.pathname, "/api/v1/examples");
      assert.equal(url.searchParams.get("filter[name]"), "A & B");
      assert.deepEqual(url.searchParams.getAll("tag"), ["a", "b"]);
      assert.equal(url.searchParams.get("active"), "false");
      assert.equal(url.searchParams.has("absent"), false);
      assert.equal(new Headers(init?.headers).has("content-type"), false);
      return Response.json({ data: [] });
    },
  });
  await client.request("examples", {
    query: {
      "filter[name]": "A & B",
      tag: ["a", "b"],
      active: false,
      absent: null,
    },
  });
});

test("handles HTTP 204 without parsing JSON", async () => {
  const client = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    fetch: async () => new Response(null, { status: 204 }),
  });
  assert.equal(
    (await client.request<void>("examples/1", { method: "DELETE" })).data,
    undefined,
  );
});

test("rejects external destinations and traversal before invoking the transport", async () => {
  let calls = 0;
  const client = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    fetch: async () => {
      calls++;
      return Response.json({});
    },
  });
  for (const path of [
    "https://other.test/private",
    "//other.test/private",
    "../private",
    "/%2e%2e/private",
    "examples#token",
  ]) {
    await assert.rejects(
      client.request(path),
      (error) => error instanceof ApiError && error.kind === "configuration",
    );
  }
  assert.equal(calls, 0);
});

test("reports invalid success payloads and discards their raw contents", async () => {
  const client = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    fetch: async () =>
      new Response("<h1>internal secret</h1>", {
        headers: { "Content-Type": "text/html" },
      }),
  });
  await assert.rejects(
    client.request("examples"),
    (error) =>
      error instanceof ApiError &&
      error.kind === "invalid-response" &&
      !error.message.includes("secret"),
  );
});
