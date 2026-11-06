import AxeBuilder from "@axe-core/playwright";
import type { Page, TestInfo } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { expectHome, fixtures, login } from "../helpers";
test.beforeEach(() => fixtures());

async function audit(page: Page, testInfo: TestInfo, name: string) {
  await page.screenshot({
    path: testInfo.outputPath(name + ".png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  await testInfo.attach(name + "-axe", {
    body: JSON.stringify(result.violations, null, 2),
    contentType: "application/json",
  });
  expect(
    result.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
  ).toEqual([]);
}
test("login acessível, validação e operação pelo teclado", async ({
  page,
}, testInfo) => {
  await page.goto("/login");
  await audit(page, testInfo, "login");
  await page.getByLabel("E-mail", { exact: true }).focus();
  await page.keyboard.type("owner@e2e.test");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Senha", { exact: true })).toBeFocused();
  await page.keyboard.type("E2e-only-password!42");
  await page.keyboard.press("Enter");
  await expectHome(page);
});
test("seleção, shell, navegação móvel e acesso sem overflow", async ({
  page,
}, testInfo) => {
  await login(page, "consultant");
  await expect(
    page.getByRole("heading", { name: "Escolha uma empresa" }),
  ).toBeVisible();
  await audit(page, testInfo, "selection");
  await page.getByRole("button", { name: "Acessar Empresa Alfa" }).click();
  await expectHome(page);
  await audit(page, testInfo, "shell");
  if (testInfo.project.name === "mobile") {
    const menu = page.getByRole("button", { name: "Abrir navegação" });
    await menu.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(menu).toBeFocused();
    await menu.click();
  }
  await page.getByRole("link", { name: "Meu acesso", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Meu acesso" })).toBeVisible();
  await audit(page, testInfo, "access");
});
test("ausência de empresa tem título e feedback acessível", async ({
  page,
}, testInfo) => {
  await login(page, "empty");
  await expect(
    page.getByText("Nenhuma empresa disponível", { exact: true }),
  ).toBeVisible();
  await audit(page, testInfo, "empty");
});
