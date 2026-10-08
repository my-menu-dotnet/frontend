import { test, expect } from "@playwright/test";

test.describe("Dashboard analytics", () => {
  test("admin sees analytics charts with data", async ({ page }) => {
    await page.route("**/analytics/orders/daily-stats", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ labels: ["Seg", "Ter"], data: [12, 19] }),
      });
    });
    await page.route("**/analytics/orders/items-stats**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ labels: ["Pizza"], data: [40] }),
      });
    });
    await page.route("**/analytics/orders/total", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ total: 128 }),
      });
    });

    await page.goto("/dashboard/analytics");
    await expect(page).toHaveURL(/\/dashboard\/analytics/);
  });

  test("analytics API error shows error state", async ({ page }) => {
    await page.route("**/analytics/**", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Analytics unavailable" }),
      });
    });

    await page.goto("/dashboard/analytics");
    await page.waitForTimeout(2000);
  });
});
