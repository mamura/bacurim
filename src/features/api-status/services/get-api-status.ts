import "server-only";

import { ApiError, toApiErrorView } from "@shared/http";
import { createServerApiClient } from "@shared/http/server";

import { isHealthResponse } from "../model/is-health-response";
import type { ApiStatusResult } from "../model/types";

export async function getApiStatus(): Promise<ApiStatusResult> {
  const source = process.env.API_MOCKS_ENABLED === "true" ? "mock" : "real";
  try {
    const client = await createServerApiClient();
    const response = await client.request<unknown>("health");
    if (!isHealthResponse(response.data))
      throw new ApiError("invalid-response", { requestId: response.requestId });
    return {
      ok: true,
      source,
      status: response.data.status,
      requestId: response.requestId,
    };
  } catch (error) {
    return { ok: false, source, error: toApiErrorView(error) };
  }
}
