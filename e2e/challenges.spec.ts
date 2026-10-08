import type { Page } from "@playwright/test";
import { expect, open, saved, seed, test } from "./helpers";

/** Solve challenge `n` with `solve`, then check it clears and saves. */
async function solves(page: Page, n: number, solve: () => Promise<void>) {
  await seed(page, `${n}-C`);
  await open(page, `challenge/${n}`);
  await solve();
  await expect(page.locator(".ch-done .nametag")).toHaveText("CHALLENGE CLEAR!");
  expect((await saved(page)).cleared).toContain(`${n}-C`);
}

test("1 · sort it", async ({ page }) => {
  await solves(page, 1, async () => {
    const tried = new Map<string, number>();
    const bins = ["CHATBOT", "WORKFLOW", "AGENT"];
    for (let i = 0; i < 40 && (await page.locator(".ch-bin").count()); i++) {
      const card = (await page.locator(".ch-card").textContent()) ?? "";
      const t = tried.get(card) ?? 0;
      tried.set(card, t + 1);
      await page.locator(".ch-bin", { hasText: bins[t % 3] }).click();
    }
  });
});

test("2 · be the loop", async ({ page }) => {
  await solves(page, 2, async () => {
    for (const text of ["Fetch the homepage and look", "Read the web server's error logs", "Check the database's status", "Report the cause and ask before fixing anything"]) {
      await page.locator(".ch-choices .option", { hasText: text }).click();
    }
  });
});

test("3 · read the label", async ({ page }) => {
  await solves(page, 3, async () => {
    for (const name of ["get_weather", "fun_facts", "file_reader v2.0"]) {
      await page.locator(".ch-cart", { hasText: name }).click();
      const next = page.locator(".ch-carts button", { hasText: "NEXT ROUND" });
      if (await next.count()) await next.click();
    }
  });
});

test("4 · assign the party", async ({ page }) => {
  await solves(page, 4, async () => {
    const picks = ["RESEARCHER", "CODER", "REVIEWER", "RELEASE"];
    const rows = page.locator(".ch-task");
    for (let i = 0; i < picks.length; i++) await rows.nth(i).locator("button", { hasText: picks[i] }).click();
    await page.locator(".ch-twist .option", { hasText: "The reviewer" }).click();
  });
});

test("5 · break the trifecta", async ({ page }) => {
  await solves(page, 5, async () => {
    await page.locator(".ch-sentence", { hasText: "AI assistant:" }).click();
    const run = page.locator(".ch-step2 button", { hasText: "RUN THE ATTACK" });
    await run.click();
    await expect(page.locator(".ch-result")).toContainText("LEAKED");
    await page.locator(".ch-leg", { hasText: "WAY OUT" }).click();
    await run.click();
  });
});

test("6 · write the gate rule", async ({ page }) => {
  await solves(page, 6, async () => {
    const replay = page.locator(".ch button", { hasText: "REPLAY TRAFFIC" });
    await replay.click();
    await expect(page.locator(".ch-result")).toContainText("✘");
    await page.getByLabel("bit may call read_invoices").check();
    await page.getByLabel("helpdesk may call refund_order").check();
    await replay.click();
  });
});

test("7 · lock the sandbox", async ({ page }) => {
  await solves(page, 7, async () => {
    const replay = page.locator(".ch button", { hasText: "REPLAY BIT'S ACTIONS" });
    await replay.click();
    await expect(page.locator(".ch-result")).toContainText("✘");
    const choose = (group: string, option: string) => page.getByRole("radiogroup", { name: group }).getByRole("radio", { name: option }).click();
    await choose("NETWORK", "PACKAGE REGISTRY ONLY");
    await choose("FILES", "PROJECT FOLDER");
    await choose("SECRETS", "NONE");
    await choose("TIME LIMIT", "5 MINUTES");
    await replay.click();
  });
});
