import { expect, open, saved, seed, test } from "./helpers";

test("boss: recap, fight, and a wrong answer explains itself and lands in the review pile", async ({ page }) => {
  await seed(page, "2-B");
  await open(page, "boss/2");
  await expect(page.locator(".nametag")).toHaveText("WHAT YOU LEARNED");
  expect(await page.locator(".dialog-text li").count()).toBeGreaterThanOrEqual(3);
  await page.locator(".dialog-actions button", { hasText: "READY" }).click();
  await page.locator(".dialog-actions button", { hasText: "FIGHT" }).click();

  // Answer A until it's wrong. Correct answers vary by slot, so this lands within a few questions.
  let missed: string | undefined;
  for (let i = 0; i < 12 && !missed; i++) {
    await page.locator(".option:not([disabled])").first().waitFor();
    const question = (await page.locator(".dialog .sr-only").textContent())?.trim();
    await page.keyboard.press("1");
    const verdict = page.locator(".verdict");
    await expect(verdict).toBeVisible();
    if ((await verdict.getAttribute("class"))!.includes("wrong")) {
      // Why this option is wrong, then why the right one is right.
      await expect(verdict.locator("p")).toHaveCount(2);
      await expect(verdict).toContainText("THE RIGHT ANSWER:");
      missed = question;
      break;
    }
    const next = page.locator(".dialog-actions button", { hasText: "NEXT" });
    if (!(await next.count())) break;
    await next.click();
  }
  test.skip(!missed, "option A was right every time; nothing to review");
  expect((await saved(page)).missed?.length).toBe(1);

  // The Agentdex review round asks it again; a right answer clears it.
  await open(page, "agentdex");
  await expect(page.locator("#review-title")).toHaveText("REVIEW · 1 TO PRACTISE");
  await page.locator(".review button", { hasText: "PRACTISE" }).click();
  const options = page.locator(".review .option");
  for (let k = 0; k < (await options.count()); k++) {
    await options.nth(k).click();
    if (await page.locator(".review .verdict.right").count()) break;
    // Wrong: try the next option on a fresh round.
    await page.locator(".review button", { hasText: "FINISH" }).click();
    await page.locator(".review button", { hasText: "BACK TO AGENTDEX" }).click();
    await page.locator(".review button", { hasText: "PRACTISE" }).click();
  }
  await page.locator(".review button", { hasText: "FINISH" }).click();
  await expect(page.locator(".review")).toContainText("The pile is empty");
  expect((await saved(page)).missed).toEqual([]);
});
