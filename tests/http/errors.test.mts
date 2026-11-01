import assert from "node:assert/strict";
import test from "node:test";

import { createHttpClient } from "../../src/shared/http/client.ts";
import { ApiError, toApiErrorView } from "../../src/shared/http/api-error.ts";

test("uses HTTP status as authority and maps Problem Details to safe errors", async () => {
  for (const status of [400, 401, 403, 404, 409, 422, 429, 500, 503]) {
    const client = createHttpClient({
      baseUrl: "https://api.example.test/api/v1",
      fetch: async () =>
        new Response(
          JSON.stringify({
            type: "urn:bacurim:problem:example.conflict",
            title: "private title",
            detail: "secret database credentials",
            status: 200,
            instance: "/api/v1/examples/1",
            code: "example.conflict",
            errors: {
              name: ["Informe o nome."],
              "items.0.label": ["Informe a descrição."],
            },
          }),
          {
            status,
            headers: {
              "Content-Type": "application/problem+json",
              "X-Request-ID": "trace-123",
            },
          },
        ),
    });
    await assert.rejects(client.request("examples"), (error) => {
      assert(error instanceof ApiError);
      assert.equal(error.status, status);
      assert.equal(error.problem?.status, status);
      assert.equal(error.requestId, "trace-123");
      assert.equal(error.code, "example.conflict");
      assert(!error.message.includes("secret"));
      const view = toApiErrorView(error);
      assert(!JSON.stringify(view).includes("private"));
      assert(!JSON.stringify(view).includes("credentials"));
      assert.equal(
        Object.keys(view.fieldErrors).length,
        status === 422 ? 2 : 0,
      );
      if (status === 422)
        assert.deepEqual(view.fieldErrors["items.0.label"], [
          "Informe a descrição.",
        ]);
      return true;
    });
  }
});

test("retains HTTP category for invalid JSON, HTML and empty error bodies", async () => {
  for (const [body, contentType] of [
    ["<h1>secret</h1>", "text/html"],
    ["{broken", "application/problem+json"],
    ["", "application/problem+json"],
  ]) {
    const client = createHttpClient({
      baseUrl: "https://api.example.test/api/v1",
      fetch: async () =>
        new Response(body, {
          status: 500,
          headers: { "Content-Type": contentType },
        }),
    });
    await assert.rejects(
      client.request("examples"),
      (error) =>
        error instanceof ApiError &&
        error.kind === "http" &&
        error.status === 500 &&
        !error.message.includes("secret"),
    );
  }
});

test("does not confuse connectivity failures with server errors or leak native exception messages", async () => {
  const client = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    fetch: async () => {
      throw new TypeError("private upstream URL");
    },
  });
  await assert.rejects(
    client.request("examples"),
    (error) =>
      error instanceof ApiError &&
      error.kind === "network" &&
      error.status === undefined &&
      !error.message.includes("private"),
  );
  assert(
    !JSON.stringify(toApiErrorView(new Error("secret"))).includes("secret"),
  );
});

test("ignores malformed validation extensions and prototype keys", async () => {
  const payload = JSON.parse(
    '{"errors":{"__proto__":["bad"],"items.0.label":["Obrigatório",42],"name":"not a list"},"code":"invalid code","instance":"/examples?token=secret"}',
  );
  const client = createHttpClient({
    baseUrl: "https://api.example.test/api/v1",
    fetch: async () =>
      Response.json(payload, {
        status: 422,
        headers: { "Content-Type": "application/problem+json" },
      }),
  });
  await assert.rejects(client.request("examples"), (error) => {
    assert(error instanceof ApiError);
    assert.deepEqual(Object.keys(error.fieldErrors), ["items.0.label"]);
    assert.equal(error.code, undefined);
    assert.equal(error.problem?.instance, undefined);
    return true;
  });
});
