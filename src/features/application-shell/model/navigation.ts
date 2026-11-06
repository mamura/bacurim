import type { PresentationPermission } from "@shared/access/contracts";
import { canPresent } from "@shared/access/contracts";
import type { AuthorizedOrganization } from "@shared/organizations/contracts";
import { organizationPath } from "@shared/organizations/resolution";
export interface ApplicationNavigationItem {
  id: string;
  label: string;
  suffix: string;
  permission: PresentationPermission;
}
export const applicationNavigation: readonly ApplicationNavigationItem[] = [
  { id: "home", label: "Início", suffix: "", permission: "financial.read" },
  {
    id: "access",
    label: "Meu acesso",
    suffix: "/access",
    permission: "financial.read",
  },
];
export function visibleNavigation(
  items: readonly ApplicationNavigationItem[],
  organization: AuthorizedOrganization | null,
) {
  return items.filter((item) => canPresent(organization, item.permission));
}
export function navigationForOrganization(
  organization: AuthorizedOrganization,
) {
  return visibleNavigation(applicationNavigation, organization).map((item) => ({
    ...item,
    href: organizationPath(organization.public_id) + item.suffix,
  }));
}
