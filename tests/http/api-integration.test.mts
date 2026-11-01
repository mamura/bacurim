import assert from "node:assert/strict";
import test from "node:test";

import { createHttpClient } from "../../src/shared/http/client.ts";
import { ApiError } from "../../src/shared/http/api-error.ts";
import { isHealthResponse } from "../../src/features/api-status/model/is-health-response.ts";

const baseUrl = process.env.API_INTEGRATION_URL;

test(
  "real Laravel health and Problem Details contracts",
  { skip: !baseUrl },
  async () => {
    const client = createHttpClient({ baseUrl: baseUrl!, timeoutMs: 5000 });
    const health = await client.request<unknown>("health");
    assert.equal(health.status, 200);
    assert.equal(isHealthResponse(health.data), true);
    await assert.rejects(
      client.request("health", { method: "POST" }),
      (error) => error instanceof ApiError && error.status === 405,
    );
    await assert.rejects(
      client.request("absent-frontend-contract-probe"),
      (error) => error instanceof ApiError && error.status === 404,
    );
  },
);
