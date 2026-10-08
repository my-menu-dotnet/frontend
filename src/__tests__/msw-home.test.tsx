import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { server } from "../test/msw/server";
import { factory } from "../test/factories";
import { http, HttpResponse } from "msw";

const API = "https://api.my-menu.net";

describe("MSW home endpoint integration", () => {
  beforeEach(() => {
    server.resetHandlers();
  });
  afterEach(() => {
    server.resetHandlers();
  });

  it("GET /home returns company and banners on success", async () => {
    server.use(
      http.get(`${API}/home`, () =>
        HttpResponse.json(factory.homeResponse())
      )
    );
    const res = await fetch(`${API}/home`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.company).toBeDefined();
    expect(body.company.id).toBeTruthy();
    expect(Array.isArray(body.banners)).toBe(true);
  });

  it("GET /home returns 500 on server error", async () => {
    server.use(
      http.get(`${API}/home`, () =>
        HttpResponse.json({ message: "Internal error" }, { status: 500 })
      )
    );
    const res = await fetch(`${API}/home`);
    expect(res.status).toBe(500);
  });

  it("GET /home returns null/empty when no company matches domain", async () => {
    server.use(
      http.get(`${API}/home`, () =>
        HttpResponse.json({ company: null, banners: [] })
      )
    );
    const res = await fetch(`${API}/home`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.company).toBeNull();
    expect(body.banners).toEqual([]);
  });

  it("GET /home supports custom banners list", async () => {
    const banners = [factory.banner(), factory.banner({ active: false })];
    server.use(
      http.get(`${API}/home`, () =>
        HttpResponse.json(factory.homeResponse({ banners }))
      )
    );
    const res = await fetch(`${API}/home`);
    const body = await res.json();
    expect(body.banners).toHaveLength(2);
    expect(body.banners[1].active).toBe(false);
  });
});
