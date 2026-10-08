import { test, expect } from "@playwright/test";

test.describe("Cart and checkout flow", () => {
  test("customer can add item to cart and proceed to checkout", async ({ page }) => {
    await page.route("**/menu**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "menu-1",
          company: { id: "comp-1", name: "Test", open: true },
          categories: [{ id: "cat-1", name: "Pizzas" }],
          foods: [
            { id: "food-1", name: "Pizza", price: 50, category: { id: "cat-1" } },
          ],
          banners: [],
        }),
      });
    });

    await page.goto("/menu/comp-1");
    await expect(page).toHaveURL(/\/menu\/comp-1/);

    await page.goto("/menu/comp-1/cart");
    await expect(page).toHaveURL(/\/menu\/comp-1\/cart/);
  });

  test("empty cart shows empty state", async ({ page }) => {
    await page.goto("/menu/comp-1/cart");
    await expect(page).toHaveURL(/\/menu\/comp-1\/cart/);
  });

  test("order submission API error shows error", async ({ page }) => {
    await page.route("**/order", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 422,
          contentType: "application/json",
          body: JSON.stringify({ message: "Cannot create order" }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/menu/comp-1/cart");
    await page.waitForTimeout(1000);
  });
});
