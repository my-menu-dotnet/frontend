import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./msw/server";

// Force axios to use the fetch adapter so MSW can intercept requests.
// Without this, axios falls back to the Node http module in jsdom, which
// MSW does not patch.
import axios from "axios";
const fetchAdapter = (config: import("axios").InternalAxiosRequestConfig) => {
  const url = (config.baseURL ?? "") + (config.url ?? "");
  const headers = new Headers();
  for (const [k, v] of Object.entries(config.headers ?? {})) {
    if (v != null) headers.set(k, String(v));
  }
  let body: BodyInit | undefined;
  if (config.data) {
    body =
      typeof config.data === "string"
        ? config.data
        : JSON.stringify(config.data);
  }
  return fetch(url, {
    method: (config.method ?? "get").toUpperCase(),
    headers,
    body,
    credentials: "include",
  }).then(async (res) => {
    const responseData = await res.text();
    let parsed: unknown = responseData;
    try {
      parsed = JSON.parse(responseData);
    } catch {
      /* not json */
    }
    return {
      data: parsed,
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
      config,
      request: { responseURL: url },
    } as import("axios").AxiosResponse;
  });
};
axios.defaults.adapter = fetchAdapter;

beforeAll(() => {
  server.listen({
    onUnhandledRequest: (request) => {
      throw new Error(
        `MSW: unhandled request to ${request.method} ${request.url}. ` +
          `Add a handler in src/test/msw/handlers.ts.`
      );
    },
  });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.clearAllMocks();
  if (typeof localStorage !== "undefined") localStorage.clear();
  if (typeof sessionStorage !== "undefined") sessionStorage.clear();
});

afterAll(() => {
  server.close();
});

if (typeof window !== "undefined" && typeof window.localStorage === "undefined") {
  const storage = new Map<string, string>();
  const localStorageMock = {
    getItem: (key: string) => (storage.has(key) ? storage.get(key)! : null),
    setItem: (key: string, value: string) => {
      storage.set(key, String(value));
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    clear: () => {
      storage.clear();
    },
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
    get length() {
      return storage.size;
    },
  };
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    writable: true,
    value: localStorageMock,
  });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    writable: true,
    value: localStorageMock,
  });
}

if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

if (typeof window !== "undefined" && !window.IntersectionObserver) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: MockIntersectionObserver,
  });
}

if (typeof window !== "undefined" && !window.ResizeObserver) {
  class MockResizeObserver implements ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: MockResizeObserver,
  });
}
