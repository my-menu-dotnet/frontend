import { test, expect } from "@playwright/test";

test.describe("Hostname redirect flow", () => {
  test("lettes.my-menu.net root redirects to demo menu", async ({ page }) => {
    await page.route("**/menu**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "demo",
          company: { id: "demo", name: "Demo", open: true },
          categories: [],
          foods: [],
          banners: [],
        }),
      });
    });

    await page.goto("http://lettes.my-menu.net:3000/");
    await expect(page).toHaveURL(/34966345-2ec8-4227-b9c6-08a34d2d25a6/);
  });

  test("lettes.my-menu.net/dashboard redirects to my-menu.net/dashboard", async ({ page }) => {
    await page.goto("http://lettes.my-menu.net:3000/dashboard");
    await expect(page).toHaveURL(/my-menu\.net.*dashboard/);
  });
});
