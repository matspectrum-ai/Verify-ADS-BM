import { expect, test } from "@playwright/test";

test("mineração consulta a API interna e renderiza empresa ativa", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("verifyads_welcome_seen", "1"));
  await page.route("**/api/cnpj?cnpj=*", async route => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        cnpj: "00000000000191",
        razao_social: "Empresa Exemplo LTDA",
        nome_fantasia: "Exemplo Ads",
        situacao_cadastral: 2,
        ativa: true,
        capital_social: 12000,
        municipio: "Santarém",
        uf: "PA"
      })
    });
  });
  await page.goto("/minerar");
  await page.getByRole("button", { name: /MINERAR DADOS REAIS/ }).click();
  await expect(page.getByRole("heading", { name: "Empresas encontradas" })).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("Exemplo Ads", { exact: true })).toBeVisible();
  await expect(page.getByText("R$ 12.000,00", { exact: true })).toBeVisible();
});
