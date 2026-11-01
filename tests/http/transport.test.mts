import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "vitest";

import { createHttpClient } from "../../src/shared/http/client.ts";
import { ApiError } from "../../src/shared/http/api-error.ts";
import { isHealthResponse } from "../../src/features/api-status/model/is-health-response.ts";

test("real fetch sends headers/body/query and handles 201, 204, Problem Details, redirects and abort", async () => {
  let followedRedirect = false;
  const server = createServer(async (request, response) => {
    const url = new URL(request.url!, "http://localhost");
    if (url.pathname === "/api/v1/redirect") {
      response.writeHead(302, { Location: "/api/v1/outside" });
      response.end();
      return;
    }
    if (url.pathname === "/api/v1/outside") followedRedirect = true;
    if (url.pathname === "/api/v1/slow") {
      const timer = setTimeout(() => {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end("{}");
      }, 1000);
      response.on("close", () => clearTimeout(timer));
      return;
    }
    if (request.method === "DELETE") {
      response.writeHead(204);
      response.end();
      return;
    }
    if (url.pathname === "/api/v1/invalid") {
      response.writeHead(422, { "Content-Type": "application/problem+json" });
      response.end(
        JSON.stringify({
          type: "urn:bacurim:problem:validation_failed",
          status: 422,
          code: "validation_failed",
          errors: { name: ["Obrigatório."] },
        }),
      );
      return;
    }
    assert.equal(request.headers["content-type"], "application/json");
    assert.equal(url.searchParams.get("filter[name]"), "A & B");
    assert(request.headers["x-request-id"]);
    let body = "";
    for await (const chunk of request) body += chunk;
    assert.deepEqual(JSON.parse(body), { name: "Teste" });
    response.writeHead(201, {
      "Content-Type": "application/json",
      Location: "/api/v1/examples/1",
    });
    response.end(JSON.stringify({ data: { id: "1" } }));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert(address && typeof address !== "string");
  const client = createHttpClient({
    baseUrl: "http://127.0.0.1:" + address.port + "/api/v1",
  });
  try {
    const created = await client.request<{ data: { id: string } }>("examples", {
      method: "POST",
      query: { "filter[name]": "A & B" },
      body: { name: "Teste" },
    });
    assert.equal(created.status, 201);
    assert.equal(created.data?.data.id, "1");
    assert.equal(created.headers.get("Location"), "/api/v1/examples/1");
    assert.equal(
      (await client.request("examples/1", { method: "DELETE" })).data,
      undefined,
    );
    await assert.rejects(
      client.request("invalid"),
      (error) =>
        error instanceof ApiError &&
        error.status === 422 &&
        error.fieldErrors.name[0] === "Obrigatório.",
    );
    await assert.rejects(
      client.request("redirect"),
      (error) => error instanceof ApiError && error.kind === "network",
    );
    assert.equal(followedRedirect, false);
    await assert.rejects(
      client.request("slow", { timeoutMs: 25 }),
      (error) => error instanceof ApiError && error.kind === "timeout",
    );
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("health model accepts only the concrete backend contract", () => {
  assert.equal(isHealthResponse({ status: "ok" }), true);
  for (const invalid of [
    null,
    [],
    {},
    { data: { status: "ok" } },
    { status: true },
    { status: "down" },
  ])
    assert.equal(isHealthResponse(invalid), false);
});
