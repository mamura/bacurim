import { authenticatedRequest } from "@shared/auth/authenticated-request";

import { readOrganizations } from "./contracts";
export async function getAuthorizedOrganizations(signal?: AbortSignal) {
  const response = await authenticatedRequest("api/v1/auth/organizations", {
    signal,
  });
  return readOrganizations(response.data);
}
