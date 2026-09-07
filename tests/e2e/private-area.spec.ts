import { expect, test } from "@playwright/test";

test.describe("observed private area", () => {
  test("empty companies dashboard preserves the captured contract", async ({ page }) => {
    await page.goto("/minha-area");
    await expect(page.getByText("PAINEL DE CONTROLE", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Minha Área", exact: true })).toBeVisible();
    await expect(page.getByText("Gerencie suas empresas e domínios verificados", { exact: true })).toBeVisible();

    for (const metric of ["Total de Domínios", "Domínios Verificados", "Landing Pages Ativas", "Novos este Mês"])
      await expect(page.getByText(metric, { exact: true })).toBeVisible();

    await expect(page.getByRole("heading", { name: "Minhas Empresas Ativas", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nenhuma empresa salva", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /Ir para Mineração/ })).toHaveAttribute("href", "/minerar");
    await expect(page.getByText("Dica Rápida", { exact: true })).toBeVisible();
  });

  test("white-label tab switches without a page reload", async ({ page }) => {
    await page.goto("/minha-area");
    await page.getByRole("button", { name: "Domínios Próprios (White Label)", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Conectar Domínio", exact: true })).toBeVisible();
    await expect(page.getByText("Nenhum domínio conectado", { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder("Ex: lp.minhaloja.com ou sualoja.com.br")).toBeVisible();
    await expect(page).toHaveURL(/\/minha-area$/);
  });

  test("account menu exposes only observed destinations", async ({ page }) => {
    await page.goto("/minha-area");
    await page.getByRole("button", { name: /nonton/ }).click();
    await expect(page.getByRole("link", { name: "Minerar CNPJs", exact: true })).toHaveAttribute("href", "/minerar");
    await expect(page.getByRole("link", { name: "Minha Área", exact: true })).toHaveAttribute("href", "/minha-area");
    await expect(page.getByRole("link", { name: "Minha Conta", exact: true })).toHaveAttribute("href", "/minha-conta");
    await expect(page.getByRole("link", { name: "Manual / Ajuda", exact: true })).toHaveAttribute("href", "/dashboard/docs");
  });
});
