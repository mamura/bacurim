import {
  navigationForOrganization,
  visibleNavigation,
} from "@features/application-shell/model/navigation";
import type { OrganizationRole } from "@shared/organizations/contracts";
import { expect, test } from "vitest";
test.each(["owner", "admin", "member", "viewer"] as const)(
  "navegação %s não inventa módulos indisponíveis",
  (role: OrganizationRole) => {
    const org = {
      public_id: "org-1",
      name: "Empresa",
      role,
      membership_public_id: "m1",
    };
    expect(navigationForOrganization(org).map((item) => item.id)).toEqual([
      "home",
      "access",
    ]);
    const adminItems = [
      {
        id: "future",
        label: "Administrar",
        suffix: "/future",
        permission: "members.manage" as const,
      },
    ];
    expect(visibleNavigation(adminItems, org)).toHaveLength(
      ["owner", "admin"].includes(role) ? 1 : 0,
    );
  },
);
test("navegação falha fechada sem contexto ou papel reconhecido", () => {
  expect(
    visibleNavigation(
      [
        {
          id: "home",
          label: "Início",
          suffix: "",
          permission: "financial.read",
        },
      ],
      null,
    ),
  ).toEqual([]);
  expect(
    navigationForOrganization({
      public_id: "org-1",
      name: "Empresa",
      role: "unknown",
      membership_public_id: "m1",
    }),
  ).toEqual([]);
});
