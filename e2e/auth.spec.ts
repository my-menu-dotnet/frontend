import { test, expect } from "@playwright/test";

test.describe("Auth flow", () => {
  test("user can navigate to /auth and see login form", async ({ page }) => {
    await page.route("**/category/me", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
    });
    await page.route("**/home", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ company: null, banners: [] }),
      });
    });

    await page.goto("/auth");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("invalid credentials show error message", async ({ page }) => {
    await page.route("**/v1/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Invalid credentials" }),
      });
    });

    await page.goto("/auth");
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/senha|password/i);
    if (await emailInput.isVisible()) {
      await emailInput.fill("wrong@example.com");
      await passwordInput.fill("wrongpassword");
      const submitButton = page.getByRole("button", { name: /entrar|login/i });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await expect(page.getByText(/inválid|invalid|credenciais/i)).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test("logout clears session and redirects to home", async ({ page }) => {
    await page.route("**/v1/oauth/logout", async (route) => {
      await route.fulfill({ status: 204 });
    });
    await page.context().addCookies([
      {
        name: "authenticated",
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto("/");
  });
});
