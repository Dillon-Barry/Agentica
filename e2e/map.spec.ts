import { BASE, expect, open, readLesson, saved, seed, test } from "./helpers";

test("intro shows once, and the help button brings it back", async ({ page }) => {
  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator(".intro")).toBeVisible();
  await expect(page.locator(".intro")).toContainText("bonus Star Road");
  await page.locator(".intro button", { hasText: "START" }).click();
  await expect(page.locator(".intro")).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".stop-card")).toBeVisible();
  await expect(page.locator(".intro")).toHaveCount(0);
  await page.locator(".hud button", { hasText: "?" }).click();
  await expect(page.locator(".intro")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".intro")).toHaveCount(0);
});

test("body text uses the legible font, and Aa swaps to the pixel font", async ({ page }) => {
  await seed(page, "1-1");
  await open(page, "");
  const font = () => page.locator(".bar-status").evaluate((el) => getComputedStyle(el).fontFamily);
  expect(await font()).toMatch(/^"Atkinson Hyperlegible Next"/);
  await page.locator(".hud button", { hasText: "Aa" }).click();
  expect(await font()).toMatch(/^"Pixelify Sans"/);
  await page.locator(".hud button", { hasText: "Aa" }).click();
  expect(await font()).toMatch(/^"Atkinson Hyperlegible Next"/);
});

test("PLAY card sits under Bit, opens the level, and Bit walks on after a clear", async ({ page }) => {
  await seed(page, "1-1");
  await open(page, "");
  const card = page.locator(".stop-card");
  await expect(card).toContainText("What is an AI agent?");
  const box = (await card.boundingBox())!;
  const vh = page.viewportSize()!.height;
  expect(box.y).toBeGreaterThan(40);
  expect(box.y).toBeLessThan(vh * 0.75);

  await card.locator(".btn-go").click();
  await expect(page).toHaveURL(/#\/level\/1-1$/);
  await readLesson(page);
  await page.locator(".dialog-actions button", { hasText: "TO THE MAP" }).click();

  // The card hides while the new road draws and Bit walks, then returns at 1-2 with PLAY focused.
  await expect(card).toBeHidden();
  await expect(card.locator(".stop-title")).toHaveText("Sixty years of agents", { timeout: 10_000 });
  await expect(card).toBeVisible();
  expect((await saved(page)).position).toBe("1-2");
  expect(await page.evaluate(() => document.activeElement?.closest(".stop-card") !== null)).toBe(true);

  // Coming back without a new clear doesn't walk again.
  await page.goto(BASE + "#/agentdex");
  await page.goto(BASE + "#/");
  await page.waitForTimeout(1500);
  await expect(card.locator(".stop-title")).toHaveText("Sixty years of agents");
});

test("the Star Road opens only after the main quest", async ({ page }) => {
  await seed(page, "7-1");
  await open(page, "level/7-1");
  await expect(page.locator(".level-title")).toHaveText("Sandboxing agents that run code");
  await seed(page, "6-B");
  await open(page, "level/7-1");
  await expect(page.locator(".level-title")).toHaveCount(0);
});
