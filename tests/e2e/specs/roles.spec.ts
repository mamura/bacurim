import { expect, test } from "@playwright/test";

import {
  apiRequest,
  expectHome,
  fixtures,
  login,
  ORG_A,
  ORG_B,
} from "../helpers";
test.beforeEach(() => fixtures());
for (const [account, label, status] of [
  ["owner", "Responsável", 200],
  ["admin", "Administrador", 200],
  ["member", "Membro", 403],
  ["viewer", "Leitor", 403],
] as const)
  test(
    account + " respeita contrato empresarial sem confundir 403 com logout",
    async ({ page, context }) => {
      await login(page, account);
      await expectHome(page);
      await page.goto("/app/organizations/" + ORG_A + "/access");
      await expect(page.getByText(label, { exact: true })).toBeVisible();
      expect(
        (
          await apiRequest(
            context,
            "/api/v1/organizations/" + ORG_A + "/members",
          )
        ).status(),
      ).toBe(status);
      expect((await apiRequest(context, "/api/v1/auth/me")).status()).toBe(200);
      const foreign = await apiRequest(
        context,
        "/api/v1/organizations/" + ORG_B + "/members",
      );
      expect(foreign.status()).toBe(403);
      const absent = await apiRequest(
        context,
        "/api/v1/organizations/90000000-0000-4000-8000-000000000000/members",
      );
      expect(absent.status()).toBe(404);
      await page.goto("/app/organizations/" + ORG_B);
      await expect(
        page.getByText("Ambiente indisponível", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText("Empresa Beta", { exact: true }),
      ).not.toBeVisible();
      expect((await apiRequest(context, "/api/v1/auth/me")).status()).toBe(200);
    },
  );
test("consultor não transporta privilégios entre empresas", async ({
  page,
  context,
}) => {
  await login(page, "consultant");
  await page.getByRole("button", { name: "Acessar Empresa Alfa" }).click();
  await expectHome(page);
  expect(
    (
      await apiRequest(context, "/api/v1/organizations/" + ORG_A + "/members")
    ).status(),
  ).toBe(403);
  expect(
    (
      await apiRequest(context, "/api/v1/organizations/" + ORG_B + "/members")
    ).status(),
  ).toBe(200);
  await page.goto("/app/organizations/" + ORG_A + "/access");
  await expect(page.getByText("Leitor", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Administrador", { exact: true }),
  ).not.toBeVisible();
});
