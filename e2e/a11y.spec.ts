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
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#\/level\/1-2$/);
});
