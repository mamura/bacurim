import { isRecord } from "@shared/auth/contracts";
import { ApiError } from "@shared/http";
export type OrganizationRole =
  "owner" | "admin" | "member" | "viewer" | "unknown";
export interface AuthorizedOrganization {
  public_id: string;
  name: string;
  role: OrganizationRole;
  membership_public_id: string;
}
export function readOrganizations(value: unknown): AuthorizedOrganization[] {
  if (!isRecord(value) || !Array.isArray(value.data))
    throw new ApiError("invalid-response");
  const result = value.data.map((item: unknown) => {
    if (
      !isRecord(item) ||
      typeof item.public_id !== "string" ||
      !/^[a-zA-Z0-9-]+$/.test(item.public_id) ||
      typeof item.name !== "string" ||
      typeof item.role !== "string" ||
      typeof item.membership_public_id !== "string"
    )
      throw new ApiError("invalid-response");
    return {
      public_id: item.public_id,
      name: item.name,
      membership_public_id: item.membership_public_id,
      role: (["owner", "admin", "member", "viewer"].includes(item.role)
        ? item.role
        : "unknown") as OrganizationRole,
    };
  });
  if (new Set(result.map((item) => item.public_id)).size !== result.length)
    throw new ApiError("invalid-response");
  return result;
}
