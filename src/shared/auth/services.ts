import { authenticatedRequest } from "./authenticated-request";
import { readAuthUser } from "./contracts";

export async function getAuthenticatedUser(signal?: AbortSignal) {
  const response = await authenticatedRequest("api/v1/auth/me", {
    signal,
  });
  return readAuthUser(response.data);
}
