import { expect, test } from "@playwright/test";

import { expectHome, fixtures, login, ORG_A } from "../helpers";
test.beforeEach(() => fixtures());
for (const account of ["empty", "consultant-empty"])
  test(account + " sem vínculo recebe estado apropriado", async ({ page }) => {
    await login(page, account);
    await expect(
      page.getByText("Nenhuma empresa disponível", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sair", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Trocar empresa" }),
    ).not.toBeVisible();
  });
for (const account of ["owner", "consultant-one"])
  test(account + " com um vínculo entra diretamente", async ({ page }) => {
    await login(page, account);
    await expectHome(page);
    await expect(page).toHaveURL(
      new RegExp("/app/organizations/" + ORG_A + "$"),
    );
    await expect(
      page.getByRole("button", { name: "Trocar empresa" }),
    ).not.toBeVisible();
    await page.reload();
    await expectHome(page);
    await expect(page.getByText("Escolha uma empresa")).not.toBeVisible();
  });
test("consultor seleciona, restaura e alterna empresas com papéis diferentes", async ({
  page,
}) => {
  await login(page, "consultant");
  await expect(
    page.getByRole("heading", { name: "Escolha uma empresa" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Acessar Empresa Alfa" }).click();
  await expectHome(page);
  await page.goto(page.url() + "/access");
  await expect(page.getByText("Leitor", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Leitor", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Trocar empresa" }).click();
  await page.getByRole("button", { name: "Acessar Empresa Beta" }).click();
  await expectHome(page);
  await expect(page.getByRole("banner")).toContainText("Empresa Beta");
  await page.goto(page.url() + "/access");
  await expect(page.getByText("Administrador", { exact: true })).toBeVisible();
  await expect(page.getByText("Leitor", { exact: true })).not.toBeVisible();
  await expect(
    page.getByText("Empresa Alfa", { exact: true }),
  ).not.toBeVisible();
});
test("vínculo revogado não pode ser restaurado por URL antiga", async ({
  page,
}) => {
  await login(page, "consultant");
  await page.getByRole("button", { name: "Acessar Empresa Alfa" }).click();
  await expectHome(page);
  fixtures("revoke");
  await page.reload();
  await expect(
    page.getByText("Ambiente indisponível", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Bem-vindo ao seu espaço" }),
  ).not.toBeVisible();
  await page.getByRole("link", { name: "Voltar às empresas" }).click();
  await expectHome(page);
  await expect(page.getByRole("banner")).toContainText("Empresa Beta");
});
