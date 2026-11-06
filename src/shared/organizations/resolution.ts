import type { UserProfile } from "@shared/auth/contracts";

import type { AuthorizedOrganization } from "./contracts";
export function resolveOrganization(
  organizations: readonly AuthorizedOrganization[],
  profile: UserProfile,
) {
  if (organizations.length === 0) return { kind: "empty" as const };
  if (organizations.length === 1)
    return { kind: "direct" as const, organization: organizations[0] };
  return {
    kind:
      profile === "consultant"
        ? ("choose" as const)
        : ("inconsistent" as const),
  };
}
export function organizationPath(id: string) {
  return "/app/organizations/" + encodeURIComponent(id);
}
