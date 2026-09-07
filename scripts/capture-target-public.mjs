import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const TARGET_ORIGIN = "https://score-scanner-7q2s.vercel.app";
const OUTPUT = path.resolve("target-evidence");
const routes = [
  { id: "home", path: "/" },
  { id: "login", path: "/login" },
  { id: "signup", path: "/cadastro" },
  { id: "privacy", path: "/l/privacidade" },
  { id: "terms", path: "/l/termos" },
];
const viewports = [
  { id: "desktop", width: 1440, height: 1000 },
  { id: "mobile", width: 390, height: 844 },
];

await mkdir(OUTPUT, { recursive: true });
const browser = await chromium.launch({ headless: true });
const runSummary = {
  targetOrigin: TARGET_ORIGIN,
  capturedAt: new Date().toISOString(),
  routes: [],
};

async function revealScrollAnimations(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const step = Math.max(480, Math.floor(viewportHeight * 0.72));
  for (let y = 0; y <= height; y += step) {
    await page.evaluate((position) => window.scrollTo({ top: position, behavior: "instant" }), y);
    await page.waitForTimeout(260);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(700);
}

for (const route of routes) {
  const routeSummary = { id: route.id, path: route.path, captures: [] };

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      locale: "pt-BR",
    });
    const page = await context.newPage();
    const requests = [];
    const consoleMessages = [];

    page.on("request", (request) => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType(),
      });
    });
    page.on("console", (message) => {
      consoleMessages.push({ type: message.type(), text: message.text() });
    });

    const prefix = `${route.id}-${viewport.id}`;
    const result = {
      viewport,
      ok: false,
      status: null,
      finalUrl: null,
      title: null,
      error: null,
    };

    try {
      const response = await page.goto(`${TARGET_ORIGIN}${route.path}`, {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });
      await page.waitForTimeout(1500);
      await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});

      result.status = response?.status() ?? null;
      result.finalUrl = page.url();
      result.title = await page.title();
      result.ok = Boolean(response?.ok());

      if (route.id === "home") await revealScrollAnimations(page);

      await page.screenshot({
        path: path.join(OUTPUT, `${prefix}.png`),
        fullPage: true,
      });

      if (viewport.id === "desktop") {
        const html = await page.content();
        const text = await page.locator("body").innerText().catch(() => "");
        const dom = await page.evaluate(() => {
          const clean = (value) => (value == null ? null : String(value));
          const selectorHint = (el) => {
            if (el.id) return `#${el.id}`;
            const cls = Array.from(el.classList || []).slice(0, 4).join(".");
            return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ""}`;
          };
          const interactive = Array.from(
            document.querySelectorAll("a,button,input,select,textarea,[role],[tabindex]")
          ).map((el) => ({
            tag: el.tagName.toLowerCase(),
            text: clean(el.textContent)?.trim().slice(0, 300) ?? "",
            href: el instanceof HTMLAnchorElement ? el.getAttribute("href") : null,
            type: el instanceof HTMLInputElement || el instanceof HTMLButtonElement ? el.type : null,
            name: el.getAttribute("name"),
            placeholder: el.getAttribute("placeholder"),
            ariaLabel: el.getAttribute("aria-label"),
            role: el.getAttribute("role"),
            selectorHint: selectorHint(el),
          }));
          const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((el) => ({
            level: Number(el.tagName.slice(1)),
            text: clean(el.textContent)?.trim() ?? "",
            selectorHint: selectorHint(el),
          }));
          const images = Array.from(document.images).map((img) => ({
            src: img.currentSrc || img.src,
            alt: img.alt,
            width: img.naturalWidth,
            height: img.naturalHeight,
          }));
          const stylesheetHrefs = Array.from(document.styleSheets).map((sheet) => sheet.href);
          const cssRules = [];
          for (const sheet of Array.from(document.styleSheets)) {
            try {
              for (const rule of Array.from(sheet.cssRules || [])) cssRules.push(rule.cssText);
            } catch {}
          }
          const rootStyle = getComputedStyle(document.documentElement);
          const cssVariables = {};
          for (const name of Array.from(rootStyle)) {
            if (name.startsWith("--")) cssVariables[name] = rootStyle.getPropertyValue(name).trim();
          }
          const sampledStyles = Array.from(document.querySelectorAll("header,nav,main,section,footer,h1,h2,h3,p,a,button,input"))
            .slice(0, 220)
            .map((el) => {
              const style = getComputedStyle(el);
              const rect = el.getBoundingClientRect();
              return {
                selectorHint: selectorHint(el),
                tag: el.tagName.toLowerCase(),
                text: clean(el.textContent)?.trim().replace(/\s+/g, " ").slice(0, 160) ?? "",
                rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
                style: {
                  display: style.display,
                  position: style.position,
                  color: style.color,
                  backgroundColor: style.backgroundColor,
                  fontFamily: style.fontFamily,
                  fontSize: style.fontSize,
                  fontWeight: style.fontWeight,
                  lineHeight: style.lineHeight,
                  letterSpacing: style.letterSpacing,
                  border: style.border,
                  borderRadius: style.borderRadius,
                  boxShadow: style.boxShadow,
                  padding: style.padding,
                  margin: style.margin,
                  gap: style.gap,
                  opacity: style.opacity,
                  transform: style.transform,
                },
              };
            });
          return {
            lang: document.documentElement.lang,
            bodyClass: document.body.className,
            headings,
            interactive,
            images,
            stylesheetHrefs,
            cssVariables,
            cssRules,
            sampledStyles,
            storageKeys: {
              localStorage: Object.keys(localStorage),
              sessionStorage: Object.keys(sessionStorage),
            },
          };
        });

        const cookies = await context.cookies();
        const metadata = {
          ...result,
          dom,
          cookieNames: cookies.map((cookie) => cookie.name),
          requests: requests.slice(0, 1200),
          consoleMessages: consoleMessages.slice(0, 300),
        };

        await writeFile(path.join(OUTPUT, `${route.id}.html`), html, "utf8");
        await writeFile(path.join(OUTPUT, `${route.id}.txt`), text, "utf8");
        await writeFile(path.join(OUTPUT, `${route.id}.json`), JSON.stringify(metadata, null, 2), "utf8");
        await writeFile(path.join(OUTPUT, `${route.id}.css.txt`), dom.cssRules.join("\n\n"), "utf8");
      }
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
    }

    routeSummary.captures.push(result);
    await context.close();
  }

  runSummary.routes.push(routeSummary);
}

await writeFile(path.join(OUTPUT, "summary.json"), JSON.stringify(runSummary, null, 2), "utf8");
await browser.close();
console.log(JSON.stringify(runSummary, null, 2));
