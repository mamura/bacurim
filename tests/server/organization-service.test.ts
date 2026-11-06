import { readOrganizations } from "@shared/organizations/contracts";
import { getAuthorizedOrganizations } from "@shared/organizations/services";
import { expect, test, vi } from "vitest";
test("preserva campos reais do membership sem inventar status", async () => {
  const organization = {
    public_id: "org-1",
    name: "Empresa",
    role: "viewer",
    membership_public_id: "membership-1",
  };
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(Response.json({ data: [organization] })),
  );
  expect(await getAuthorizedOrganizations()).toEqual([organization]);
  expect(readOrganizations({ data: [] })).toEqual([]);
});
test("falha fechada para papel desconhecido e payload inválido", () => {
  expect(
    readOrganizations({
      data: [
        {
          public_id: "org-1",
          name: "Empresa",
          role: "root",
          membership_public_id: "m1",
        },
      ],
    })[0].role,
  ).toBe("unknown");
  expect(() =>
    readOrganizations({ data: [{ public_id: "../other" }] }),
  ).toThrow();
});
