import { expect, test as base, type Page } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROUTE } from "../src/worlds";

export const BASE = pathToFileURL(path.resolve("dist/index.html")).href;
export const ROUTE_IDS = ROUTE.map((l) => l.id);

/** Fails any test that throws an uncaught error in the page. */
export const test = base.extend<{ errors: string[] }>({
  errors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      await use(errors);
      expect(errors, "uncaught page errors").toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };

/** Seed progress so every stop before `upTo` is cleared and Bit stands on it. */
export async function seed(page: Page, upTo: string, extra: Record<string, unknown> = {}): Promise<void> {
  const i = upTo === "end" ? ROUTE_IDS.length : ROUTE_IDS.indexOf(upTo);
  const cleared = ROUTE_IDS.slice(0, i);
  await page.goto(BASE + "#/agentdex");
  await page.evaluate(
    ([cleared, pos, extra]) =>
      localStorage.setItem("agentica.v3", JSON.stringify({ cleared, position: pos, revealed: cleared.length + 1, introSeen: true, ...extra })),
    [cleared, upTo === "end" ? ROUTE_IDS.at(-1) : upTo, extra] as const,
  );
}

/** Open a route fresh, so it reads the seeded progress. */
export async function open(page: Page, hash: string): Promise<void> {
  await page.goto(BASE + "#/" + hash);
  await page.reload();
}

/** Click the last dialog button until the lesson's FINISH button. */
export async function readLesson(page: Page): Promise<void> {
  for (let i = 0; i < 12; i++) {
    const b = page.locator(".dialog-actions button").last();
    const label = (await b.textContent())?.trim() ?? "";
    await b.click();
    if (label.startsWith("FINISH")) return;
  }
  throw new Error("lesson never reached FINISH");
}

export const saved = (page: Page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("agentica.v3") ?? "{}") as { cleared: string[]; position?: string; missed?: string[] });
