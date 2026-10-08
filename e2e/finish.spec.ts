import { expect, open, seed, test } from "./helpers";

test("finish screen: stats, every world, and a named certificate PNG", async ({ page }) => {
  await seed(page, "7-1");
  await open(page, "finish");
  await expect(page.locator(".finish-hero .nametag")).toHaveText("QUEST COMPLETE!");
  await expect(page.locator(".finish-stats")).toContainText("★ 41/41 STOPS");
  // Six worlds plus the Star Road card.
  await expect(page.locator(".finish-world")).toHaveCount(7);

  const name = page.getByLabel("Name on the certificate");
  await name.fill("Ada Lovelace");
  const download = page.waitForEvent("download");
  await page.locator(".cert button", { hasText: "DOWNLOAD" }).click();
  expect((await download).suggestedFilename()).toBe("agentica-certificate.png");

  // The name is remembered for next time.
  await page.reload();
  await expect(name).toHaveValue("Ada Lovelace");
});

test("finish screen stays locked until the final main boss", async ({ page }) => {
  await seed(page, "6-B");
  await open(page, "finish");
  await expect(page.locator(".finish-hero")).toHaveCount(0);
});

test("link preview card renders", async ({ page }) => {
  await open(page, "og-card");
  await expect(page.locator("canvas#og-card")).toHaveAttribute("data-ready", "true");
});
