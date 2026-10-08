// Renders the link-preview card (#/og-card in the built site) to public/og-image.png.
// Run after `npm run build`: npm run og-image
import { chromium } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const page = await (await chromium.launch({ channel: process.env.CI ? undefined : "msedge" })).newPage({ viewport: { width: 1400, height: 900 } });
await page.goto(pathToFileURL(path.resolve("dist/index.html")).href + "#/og-card");
const card = page.locator("canvas#og-card[data-ready]");
await card.waitFor();
const png = await card.evaluate((c) => c.toDataURL("image/png"));
const { writeFileSync, mkdirSync } = await import("node:fs");
mkdirSync("public", { recursive: true });
writeFileSync("public/og-image.png", Buffer.from(png.split(",")[1], "base64"));
console.log("wrote public/og-image.png");
await page.context().browser().close();
