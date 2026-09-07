import { expect, test } from "@playwright/test";

test.describe("observed account surface", () => {
  test("renders current public plans and security controls", async ({ page }) => {
    await page.goto("/minha-conta");

    await expect(page.getByRole("heading", { name: "Minha Conta" })).toBeVisible();
    await expect(page.getByText("Gerencie seu plano e configurações de acesso")).toBeVisible();
    await expect(page.getByText("Nenhum plano ativo")).toBeVisible();

    await expect(page.getByRole("heading", { name: "Starter" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Professional" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Enterprise" })).toBeVisible();
    await expect(page.getByText("POPULAR")).toBeVisible();
    await expect(page.getByText("Pagamento via PIX · Renovação mensal")).toBeVisible();

    await expect(page.getByRole("heading", { name: /Alterar Email/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Alterar Senha/ })).toBeVisible();
  });

  test("exposes the observed authenticated destinations", async ({ page }) => {
    await page.goto("/minha-conta");
    await page.getByRole("button", { expanded: false }).click();

    await expect(page.getByRole("menuitem", { name: /Minerar CNPJs/ })).toHaveAttribute("href", "/minerar");
    await expect(page.getByRole("menuitem", { name: /Minha Área/ })).toHaveAttribute("href", "/minha-area");
    await expect(page.getByRole("menuitem", { name: /Minha Conta/ })).toHaveAttribute("href", "/minha-conta");
    await expect(page.getByRole("menuitem", { name: /Manual \/ Ajuda/ })).toHaveAttribute("href", "/dashboard/docs");
    await expect(page.getByRole("menuitem", { name: /Sair/ })).toBeVisible();
  });

  test("opens and closes the observed PIX loading modal", async ({ page }) => {
    await page.goto("/minha-conta");

    const professional = page.locator("article.account-plan", { hasText: "Professional" });
    await professional.getByRole("button", { name: /Pagar com PIX/ }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: "Pagar via PIX" })).toBeVisible();
    await expect(dialog.getByText("Professional · R$ 150,00/mês")).toBeVisible();
    await expect(dialog.getByText("Gerando dados do Pix...")).toBeVisible();

    await dialog.getByRole("button", { name: "Fechar", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("preserves observed password validation messages", async ({ page }) => {
    await page.goto("/minha-conta");
    await page.getByLabel("Nova senha", { exact: true }).fill("123456");
    await page.getByLabel("Confirmar nova senha", { exact: true }).fill("654321");
    await page.getByRole("button", { name: /Alterar Senha/ }).click();
    await expect(page.getByRole("status")).toHaveText("As senhas não coincidem");
  });
});
