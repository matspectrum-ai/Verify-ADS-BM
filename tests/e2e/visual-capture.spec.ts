import { mkdir } from "node:fs/promises";
import path from "node:path";
import { test } from "@playwright/test";

const OUTPUT = path.resolve("local-evidence");
const routes = [
  { id: "home", path: "/" },
  { id: "login", path: "/login" },
  { id: "signup", path: "/cadastro" },
] as const;
const viewports = [
  { id: "desktop", width: 1440, height: 1000 },
  { id: "mobile", width: 390, height: 844 },
] as const;

test("capture local public routes at target viewports", async ({ page }) => {
  await mkdir(OUTPUT, { recursive: true });

  for (const route of routes) {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(route.path, { waitUntil: "networkidle" });
      await page.screenshot({
        path: path.join(OUTPUT, `${route.id}-${viewport.id}.png`),
        fullPage: true,
        animations: "disabled",
      });
    }
  }
});
