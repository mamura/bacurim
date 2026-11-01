import { ApiError } from "./api-error.ts";
import { normalizeProblemDetails, safeRequestId } from "./problem-details.ts";

export async function readHttpError(response: Response): Promise<ApiError> {
  let payload: unknown;
  const type = response.headers.get("content-type")?.split(";")[0].trim();
  if (type === "application/problem+json") {
    try {
      payload = await response.json();
    } catch {
      /* Preserve HTTP status even for a malformed error body. */
    }
  }
  return new ApiError("http", {
    status: response.status,
    requestId: safeRequestId(response.headers.get("X-Request-ID")),
    ...normalizeProblemDetails(payload, response.status),
  });
}
