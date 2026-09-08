import { expect, test } from "@playwright/test";

test.describe("observed mining surface", () => {
  test("first visit shows the target onboarding guide", async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem("verifyads_welcome_seen"));
    await page.goto("/minerar");
    await expect(page.getByRole("heading", { name: "Antes de começar, confira nosso guia 👋", exact: true })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Bem-vindo ao VerifyAds!", { exact: true })).toBeVisible();
    await expect(page.getByText("Encontre o menu pelo ícone ☰", { exact: true })).toBeVisible();
    await expect(page.getByText("Leia o manual antes de usar", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /Abrir Central de Ajuda/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Já sei usar — começar a mineração", exact: true })).toBeVisible();
  });

  test("idle and running states preserve observed copy", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("verifyads_welcome_seen", "1"));
    await page.goto("/minerar");
    await expect(page.getByText("V91", { exact: true })).toBeVisible();
    await expect(page.getByText("Empresas reais. Anúncios seguros", { exact: true })).toBeVisible();
    await expect(page.getByText("20 empresas ATIVAS", { exact: true })).toBeVisible();
    await expect(page.getByText("R$ 20.000", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /MINERAR DADOS REAIS/ })).toBeVisible();
    await expect(page.getByText('Configure os filtros e clique em "MINERAR DADOS REAIS"', { exact: true })).toBeVisible();

    await page.getByRole("button", { name: /MINERAR DADOS REAIS/ }).click();
    await expect(page.getByText("Minerando empresas...", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Parar", exact: true })).toBeVisible();
    await expect(page.getByText("Progresso:", { exact: true })).toBeVisible();
    await expect(page.getByText(/CNPJs testados$/)).toBeVisible();
    await page.getByRole("button", { name: "Parar", exact: true }).click();
    await expect(page.getByText('Configure os filtros e clique em "MINERAR DADOS REAIS"', { exact: true })).toBeVisible();
  });
});
