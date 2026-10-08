import { test, expect } from "@playwright/test";

test("workerd renders the home HTML and serves its built JavaScript", async ({ request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/html");
  const html = await response.text();
  expect(html).toContain("Crie seu cardápio digital personalizado!");
  const script = html.match(/src="(\/assets\/[^"]+\.js)"/);
  expect(script).not.toBeNull();
  const asset = await request.get(script![1]);
  expect(asset.status()).toBe(200);
  expect(asset.headers()["content-type"]).toMatch(/javascript/);
});

test("hydrates and navigates from home to authentication", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("https://api.my-menu.net/**", route => route.fulfill({ json: null }));
  await page.route("https://accounts.google.com/**", route => route.fulfill({
    contentType: "application/javascript",
    body: "window.google = { accounts: { id: { initialize() {}, renderButton() {} } } };",
  }));
  await page.goto("/");
  await page.getByRole("banner").getByRole("link", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/auth$/);
  await expect(page.getByRole("heading", { name: "Entrar", exact: true })).toBeVisible();
  await expect(page.getByText("Bem-vindo, para continuar")).toBeVisible();
  expect(errors).toEqual([]);
});

test("selects a client and opens prefilled client creation inside the order dialog", async ({ page }) => {
  const errors: string[] = [];
  const unexpected: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const client = { id: "client-1", name: "Ana Silva", phone: "11999999999", email: "ana@example.com",
    created_at: "2026-01-01", updated_at: "2026-01-01", address: { street: "Rua A", number: "1", city: "São Paulo", state: "SP", zip_code: "01001000" } };
  await page.route("https://api.my-menu.net/**", async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.startsWith("/ws")) return route.abort();
    if (path === "/user") return route.fulfill({ json: { id: "user-1", name: "Operador", email: "test@example.com",
      company: { id: "company-1", name: "Restaurante", url: "restaurante", business_hours: [], categories: [], address: {} } } });
    if (path === "/client/search") return route.fulfill({ json: new URL(route.request().url()).searchParams.get("name") === "Ana Nova" ? [] : [client] });
    if (path === "/category/me" || path === "/category/select") return route.fulfill({ json: [] });
    if (path === "/order" || path === "/food") return route.fulfill({ json: { content: [], page: 0, pageCount: 0, totalElements: 0 } });
    unexpected.push(`${route.request().method()} ${path}`);
    return route.abort();
  });
  await page.goto("/dashboard/orders");
  await expect(page.getByRole("banner").getByRole("heading", { name: "Pedidos", exact: true })).toBeVisible();
  await page.locator('[data-test="add-manual-order"]').click();
  const dialog = page.getByRole("dialog", { name: "Novo pedido manual" });
  const input = dialog.getByRole("combobox", { name: "Nome do cliente" });
  await input.fill("Ana");
  await expect(page.getByRole("option", { name: /Ana Silva/ })).toBeVisible();
  const inputBox = await input.boundingBox();
  const popupBox = await page.locator('[data-slot="combobox-content"]').boundingBox();
  expect(popupBox!.width).toBeGreaterThanOrEqual(inputBox!.width);
  await page.getByRole("option", { name: /Ana Silva/ }).click();
  await expect(input).toHaveValue("Ana Silva");
  await expect(dialog.getByText(/Cliente selecionado:/)).toContainText("Ana Silva");
  await input.fill("Ana Nova");
  await page.getByRole("button", { name: 'Cadastrar "Ana Nova"' }).click();
  const create = page.getByRole("dialog", { name: "Adicionar cliente" });
  await expect(create).toBeVisible();
  await expect(create.getByRole("textbox", { name: "Nome completo", exact: true })).toHaveValue("Ana Nova");
  expect(unexpected).toEqual([]);
  expect(errors).toEqual([]);
});
