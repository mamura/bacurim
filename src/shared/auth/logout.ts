import { ApiError } from "@shared/http";
import { createBrowserApiClient } from "@shared/http/browser";

import { authenticatedRequest } from "./authenticated-request";

export async function logoutSession() {
  await createBrowserApiClient().request("sanctum/csrf-cookie");
  try {
    await authenticatedRequest("api/v1/auth/logout", { method: "POST" });
  } catch (error) {
    if (!(error instanceof ApiError && error.status === 401)) throw error;
  }
}
