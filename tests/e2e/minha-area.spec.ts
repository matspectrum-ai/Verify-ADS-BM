import { expect, test } from "@playwright/test";

test.describe("authenticated dashboard surface", () => {
  test("matches the observed empty-account contract", async ({ page }) => {
    await page.goto("/minha-area");

    await expect(page.getByRole("heading", { name: "Minha Área" })).toBeVisible();
    await expect(page.getByText("Gerencie suas empresas e domínios verificados")).toBeVisible();
    await expect(page.getByText("Total de Domínios")).toBeVisible();
    await expect(page.getByText("Domínios Verificados", { exact: true })).toBeVisible();
    await expect(page.getByText("Landing Pages Ativas")).toBeVisible();
    await expect(page.getByText("Novos este Mês")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Minhas Empresas Ativas/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nenhuma empresa salva" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Ir para Mineração/ })).toBeVisible();
  });
});
