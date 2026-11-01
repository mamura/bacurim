import { ApiError } from "./api-error.ts";
import { normalizeProblemDetails, safeRequestId } from "./problem-details.ts";

export async function readHttpError(
  response: Response,
  fallbackRequestId?: string,
): Promise<ApiError> {
  let payload: unknown;
  const type = response.headers.get("content-type")?.split(";")[0].trim();
  try {
    const text = await response.text();
    if (type === "application/problem+json") payload = JSON.parse(text);
  } catch {
    // Preserve HTTP status even for a malformed error body.
  }
  return new ApiError("http", {
    status: response.status,
    requestId:
      safeRequestId(response.headers.get("X-Request-ID")) ?? fallbackRequestId,
    ...normalizeProblemDetails(payload, response.status),
  });
}
