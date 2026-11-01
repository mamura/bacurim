import type { HealthResponse } from "@shared/http/contracts";

export function isHealthResponse(value: unknown): value is HealthResponse {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "status" in value &&
    value.status === "ok"
  );
}
