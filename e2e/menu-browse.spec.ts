import { test, expect } from "@playwright/test";

test.describe("Menu browse flow", () => {
  test("customer can visit a menu and see company info", async ({ page }) => {
    await page.route("**/menu**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "menu-1",
          company: {
            id: "comp-1",
            name: "Pizzaria do João",
            open: true,
            logo: "https://placehold.co/200",
          },
          categories: [
            { id: "cat-1", name: "Pizzas", order: 1, active: true },
            { id: "cat-2", name: "Bebidas", order: 2, active: true },
          ],
          foods: [
            {
              id: "food-1",
              name: "Pizza Margherita",
              price: 49.9,
              image: "https://placehold.co/400",
              category: { id: "cat-1", name: "Pizzas" },
              active: true,
            },
          ],
          banners: [],
        }),
      });
    });

    await page.goto("/menu/comp-1");
    await expect(page).toHaveURL(/\/menu\/comp-1/);
  });

  test("API error shows error state", async ({ page }) => {
    await page.route("**/menu**", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Server error" }),
      });
    });

    await page.goto("/menu/comp-1");
    await page.waitForTimeout(2000);
  });

  test("empty menu shows empty state", async ({ page }) => {
    await page.route("**/menu**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "menu-1",
          company: { id: "comp-1", name: "Empty", open: true },
          categories: [],
          foods: [],
          banners: [],
        }),
      });
    });

    await page.goto("/menu/empty-menu");
    await expect(page).toHaveURL(/\/menu\/empty-menu/);
  });
});
