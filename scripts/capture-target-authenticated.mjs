import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const TARGET_ORIGIN = process.env.TARGET_ORIGIN ?? "https://score-scanner-7q2s.vercel.app";
const EMAIL = process.env.TARGET_TEST_EMAIL;
const PASSWORD = process.env.TARGET_TEST_PASSWORD;
const OUTPUT = path.resolve(process.env.AUTH_EVIDENCE_OUTPUT ?? "auth-evidence-private");
const MAX_ROUTES = Number(process.env.AUTH_MAX_ROUTES ?? 30);

if (!EMAIL || !PASSWORD) {
  console.error("Missing TARGET_TEST_EMAIL or TARGET_TEST_PASSWORD.");
  process.exit(2);
}

const forbiddenRoutePattern = /(logout|sair|delete|remove|destroy|cancel|checkout|payment|billing|subscribe|upgrade)/i;
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: "pt-BR" });
const page = await context.newPage();

await mkdir(OUTPUT, { recursive: true });

function safePathname(rawHref) {
  try {
    const url = new URL(rawHref, TARGET_ORIGIN);
    if (url.origin !== TARGET_ORIGIN) return null;
    if (url.pathname === "/login" || url.pathname === "/cadastro") return null;
    if (forbiddenRoutePattern.test(`${url.pathname}${url.search}`)) return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

function redact(value) {
  if (!value) return value;
  return String(value)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/\b\d{11,14}\b/g, "[id]")
    .replace(/\b(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+\b/gi, "[domain]")
    .slice(0, 180);
}

try {
  await page.goto(`${TARGET_ORIGIN}/login`, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.getByPlaceholder("seu@email.com").fill(EMAIL);
  await page.getByPlaceholder("••••••••").fill(PASSWORD);
  await Promise.all([
    page.waitForLoadState("domcontentloaded").catch(() => {}),
    page.getByRole("button", { name: /entrar/i }).click(),
  ]);
  await page.waitForTimeout(1200);

  const authenticatedUrl = new URL(page.url());
  if (authenticatedUrl.pathname === "/login") {
    throw new Error("Authentication did not leave /login. Check credentials or target behavior.");
  }

  const pending = [authenticatedUrl.pathname + authenticatedUrl.search];
  const visited = new Set();
  const routeMap = [];

  while (pending.length && visited.size < MAX_ROUTES) {
    const route = pending.shift();
    if (!route || visited.has(route) || forbiddenRoutePattern.test(route)) continue;
    visited.add(route);

    const response = await page.goto(`${TARGET_ORIGIN}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    await page.waitForTimeout(500);

    if (page.url().startsWith(`${TARGET_ORIGIN}/login`)) continue;

    const structural = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll("a,button,input,select,textarea,[role]"));
      return {
        title: document.title,
        headings: Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((el) => ({
          level: Number(el.tagName.slice(1)),
          text: el.textContent?.trim() ?? "",
        })),
        interactive: items.map((el) => ({
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.trim() ?? "",
          href: el instanceof HTMLAnchorElement ? el.getAttribute("href") : null,
          type: el instanceof HTMLInputElement || el instanceof HTMLButtonElement ? el.type : null,
          placeholder: el.getAttribute("placeholder"),
          ariaLabel: el.getAttribute("aria-label"),
        })),
      };
    });

    const links = structural.interactive
      .map((item) => item.href)
      .filter(Boolean)
      .map(safePathname)
      .filter(Boolean);

    for (const link of links) {
      if (!visited.has(link) && !pending.includes(link)) pending.push(link);
    }

    routeMap.push({
      path: new URL(page.url()).pathname,
      status: response?.status() ?? null,
      title: redact(structural.title),
      headings: structural.headings.map((heading) => ({ ...heading, text: redact(heading.text) })),
      interactive: structural.interactive.map((item) => ({
        ...item,
        text: redact(item.text),
        href: item.href ? safePathname(item.href) : null,
      })),
    });
  }

  await writeFile(
    path.join(OUTPUT, "route-map.json"),
    JSON.stringify({ targetOrigin: TARGET_ORIGIN, capturedAt: new Date().toISOString(), routes: routeMap }, null, 2),
    "utf8",
  );

  console.log(`Authenticated discovery complete: ${routeMap.length} safe GET routes captured.`);
  console.log(`Private output: ${OUTPUT}`);
} finally {
  await context.close();
  await browser.close();
}
