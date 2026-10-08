import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

// Vite bundles vitest.config.ts into a temp file, so import.meta.url points
// to the bundle, not the source. process.cwd() is the project root in both
// dev and test contexts.
const r = (p: string) => path.resolve(process.cwd(), p);

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify("https://api.my-menu.net"),
    "import.meta.env.VITE_FRONTEND_URL": JSON.stringify("http://localhost:3000"),
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    clearMocks: true,
    restoreMocks: true,
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "hooks/**/*.{test,spec}.{ts,tsx}",
      "components/**/*.{test,spec}.{ts,tsx}",
      "utils/**/*.{test,spec}.{ts,tsx}",
      "lib/**/*.{test,spec}.{ts,tsx}",
      "validators/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["node_modules/", "e2e/", "dist/"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "src/types/",
        "src/server/",
        "**/*.d.ts",
        "src/routeTree.gen.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": r("."),
    },
  },
});
