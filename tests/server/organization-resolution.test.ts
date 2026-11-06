import { resolveOrganization } from "@shared/organizations/resolution";
import { expect, test } from "vitest";
const org = {
  public_id: "org-1",
  name: "Empresa",
  role: "owner" as const,
  membership_public_id: "m-1",
};
test.each(["standard", "consultant"] as const)(
  "%s acessa vínculo único sem seleção",
  (profile) => {
    expect(resolveOrganization([org], profile)).toEqual({
      kind: "direct",
      organization: org,
    });
    expect(resolveOrganization([], profile).kind).toBe("empty");
  },
);
test("somente consultor pode selecionar múltiplos vínculos", () => {
  expect(
    resolveOrganization([org, { ...org, public_id: "org-2" }], "consultant")
      .kind,
  ).toBe("choose");
  expect(
    resolveOrganization([org, { ...org, public_id: "org-2" }], "standard").kind,
  ).toBe("inconsistent");
});
