import AxeBuilder from "@axe-core/playwright";
import { expect, open, seed, test } from "./helpers";

// Automated checks only catch part of what matters; see README for what was tested by hand.
const screens: [string, string, string][] = [
  ["map", "1-3", ""],
  ["lesson", "1-1", "level/1-1"],
  ["challenge", "7-C", "challenge/7"],
  ["boss recap", "3-B", "boss/3"],
  ["agentdex", "2-1", "agentdex"],
  ["finish", "end", "finish"],
];

for (const [label, upTo, hash] of screens) {
  test(`no axe violations: ${label}`, async ({ page }) => {
    await seed(page, upTo, { missed: [] });
    await open(page, hash);
    await page.locator("main, .map-mode").first().waitFor();
    await page.waitForTimeout(600);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 4).join(" | ")}`)).toEqual([]);
  });
}

test("a boss question with feedback has no axe violations", async ({ page }) => {
  await seed(page, "1-B");
  await open(page, "boss/1");
  await page.locator(".dialog-actions button", { hasText: "READY" }).click();
  await page.locator(".dialog-actions button", { hasText: "FIGHT" }).click();
  await page.locator(".option:not([disabled])").first().waitFor();
  await page.keyboard.press("1");
  await page.locator(".verdict").waitFor();
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 4).join(" | ")}`)).toEqual([]);
});

test("the welcome overlay has no axe violations", async ({ page }) => {
  await seed(page, "1-1", { introSeen: false });
  await open(page, "");
  await page.locator(".intro").waitFor();
  const { violations } = await new AxeBuilder({ page }).include(".intro").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(violations.map((v) => v.id)).toEqual([]);
});

test("keyboard users can skip the map to a plain list of levels", async ({ page }) => {
  await seed(page, "1-2");
  await open(page, "");
  const skip = page.locator(".skip-link");
  await skip.focus();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator(".level-list")).toHaveAttribute("open", "");
  await expect(page.locator(".level-list summary")).toBeFocused();
  // Cheat sheet link, then 1-1, then 1-2.
  for (let i = 0; i < 3; i++) await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#\/level\/1-2$/);
});

const scan = async (page: import("@playwright/test").Page, include?: string) => {
  const builder = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);
  const { violations } = await (include ? builder.include(include) : builder).analyze();
  return violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 4).join(" | ")}`);
};

test("no axe violations: cheat sheet", async ({ page }) => {
  await open(page, "cheatsheet/2");
  await page.locator(".cheat-world").waitFor();
  expect(await scan(page)).toEqual([]);
});

test("no axe violations: locked page with study mode offer", async ({ page }) => {
  await seed(page, "1-1");
  await open(page, "level/4-1");
  await page.locator(".blocked").waitFor();
  expect(await scan(page)).toEqual([]);
});

test("no axe violations: shared Agentdex term", async ({ page }) => {
  await seed(page, "1-1");
  await open(page, "agentdex/mcp");
  await page.locator(".dex-target").waitFor();
  expect(await scan(page)).toEqual([]);
});

test("no axe violations: search and diagram zoom", async ({ page }) => {
  await seed(page, "1-1");
  await open(page, "level/1-1");
  await page.keyboard.press("/");
  await page.keyboard.type("agent");
  await page.locator(".search-hit").first().waitFor();
  expect(await scan(page, ".search")).toEqual([]);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Enlarge the diagram" }).click();
  await page.locator(".zoom").waitFor();
  expect(await scan(page, ".zoom")).toEqual([]);
});

test("no axe violations: phone map with the menu open", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seed(page, "1-2");
  await open(page, "");
  await page.locator(".hud-menu").click();
  expect(await scan(page)).toEqual([]);
});
