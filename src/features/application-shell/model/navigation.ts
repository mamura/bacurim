import { organizationPath } from "@shared/organizations/resolution";
export const applicationNavigation = [
  { id: "home", label: "Início", suffix: "" },
  { id: "access", label: "Meu acesso", suffix: "/access" },
] as const;
export function navigationForOrganization(id: string) {
  return applicationNavigation.map((item) => ({
    ...item,
    href: organizationPath(id) + item.suffix,
  }));
}
