import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = process.env.TARGET_ORIGIN ?? "https://score-scanner-7q2s.vercel.app";
const OUTPUT = path.resolve("target-static-hints");
const routes = ["/", "/login", "/cadastro"];
const interesting = /(api|auth|login|sign|cadastro|register|dashboard|painel|dom[ií]nio|domain|dns|billing|checkout|payment|plan|subscription|account|conta|user|settings|config|pixel|webhook)/i;

await mkdir(OUTPUT, { recursive: true });

const routeResults = [];
const globalScripts = new Map();

for (const route of routes) {
  const response = await fetch(`${ORIGIN}${route}`, { redirect: "follow" });
  const html = await response.text();
  const scriptSources = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((src) => src.startsWith("/_next/static/chunks/"));

  routeResults.push({ route, status: response.status, scripts: [...new Set(scriptSources)] });

  for (const src of scriptSources) {
    if (!globalScripts.has(src)) globalScripts.set(src, new Set());
    globalScripts.get(src).add(route);
  }
}

const hints = {
  paths: new Set(),
  urls: new Set(),
  storageKeys: new Set(),
  cookieNames: new Set(),
  literalHints: new Set(),
};
const scriptResults = [];

for (const [src, usedByRoutes] of globalScripts) {
  const response = await fetch(new URL(src, ORIGIN), { redirect: "follow" });
  const text = await response.text();
  let stringCount = 0;

  for (const match of text.matchAll(/["'`]([^"'`\\\n\r]{1,180})["'`]/g)) {
    const value = match[1].trim();
    if (!value) continue;
    stringCount += 1;

    if (value.startsWith("/") && !value.startsWith("/_next") && interesting.test(value)) {
      hints.paths.add(value);
    } else if (/^https?:\/\//i.test(value) && interesting.test(value)) {
      hints.urls.add(value);
    } else if (interesting.test(value) && value.length <= 120) {
      hints.literalHints.add(value);
    }
  }

  for (const match of text.matchAll(/(?:localStorage|sessionStorage)\.(?:getItem|setItem|removeItem)\(["']([^"']+)["']/g)) {
    hints.storageKeys.add(match[1]);
  }

  for (const match of text.matchAll(/(?:document\.cookie|cookie)\s*=\s*["']([^=;"']+)=/g)) {
    hints.cookieNames.add(match[1]);
  }

  scriptResults.push({
    src,
    status: response.status,
    bytes: Buffer.byteLength(text),
    usedByRoutes: [...usedByRoutes].sort(),
    stringCount,
  });
}

const normalize = (set) => [...set]
  .filter((value) => value.length <= 180)
  .sort((a, b) => a.localeCompare(b));

const result = {
  targetOrigin: ORIGIN,
  capturedAt: new Date().toISOString(),
  routes: routeResults,
  scripts: scriptResults,
  hints: {
    paths: normalize(hints.paths),
    urls: normalize(hints.urls),
    storageKeys: normalize(hints.storageKeys),
    cookieNames: normalize(hints.cookieNames),
    literalHints: normalize(hints.literalHints).slice(0, 500),
  },
};

await writeFile(path.join(OUTPUT, "contract-hints.json"), JSON.stringify(result, null, 2), "utf8");
console.log(JSON.stringify({
  routes: result.routes.map(({ route, status, scripts }) => ({ route, status, scriptCount: scripts.length })),
  hintCounts: Object.fromEntries(Object.entries(result.hints).map(([key, values]) => [key, values.length])),
}, null, 2));
