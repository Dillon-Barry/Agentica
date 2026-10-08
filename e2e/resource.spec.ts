import type { Page } from "@playwright/test";
import { rightAnswer } from "./answers";
import { BASE, ROUTE_IDS, expect, open, readLesson, saved, seed, test } from "./helpers";

/** Answer every boss question correctly until the boss falls. */
async function winFight(page: Page) {
  for (let i = 0; i < 12; i++) {
    await page.locator(".option:not([disabled])").first().waitFor();
    const options = await page.locator(".option > span:last-child").allTextContents();
    await page.keyboard.press(String(rightAnswer(options) + 1));
    await expect(page.locator(".verdict.right")).toBeVisible();
    const victory = page.locator(".dialog-actions button", { hasText: "VICTORY" });
    const next = page.locator(".dialog-actions button", { hasText: "NEXT" });
    await expect(victory.or(next)).toBeVisible();
    if (await victory.count()) return victory.click();
    await next.click();
  }
  throw new Error("boss never fell");
}

test.describe("study mode", () => {
  test("a locked lesson offers study mode, and finishing it still counts", async ({ page }) => {
    await seed(page, "1-1");
    await open(page, "level/5-1");
    await expect(page.locator(".blocked")).toContainText("still locked");
    await page.locator("button", { hasText: "OPEN IN STUDY MODE" }).click();
    await expect(page.locator(".level-title")).toHaveText("Prompt injection");
    await readLesson(page);
    expect((await saved(page)).cleared).toContain("5-1");

    // On the map, every road is open and the toggle shows it's on.
    await page.goto(BASE + "#/");
    await expect(page.locator(".hud button", { hasText: "STUDY" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".bar-hint")).toContainText("STUDY MODE");
    await page.locator(".hud button", { hasText: "STUDY" }).click();
    await expect(page.locator(".hud button", { hasText: "STUDY" })).toHaveAttribute("aria-pressed", "false");
    await open(page, "level/5-2");
    await expect(page.locator(".blocked")).toBeVisible();
  });
});

test.describe("skip ahead", () => {
  test("beating the current world's boss early clears the whole world", async ({ page }) => {
    await seed(page, "2-1");
    await open(page, "");
    const skip = page.locator(".stop-card .stop-skip");
    await expect(skip).toBeVisible();
    await skip.click();
    await expect(page).toHaveURL(/#\/boss\/2$/);
    await page.locator(".dialog-actions button", { hasText: "READY" }).click();
    await expect(page.locator(".dialog-text")).toContainText("Skipping ahead");
    await page.locator(".dialog-actions button", { hasText: "FIGHT" }).click();
    await winFight(page);
    await expect(page.locator(".nametag")).toHaveText("BOSS DEFEATED!");

    const world2 = ROUTE_IDS.filter((id) => id.startsWith("2-"));
    expect((await saved(page)).cleared).toEqual(expect.arrayContaining(world2));
    // The next world opens.
    await open(page, "level/3-1");
    await expect(page.locator(".level-title")).toHaveText("Tools");
  });

  test("only the current world's boss can be skipped to", async ({ page }) => {
    await seed(page, "2-1");
    await open(page, "boss/3");
    await expect(page.locator(".blocked")).toBeVisible();
  });
});

test("search finds lessons and terms from the keyboard", async ({ page }) => {
  await seed(page, "1-1");
  await open(page, "");
  await page.keyboard.press("/");
  const input = page.getByRole("searchbox", { name: "Search Agentica" });
  await expect(input).toBeFocused();
  await input.fill("lethal trifecta");
  await expect(page.locator(".search-hit").first()).toContainText("trifecta", { ignoreCase: true });
  await page.keyboard.press("ArrowDown");
  await expect(page.locator(".search-hit").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator(".search")).toHaveCount(0);

  await page.locator(".hud button", { hasText: "SEARCH" }).click();
  await input.fill("context window");
  await page.keyboard.press("Enter");
  await expect(page).not.toHaveURL(/#\/$/);
  await expect(page.locator(".search")).toHaveCount(0);
});

test("copy link buttons copy the public link", async ({ page }) => {
  await seed(page, "1-1");
  await open(page, "level/1-1");
  const copy = page.locator(".level-bar button[title^='Copy a link']");
  await expect(copy).toHaveAttribute("title", /https:\/\/dillon-barry\.github\.io\/Agentica\/#\/level\/1-1/);
  await copy.click();
  await expect(copy).toHaveText("COPIED ✔");
  await expect(copy).toHaveText("COPY LINK", { timeout: 4000 });
});

test("a shared Agentdex link shows its term even before it's collected", async ({ page }) => {
  await seed(page, "1-1");
  await open(page, "agentdex/prompt-injection");
  const entry = page.locator("#term-prompt-injection");
  await expect(entry).toHaveClass(/dex-target/);
  await expect(entry).toContainText("An attack that hides instructions");
  await expect(entry).toContainText("Shared with you");
  await expect(entry.locator(".dex-link")).toBeFocused();
});

test("cheat sheets: every world on one page, or one world with its diagrams", async ({ page }) => {
  await open(page, "cheatsheet");
  await expect(page.locator(".cheat-world")).toHaveCount(7);
  await expect(page.locator(".cheat-world .diagram")).toHaveCount(0);
  await page.locator(".cheat-picker a", { hasText: "3" }).click();
  await expect(page).toHaveURL(/#\/cheatsheet\/3$/);
  await expect(page.locator(".cheat-world")).toHaveCount(1);
  await expect(page.locator(".cheat-diagrams figure")).toHaveCount(4);
  // Printing drops the game chrome.
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".level-bar")).toBeHidden();
  await expect(page.locator(".cheat-world").first()).toBeVisible();
});

test("diagrams enlarge and replay their highlights", async ({ page }) => {
  await seed(page, "1-1");
  await open(page, "level/1-1");
  const enlarge = page.getByRole("button", { name: "Enlarge the diagram" });
  await enlarge.click();
  const dialog = page.getByRole("dialog", { name: "Diagram: What is an AI agent?" });
  await expect(dialog).toBeVisible();
  await dialog.locator("button", { hasText: "REPLAY" }).click();
  await expect(dialog.locator(".zoom-caption")).toContainText("Highlight 1 of 3");
  await expect(dialog.locator("svg")).toHaveClass(/focusing/);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(enlarge).toBeFocused();
});

test("time estimates show on the map and in the level list", async ({ page }) => {
  await seed(page, "1-1");
  await open(page, "");
  await expect(page.locator(".bar-world")).toContainText(/~\d+ MIN/);
  await page.locator(".level-list summary").click();
  await expect(page.locator(".ll-world h2")).toHaveCount(7);
  await expect(page.locator(".ll-world h2").first()).toContainText(/~\d+ MIN/);
});

test("Bit cheers when a lesson is cleared", async ({ page }) => {
  await seed(page, "1-1");
  await open(page, "level/1-1");
  await expect(page.locator(".dialog .buddy")).toBeVisible();
  await readLesson(page);
  await expect(page.locator(".dialog .buddy")).toHaveClass(/cheer/);
});

test("the map irises shut and open on the way into a level", async ({ page }) => {
  await seed(page, "1-1");
  await open(page, "");
  await page.locator(".stop-card .btn-go").click();
  await expect(page.locator(".wipe")).toHaveClass(/closing|opening/);
  await expect(page.locator(".level-title")).toHaveText("What is an AI agent?");
  await expect(page.locator(".wipe")).not.toHaveClass(/closing|opening/);
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  for (const [name, upTo, hash] of [
    ["map", "2-2", ""],
    ["lesson", "2-1", "level/2-1"],
    ["challenge", "4-C", "challenge/4"],
    ["boss", "2-B", "boss/2"],
    ["agentdex", "2-1", "agentdex"],
    ["cheat sheet", "1-1", "cheatsheet/2"],
    ["finish", "end", "finish"],
  ] as const) {
    test(`${name} fits the screen`, async ({ page }) => {
      await seed(page, upTo);
      await open(page, hash);
      await page.locator("main").first().waitFor();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    });
  }

  test("extra map buttons fold into MENU", async ({ page }) => {
    await seed(page, "1-1");
    await open(page, "");
    const study = page.locator(".hud button", { hasText: "STUDY" });
    await expect(study).toBeHidden();
    await page.locator(".hud-menu").click();
    await expect(page.locator(".hud-menu")).toHaveAttribute("aria-expanded", "true");
    await expect(study).toBeVisible();
  });
});
