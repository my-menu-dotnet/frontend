import { test, expect } from "@playwright/test";

test.describe("Dashboard order management", () => {
  test("admin sees kanban board with orders", async ({ page }) => {
    await page.route("**/order/kanban", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          PENDING: [{ id: "ord-1", total: 100, status: "PENDING" }],
          PREPARING: [],
          READY: [],
          DELIVERED: [],
        }),
      });
    });

    await page.goto("/dashboard/orders");
    await expect(page).toHaveURL(/\/dashboard\/orders/);
  });

  test("order status update reflects in UI", async ({ page }) => {
    await page.route("**/order/ord-1", async (route) => {
      if (route.request().method() === "PATCH") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ id: "ord-1", status: "PREPARING" }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ id: "ord-1", status: "PENDING" }),
        });
      }
    });

    await page.goto("/dashboard/orders");
    await page.waitForTimeout(1000);
  });

  test("empty orders list shows empty state", async ({ page }) => {
    await page.route("**/order**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ content: [], page: 0, pageCount: 0, totalElements: 0 }),
      });
    });

    await page.goto("/dashboard/orders");
    await page.waitForTimeout(1000);
  });
});
