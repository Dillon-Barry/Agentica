import { expect, open, readLesson, seed, test } from "./helpers";

test("bold words open Agentdex popovers", async ({ page }) => {
  await seed(page, "1-1");
  await open(page, "level/1-1");
  const next = page.locator(".dialog-actions button").last();
  await next.click();
  await next.click();
  await page.locator("button.term").first().click();
  await expect(page.locator(".term-pop")).toBeVisible();
  expect((await page.locator(".term-pop").textContent())!.length).toBeGreaterThan(20);
});

test("the diagram lights up the parts each page talks about", async ({ page }) => {
  await seed(page, "1-1");
  await open(page, "level/1-1");
  const svg = page.locator(".level svg").first();
  const lit = () => svg.locator("[data-part].lit").evaluateAll((els) => els.map((e) => (e as SVGGElement).dataset.part));

  // Page 1 talks about the whole picture: nothing dimmed.
  await expect(svg).not.toHaveClass(/focusing/);
  const next = page.locator(".dialog-actions button").last();
  await next.click();
  await next.click();
  // Page 3 is about the goal and the model.
  await expect(svg).toHaveClass(/focusing/);
  expect((await lit()).sort()).toEqual(["goal", "model"]);
  await next.click();
  expect((await lit()).sort()).toEqual(["memory", "model", "tools"]);

  await readLesson(page);
  await expect(svg).not.toHaveClass(/focusing/);
});

test("Go deeper shows a code peek where a lesson has one", async ({ page }) => {
  await seed(page, "3-1");
  await open(page, "level/3-1");
  await readLesson(page);
  await page.locator(".btn-q").click();
  await expect(page.locator(".peek pre")).toHaveCount(1);
});
