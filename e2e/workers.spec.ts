import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

async function mockGoogleSignIn(page: Page) {
  await page.route("https://accounts.google.com/**", route => route.fulfill({
    contentType: "application/javascript",
    body: `window.google = { accounts: { id: {
      initialize(config) { this.callback = config.callback; },
      renderButton(container) {
        const button = document.createElement('button');
        button.textContent = 'Entrar com Google';
        button.onclick = () => this.callback({ credential: 'test-google-credential' });
        container.appendChild(button);
      }
    } } };`,
  }));
}

test("Google sign-in without a company opens onboarding without requesting tenant data", async ({ page }) => {
  const errors: string[] = [];
  const tenantRequests: string[] = [];
  const credentials: unknown[] = [];
  let signedIn = false;
  let releaseAnonymous!: () => void;
  const anonymousResponse = new Promise<void>(resolve => { releaseAnonymous = resolve; });
  page.on("pageerror", error => errors.push(error.message));
  await mockGoogleSignIn(page);
  await page.route("https://api.my-menu.net/**", async route => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/v1/oauth/google") {
      credentials.push(route.request().postDataJSON());
      signedIn = true;
      return route.fulfill({ json: { id: "new-user", name: "Ana", email: "ana@example.com", company: null } });
    }
    if (path === "/user") {
      const authenticated = signedIn;
      if (!authenticated) await anonymousResponse;
      return route.fulfill({ status: authenticated ? 200 : 403,
        json: authenticated ? { id: "new-user", name: "Ana", email: "ana@example.com", company: null } : { message: "Token not found" } });
    }
    tenantRequests.push(path);
    return route.fulfill({ status: 428, json: { status: 428, message: "Account has no company", data: null } });
  });
  await page.goto("/auth");
  await page.getByRole("button", { name: "Entrar com Google" }).click();
  await expect(page).toHaveURL(/\/auth\/company\/?$/);
  await expect(page.getByRole("heading", { name: "Cadastre sua empresa" })).toBeVisible();
  await expect(page.getByPlaceholder("Digite o nome da sua empresa")).toBeEditable();
  const lateResponse = page.waitForResponse(response => response.url().endsWith("/user") && response.status() === 403);
  releaseAnonymous();
  await (await lateResponse).finished();
  await expect(page.getByRole("heading", { name: "Cadastre sua empresa" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Entrar", exact: true })).not.toBeVisible();
  expect(credentials).toEqual([{ credential: "test-google-credential" }]);
  expect(tenantRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test("the company onboarding form submits a new company and refreshes the signed-in account", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const company = { id: "company-1", name: "Restaurante da Ana", email: "ana@example.com",
    url: "restaurante-da-ana", primary_color: "#123456", business_hours: [], categories: [], address: {} };
  let created = false;
  const writes: string[] = [];
  await page.route("https://api.my-menu.net/**", async route => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/user") return created
      ? route.fulfill({ json: { id: "new-user", name: "Ana", email: "ana@example.com", company } })
      : route.fulfill({ status: 428, json: { status: 428, message: "Account has no company", data: null } });
    if (path === "/file/upload") {
      writes.push(path);
      return route.fulfill({ json: { id: "image-1", url: "/favicon.ico" } });
    }
    if (path === "/company" && route.request().method() === "POST") {
      writes.push(path);
      created = true;
      return route.fulfill({ status: 201, json: company });
    }
    if (path.startsWith("/ws")) return route.abort();
    if (path.startsWith("/analytics/") || path === "/order/user/total") return route.fulfill({ json: { total: 0 } });
    if (path === "/order/user" || path === "/category/me") return route.fulfill({ json: [] });
    return route.abort();
  });
  await page.goto("/auth/company");
  await expect(page.getByRole("heading", { name: "Cadastre sua empresa" })).toBeVisible();
  await page.getByPlaceholder("Digite o nome da sua empresa").fill("Restaurante da Ana");
  await page.locator('input[type="color"]').fill("#123456");
  await page.getByPlaceholder("Digite o melhor email de contato").fill("ana@example.com");
  await page.getByPlaceholder("Digite o melhor telefone de contato").fill("11999999999");
  await page.getByPlaceholder("Digite o CEP").fill("01001000");
  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "São Paulo", exact: true }).click();
  await page.getByPlaceholder("Digite a cidade").fill("São Paulo");
  await page.getByPlaceholder("Digite o bairro").fill("Centro");
  await page.getByPlaceholder("Digite a rua").fill("Rua A");
  await page.getByPlaceholder("Digite o número").fill("1");
  await page.locator('input[type="file"]').setInputFiles({ name: "logo.png", mimeType: "image/png",
    buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aH1kAAAAASUVORK5CYII=", "base64") });
  await expect(page.locator('[data-test="image-preview"]')).toBeVisible();
  const submission = page.waitForRequest(request => new URL(request.url()).pathname === "/company" && request.method() === "POST");
  await page.getByRole("button", { name: "Enviar", exact: true }).click();
  expect((await submission).postDataJSON()).toMatchObject({ name: "Restaurante da Ana", email: "ana@example.com",
    phone: "11999999999", primary_color: "#123456", image_id: "image-1",
    address: { zip_code: "01001000", state: "SP", city: "São Paulo", neighborhood: "Centro", street: "Rua A", number: "1" } });
  await expect(page).toHaveURL(/\/dashboard\/?$/);
  expect(writes).toEqual(["/file/upload", "/company"]);
  expect(errors).toEqual([]);
});

test("an account without a company can reload the onboarding URL", async ({ page }) => {
  await page.route("https://api.my-menu.net/**", route => route.fulfill({
    json: { id: "new-user", name: "Ana", email: "ana@example.com", company: null },
  }));
  await page.goto("/auth/company");
  await expect(page.getByRole("heading", { name: "Cadastre sua empresa" })).toBeVisible();
  await expect(page.getByPlaceholder("Digite o nome da sua empresa")).toBeEditable();
});

test("GET /user 428 opens company registration instead of returning to Google login", async ({ page }) => {
  const errors: string[] = [];
  const unexpected: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await mockGoogleSignIn(page);
  await page.route("https://api.my-menu.net/**", async route => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/user") return route.fulfill({ status: 428,
      json: { timestamp: "2026-10-08T11:46:36", status: 428, message: "Account has no company", data: null } });
    unexpected.push(path);
    return route.abort();
  });
  await page.goto("/auth");
  await expect(page).toHaveURL(/\/auth\/company\/?$/);
  await expect(page.getByRole("heading", { name: "Cadastre sua empresa" })).toBeVisible();
  await expect(page.getByPlaceholder("Digite o nome da sua empresa")).toBeEditable();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Cadastre sua empresa" })).toBeVisible();
  expect(unexpected).toEqual([]);
  expect(errors).toEqual([]);
});

test("Google sign-in failure stays on login and shows an error without an unhandled rejection", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await mockGoogleSignIn(page);
  await page.route("https://api.my-menu.net/**", route => route.fulfill({ status: 403, json: { message: "Invalid credentials" } }));
  await page.goto("/auth");
  await page.getByRole("button", { name: "Entrar com Google" }).click();
  await expect(page.getByRole("alert")).toHaveText("Não foi possível entrar com o Google. Tente novamente.");
  await expect(page).toHaveURL(/\/auth\/?$/);
  expect(errors).toEqual([]);
});

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
