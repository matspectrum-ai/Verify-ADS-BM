import { expect, test } from "@playwright/test";

test.describe("observed public routes", () => {
  test("login reproduces the captured public form contract", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Bem-vindo de volta", exact: true })).toBeVisible();
    await expect(page.getByText("Acesse sua conta VerifyAds", { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder("seu@email.com")).toHaveAttribute("type", "email");
    await expect(page.getByPlaceholder("••••••••")).toHaveAttribute("type", "password");
    await expect(page.getByRole("button", { name: "Entrar na Minha Conta", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Criar conta grátis", exact: true })).toHaveAttribute("href", "/cadastro");
    await expect(page.getByRole("link", { name: "← Voltar ao início", exact: true })).toHaveAttribute("href", "/");
  });

  test("signup reproduces the captured public form contract", async ({ page }) => {
    await page.goto("/cadastro");
    await expect(page.getByRole("heading", { name: "Criar conta gratuita", exact: true })).toBeVisible();
    await expect(page.getByText("Sem cartão de crédito • Configuração em 3 minutos", { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder("Seu nome")).toHaveAttribute("type", "text");
    await expect(page.getByPlaceholder("seu@email.com")).toHaveAttribute("type", "email");
    const passwordFields = page.getByPlaceholder("••••••••");
    await expect(passwordFields).toHaveCount(2);
    await expect(passwordFields.nth(0)).toHaveAttribute("type", "password");
    await expect(passwordFields.nth(1)).toHaveAttribute("type", "password");
    await expect(page.getByRole("button", { name: "Criar Minha Conta Grátis", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Fazer login", exact: true })).toHaveAttribute("href", "/login");
    await expect(page.getByRole("link", { name: "← Voltar ao início", exact: true })).toHaveAttribute("href", "/");
  });

  test("privacy route reproduces the captured content", async ({ page }) => {
    await page.goto("/l/privacidade");
    await expect(page.getByRole("heading", { name: "Política de Privacidade", exact: true })).toBeVisible();
    await expect(page.getByText("Última atualização: 9/2/2026", { exact: true })).toBeVisible();
    for (const heading of ["1. Coleta de Informações", "2. Uso das Informações", "3. Cookies e Tecnologias de Rastreamento", "4. Compartilhamento de Dados", "5. Segurança", "6. Seus Direitos (LGPD)"])
      await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "← Voltar para a Página Inicial", exact: true })).toHaveAttribute("href", "/");
  });

  test("terms route reproduces the captured content", async ({ page }) => {
    await page.goto("/l/termos");
    await expect(page.getByRole("heading", { name: "Termos de Uso", exact: true })).toBeVisible();
    await expect(page.getByText("Última atualização: 9/2/2026", { exact: true })).toBeVisible();
    for (const heading of ["1. Aceitação dos Termos", "2. Natureza Informativa e Comercial", "3. Propriedade Intelectual", "4. Uso Aceitável", "5. Limitação de Responsabilidade", "6. Alterações"])
      await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "← Voltar para a Página Inicial", exact: true })).toHaveAttribute("href", "/");
  });
});
