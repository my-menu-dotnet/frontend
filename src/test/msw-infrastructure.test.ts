import { describe, it, expect, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./msw/server";
import { factory } from "./factories";

const API = "https://api.my-menu.net";

describe("MSW infrastructure", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("intercepts GET /menu with companyId and returns mock data", async () => {
    const res = await fetch(`${API}/menu?companyId=comp-1`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.company).toBeDefined();
    expect(body.categories).toBeDefined();
  });

  it("returns 400 when /menu called without companyId", async () => {
    const res = await fetch(`${API}/menu`);
    expect(res.status).toBe(400);
  });

  it("intercepts POST /order and returns 201", async () => {
    server.use(
      http.post(`${API}/order`, () =>
        HttpResponse.json(factory.order(), { status: 201 })
      )
    );
    const res = await fetch(`${API}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ total: 100 }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBeDefined();
  });

  it("returns 500 from /menu/error handler", async () => {
    const res = await fetch(`${API}/menu/error`);
    expect(res.status).toBe(500);
  });

  it("returns empty menu from /menu/empty", async () => {
    const res = await fetch(`${API}/menu/empty`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.foods).toEqual([]);
  });

  it("server.use adds runtime handlers that override defaults", async () => {
    server.use(
      http.get(`${API}/dynamic-endpoint`, () =>
        HttpResponse.json({ dynamic: true })
      )
    );
    const res = await fetch(`${API}/dynamic-endpoint`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.dynamic).toBe(true);
  });
});
