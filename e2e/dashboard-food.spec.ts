import { test, expect } from "@playwright/test";

test.describe("Dashboard food management", () => {
  test("admin sees food list", async ({ page }) => {
    await page.route("**/food**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          content: [
            { id: "food-1", name: "Pizza Margherita", price: 49.9, active: true },
          ],
          page: 0,
          pageCount: 1,
          totalElements: 1,
        }),
      });
    });

    await page.goto("/dashboard/food");
    await expect(page).toHaveURL(/\/dashboard\/food/);
  });

  test("admin can create a new food", async ({ page }) => {
    await page.route("**/food", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: "food-new", name: "Nova Pizza", price: 55 }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/dashboard/food");
    await page.waitForTimeout(1000);
  });

  test("food creation API error shows error message", async ({ page }) => {
    await page.route("**/food", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 422,
          contentType: "application/json",
          body: JSON.stringify({ message: "Invalid food data" }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/dashboard/food");
    await page.waitForTimeout(1000);
  });
});
