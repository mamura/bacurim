import type {
  AuthorizedOrganization,
  OrganizationRole,
} from "@shared/organizations/contracts";
export type PresentationPermission =
  | "financial.read"
  | "financial.write"
  | "members.read"
  | "members.manage"
  | "settings.manage"
  | "ownership.manage";
export const roleLabels: Record<OrganizationRole, string> = {
  owner: "Responsável",
  admin: "Administrador",
  member: "Membro",
  viewer: "Leitor",
  unknown: "Acesso não reconhecido",
};
export const presentationMatrix: Record<
  OrganizationRole,
  readonly PresentationPermission[]
> = {
  owner: [
    "financial.read",
    "financial.write",
    "members.read",
    "members.manage",
    "settings.manage",
    "ownership.manage",
  ],
  admin: [
    "financial.read",
    "financial.write",
    "members.read",
    "members.manage",
    "settings.manage",
  ],
  member: ["financial.read", "financial.write"],
  viewer: ["financial.read"],
  unknown: [],
};
export function canPresent(
  organization: AuthorizedOrganization | null | undefined,
  permission: PresentationPermission,
  expectedOrganizationId?: string,
): boolean {
  if (
    !organization ||
    (expectedOrganizationId &&
      organization.public_id !== expectedOrganizationId)
  )
    return false;
  return presentationMatrix[organization.role]?.includes(permission) ?? false;
}
