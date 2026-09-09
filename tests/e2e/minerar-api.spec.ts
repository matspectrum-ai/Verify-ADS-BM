import { expect, test } from "@playwright/test";

test("mineração consulta a API interna e renderiza empresa ativa", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("verifyads_welcome_seen", "1");
    localStorage.removeItem("cnpj_whitelist");
    localStorage.removeItem("cnpj_blacklist");
    localStorage.removeItem("cnpj_used");
  });
  await page.route("**/api/cnpj?cnpj=*", async route => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("cnpj") !== "00000000000191") {
      await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ error: "not found" }) });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        cnpj: "00000000000191",
        razao_social: "Empresa Exemplo LTDA",
        nome_fantasia: "Exemplo Ads",
        situacao_cadastral: 2,
        tipo_situacao_cadastral: "ATIVA",
        ativa: true,
        trust_score: 75,
        capital_social: 12000,
        municipio: "Santarém",
        uf: "PA"
      })
    });
  });
  await page.goto("/minerar");
  await page.getByRole("button", { name: /MINERAR DADOS REAIS/ }).click();
  await expect(page.getByRole("heading", { name: "Empresas Encontradas" })).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("Empresa Exemplo LTDA", { exact: true })).toBeVisible();
  await expect(page.getByText("R$ 12.000,00", { exact: true })).toBeVisible();
  await expect(page.getByText("75 · Trust Score", { exact: true })).toBeVisible();
  await page.getByText("Empresa Exemplo LTDA", { exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Detalhes da empresa" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Detalhes da empresa" }).getByRole("heading", { name: "Empresa Exemplo LTDA", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Salvar empresa", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Detalhes da empresa" })).toHaveCount(0);
  await expect(page.getByText("Empresa Exemplo LTDA", { exact: true })).toHaveCount(0);
});
