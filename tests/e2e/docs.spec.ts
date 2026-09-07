import { expect, test } from "@playwright/test";

test.describe("observed help center", () => {
  test("renders the public help route and switches observed steps", async ({ page }) => {
    await page.goto("/dashboard/docs");
    await expect(page.getByRole("heading", { name: "Central de Ajuda", exact: true })).toBeVisible();
    await expect(page.locator("strong").filter({ hasText: "Tudo acontece dentro do VerifyAds" })).toBeVisible();
    await page.getByRole("button", { name: "2. Gerar PDF", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Gerar o PDF para Verificação por SMS", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "3. Landing Page", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Gerar o Site da Empresa no Seu Domínio", exact: true })).toBeVisible();
  });

  test("opens observed FAQ content", async ({ page }) => {
    await page.goto("/dashboard/docs");
    const q = page.locator("#faq button").first();
    await q.click();
    await expect(page.getByText("Não! O VerifyAds gera o PDF", { exact: false })).toBeVisible();
  });
});
