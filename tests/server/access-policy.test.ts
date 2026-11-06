import { canPresent, presentationMatrix } from "@shared/access/contracts";
import type { OrganizationRole } from "@shared/organizations/contracts";
import { expect, test } from "vitest";
test.each(["owner", "admin", "member", "viewer", "unknown"] as const)(
  "papel %s deriva capacidades apenas do vínculo",
  (role: OrganizationRole) => {
    const organization = {
      public_id: "org-1",
      name: "Empresa",
      role,
      membership_public_id: "m1",
    };
    for (const permission of [
      "financial.read",
      "financial.write",
      "members.read",
      "members.manage",
      "settings.manage",
      "ownership.manage",
    ] as const)
      expect(canPresent(organization, permission)).toBe(
        presentationMatrix[role].includes(permission),
      );
    expect(canPresent(organization, "financial.read", "org-2")).toBe(false);
  },
);
test("ausência de contexto não concede apresentação", () =>
  expect(canPresent(null, "financial.read")).toBe(false));
test("restrições de viewer e admin preservam a matriz da API", () => {
  const base = {
    public_id: "org-1",
    name: "Empresa",
    membership_public_id: "m1",
  };
  expect(canPresent({ ...base, role: "viewer" }, "financial.write")).toBe(
    false,
  );
  expect(canPresent({ ...base, role: "admin" }, "ownership.manage")).toBe(
    false,
  );
});
