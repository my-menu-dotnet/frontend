import { createServerFn } from "@tanstack/react-start";
import type { HomeResponse } from "@/types/api/HomeResponse";

const getHomeResponse = createServerFn({ method: "GET" }).handler(async () => {
  const baseUrl = import.meta.env.VITE_API_URL;

  if (!baseUrl) {
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/home`, {
      credentials: "include",
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as HomeResponse;
  } catch {
    return null;
  }
});

export default getHomeResponse;
