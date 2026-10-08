import { http, HttpResponse, delay } from "msw";
import { factory } from "../factories";
import { errorHandlers } from "./error-handlers";

const API_URL = "https://api.my-menu.net";

export const handlers = [
  http.get(`${API_URL}/home`, async () => {
    await delay(10);
    return HttpResponse.json(factory.homeResponse());
  }),

  http.get(`${API_URL}/menu`, async ({ request }) => {
    await delay(10);
    const url = new URL(request.url);
    const companyId =
      url.searchParams.get("companyId") ?? request.headers.get("x-company-id");
    if (!companyId) {
      return HttpResponse.json({ message: "company id is required" }, { status: 400 });
    }
    return HttpResponse.json(factory.menu());
  }),

  http.get(`${API_URL}/company/by-domain`, async ({ request }) => {
    await delay(10);
    const url = new URL(request.url);
    const domain = url.searchParams.get("domain");
    if (!domain) {
      return HttpResponse.json({ message: "domain is required" }, { status: 400 });
    }
    return HttpResponse.json(factory.company());
  }),

  http.get(`${API_URL}/company/:companyId`, async ({ params }) => {
    await delay(10);
    return HttpResponse.json(factory.company({ id: params.companyId as string }));
  }),

  http.post(`${API_URL}/v1/auth/login`, async () => {
    await delay(10);
    return HttpResponse.json(factory.authResponse());
  }),

  http.post(`${API_URL}/v1/oauth/google`, async () => {
    await delay(10);
    return HttpResponse.json(factory.user());
  }),

  http.post(`${API_URL}/v1/oauth/refresh-token`, async () => {
    await delay(10);
    return HttpResponse.json(factory.authResponse());
  }),

  http.post(`${API_URL}/v1/oauth/logout`, async () => {
    await delay(10);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}/user`, async () => {
    await delay(10);
    return HttpResponse.json(factory.user());
  }),

  http.patch(`${API_URL}/user`, async ({ request }) => {
    await delay(10);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(factory.user(body));
  }),

  http.get(`${API_URL}/company/business-hours`, async () => {
    await delay(10);
    return HttpResponse.json(factory.businessHours());
  }),

  http.put(`${API_URL}/company/business-hours`, async ({ request }) => {
    await delay(10);
    const body = await request.json();
    return HttpResponse.json(body);
  }),

  http.post(`${API_URL}/company`, async ({ request }) => {
    await delay(10);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(factory.company(body), { status: 201 });
  }),

  http.patch(`${API_URL}/company/:companyId`, async ({ request, params }) => {
    await delay(10);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(factory.company({ id: params.companyId as string, ...body }));
  }),

  http.get(`${API_URL}/category/me`, async () => {
    await delay(10);
    return HttpResponse.json([factory.category(), factory.category({ id: "cat-2", name: "Bebidas" })]);
  }),

  http.get(`${API_URL}/category/select`, async () => {
    await delay(10);
    return HttpResponse.json([
      { value: "cat-1", label: "Pizzas" },
      { value: "cat-2", label: "Bebidas" },
    ]);
  }),

  http.post(`${API_URL}/category`, async ({ request }) => {
    await delay(10);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(factory.category(body), { status: 201 });
  }),

  http.patch(`${API_URL}/category/:id`, async ({ request, params }) => {
    await delay(10);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(factory.category({ id: params.id as string, ...body }));
  }),

  http.delete(`${API_URL}/category/:id`, async () => {
    await delay(10);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}/food`, async ({ request }) => {
    await delay(10);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "0");
    return HttpResponse.json({
      content: factory.foodList(5),
      page,
      pageCount: 3,
      totalElements: 15,
    });
  }),

  http.get(`${API_URL}/food/:foodId`, async ({ params }) => {
    await delay(10);
    return HttpResponse.json(factory.food({ id: params.foodId as string }));
  }),

  http.post(`${API_URL}/food`, async ({ request }) => {
    await delay(10);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(factory.food(body), { status: 201 });
  }),

  http.patch(`${API_URL}/food/:foodId`, async ({ request, params }) => {
    await delay(10);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(factory.food({ id: params.foodId as string, ...body }));
  }),

  http.delete(`${API_URL}/food/:foodId`, async () => {
    await delay(10);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}/banner`, async () => {
    await delay(10);
    return HttpResponse.json({
      content: [factory.banner()],
      page: 0,
      pageCount: 1,
      totalElements: 1,
    });
  }),

  http.get(`${API_URL}/banner/:bannerId`, async ({ params }) => {
    await delay(10);
    return HttpResponse.json(factory.banner({ id: params.bannerId as string }));
  }),

  http.post(`${API_URL}/banner`, async ({ request }) => {
    await delay(10);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(factory.banner(body), { status: 201 });
  }),

  http.put(`${API_URL}/banner/:companyId`, async ({ request, params }) => {
    await delay(10);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(factory.banner({ id: params.companyId as string, ...body }));
  }),

  http.delete(`${API_URL}/banner/:bannerId`, async () => {
    await delay(10);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}/discount`, async () => {
    await delay(10);
    return HttpResponse.json([factory.discount()]);
  }),

  http.get(`${API_URL}/discount/:discountId`, async ({ params }) => {
    await delay(10);
    return HttpResponse.json(factory.discount({ id: params.discountId as string }));
  }),

  http.post(`${API_URL}/discount`, async ({ request }) => {
    await delay(10);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(factory.discount(body), { status: 201 });
  }),

  http.delete(`${API_URL}/discount/:id`, async () => {
    await delay(10);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}/order`, async () => {
    await delay(10);
    return HttpResponse.json({
      content: factory.orderList(3),
      page: 0,
      pageCount: 1,
      totalElements: 3,
    });
  }),

  http.get(`${API_URL}/order/kanban`, async () => {
    await delay(10);
    return HttpResponse.json({
      PENDING: [factory.order()],
      PREPARING: [factory.order({ id: "ord-2", status: "PRODUCING" })],
      READY: [],
      DELIVERED: [factory.order({ id: "ord-3", status: "DELIVERED" })],
    });
  }),

  http.post(`${API_URL}/order`, async ({ request }) => {
    await delay(10);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(factory.order(body), { status: 201 });
  }),

  http.post(`${API_URL}/order/anonymously`, async ({ request }) => {
    await delay(10);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(factory.order(body), { status: 201 });
  }),

  http.patch(`${API_URL}/order/:orderId`, async ({ request, params }) => {
    await delay(10);
    const body = (await request.json()) as { status?: string };
    return HttpResponse.json(
      factory.order({
        id: params.orderId as string,
        status: body.status as "PENDING" | undefined,
      }),
    );
  }),

  http.get(`${API_URL}/order/user/total`, async () => {
    await delay(10);
    return HttpResponse.json({ total: 42 });
  }),

  http.get(`${API_URL}/order/user`, async () => {
    await delay(10);
    return HttpResponse.json(factory.orderList(2));
  }),

  http.post(`${API_URL}/analytics/company/user-access`, async () => {
    await delay(10);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}/analytics/orders/total`, async () => {
    await delay(10);
    return HttpResponse.json({ total: 128 });
  }),

  http.get(`${API_URL}/analytics/orders/daily-stats`, async () => {
    await delay(10);
    return HttpResponse.json(factory.dailyStats());
  }),

  http.get(`${API_URL}/analytics/orders/items-stats`, async () => {
    await delay(10);
    return HttpResponse.json(factory.itemsStats());
  }),

  http.get(`${API_URL}/analytics/orders/complete-analytics`, async () => {
    await delay(10);
    return HttpResponse.json(factory.completeAnalytics());
  }),

  http.get(`${API_URL}/analytics/company/total-access`, async () => {
    await delay(10);
    return HttpResponse.json({ total: 256 });
  }),

  http.get(`${API_URL}/client`, async () => {
    await delay(10);
    return HttpResponse.json({
      content: [factory.client()],
      page: 0,
      pageCount: 1,
      totalElements: 1,
    });
  }),

  http.get(`${API_URL}/client/search`, async () => {
    await delay(10);
    return HttpResponse.json([factory.client(), factory.client({ id: "cli-2", name: "João Santos" })]);
  }),

  http.get(`${API_URL}/client/:clientId`, async ({ params }) => {
    await delay(10);
    return HttpResponse.json(factory.client({ id: params.clientId as string }));
  }),

  http.post(`${API_URL}/client`, async ({ request }) => {
    await delay(10);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(factory.client(body), { status: 201 });
  }),

  http.put(`${API_URL}/client/:id`, async ({ request, params }) => {
    await delay(10);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(factory.client({ id: params.id as string, ...body }));
  }),

  http.delete(`${API_URL}/client/:clientId`, async () => {
    await delay(10);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}/company/qr-code`, async () => {
    await delay(10);
    return HttpResponse.json({ qrcode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" });
  }),

  http.get(`${API_URL}/address`, async ({ request }) => {
    await delay(10);
    const url = new URL(request.url);
    const cep = url.searchParams.get("cep");
    if (cep === "00000000") {
      return HttpResponse.json({ message: "CEP not found" }, { status: 404 });
    }
    return HttpResponse.json(factory.address());
  }),

  http.post(`${API_URL}/auth/verify-email/send`, async () => {
    await delay(10);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API_URL}/v1/payments/mercadopago/preference`, async ({ request }) => {
    await delay(10);
    const body = (await request.json()) as { items?: unknown[] };
    return HttpResponse.json({
      id: "pref-123",
      init_point: "https://mercadopago.com/checkout/pref-123",
      items: body.items ?? [],
    });
  }),

  ...errorHandlers,
];
