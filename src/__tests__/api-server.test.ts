// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/src/test/msw/server";
import api from "@/services/api";

afterEach(() => vi.unstubAllGlobals());

it("keeps Worker requests isolated and never runs browser session refresh on SSR 401s", async () => {
  const previousAdapter = api.defaults.adapter;
  api.defaults.adapter = "fetch";
  const refresh = vi.fn();
  const requests: { tenant: string | null; cookie: string | null }[] = [];
  vi.stubGlobal("localStorage", { clear: vi.fn(), removeItem: vi.fn() });
  server.use(
    http.get("https://api.my-menu.net/menu", ({ request }) => {
      requests.push({ tenant: request.headers.get("x-company-id"), cookie: request.headers.get("cookie") });
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }),
    http.post("https://api.my-menu.net/v1/oauth/refresh-token", () => {
      refresh();
      return new HttpResponse(null, { status: 500 });
    }),
  );
  try {
    const results = await Promise.allSettled([
      api.get("/menu", { headers: { "X-Company-ID": "tenant-a", cookie: "session=a" } }),
      api.get("/menu", { headers: { "X-Company-ID": "tenant-b", cookie: "session=b" } }),
    ]);
    expect(requests).toEqual(expect.arrayContaining([
      { tenant: "tenant-a", cookie: "session=a" }, { tenant: "tenant-b", cookie: "session=b" },
    ]));
    expect(requests).toHaveLength(2);
    expect(refresh).not.toHaveBeenCalled();
    for (const result of results) {
      expect(result.status).toBe("rejected");
      if (result.status === "rejected") expect(result.reason.response.status).toBe(401);
    }
  } finally {
    api.defaults.adapter = previousAdapter;
  }
});
