import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import api from "@/services/api";
import { Menu } from "@/types/api/Menu";

export const getMenu = createServerFn({ method: "GET" })
  .inputValidator((id: unknown) => {
    if (typeof id !== "string" || !id) {
      throw new Error("company id is required");
    }
    return id;
  })
  .handler(async ({ data: id }) => {
    try {
      const cookie = getRequestHeader("cookie");
      const headers: Record<string, string> = { "X-Company-ID": id };
      if (cookie) headers.cookie = cookie;
      const { data } = await api(`/menu`, { headers });
      return data as Menu;
    } catch (e) {
      console.error("getMenu failed", e);
      return null;
    }
  });

export const postCompanyAccess = createServerFn({ method: "POST" })
  .inputValidator((input: { company_id: string; access_way?: string }) => {
    if (!input?.company_id) {
      throw new Error("company_id is required");
    }
    return {
      company_id: input.company_id,
      access_way: input.access_way ?? "WEB",
      accessed_at: new Date().toISOString(),
    };
  })
  .handler(async ({ data }) => {
    try {
      await api.post("/analytics/company/user-access", data);
    } catch (e) {
      console.error("postCompanyAccess failed", e);
    }
  });
