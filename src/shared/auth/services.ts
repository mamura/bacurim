import { createBrowserApiClient } from "@shared/http/browser";

import { readAuthUser } from "./contracts";

export async function getAuthenticatedUser(signal?: AbortSignal) {
  const response = await createBrowserApiClient().request("api/v1/auth/me", {
    signal,
  });
  return readAuthUser(response.data);
}
