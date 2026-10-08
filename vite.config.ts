import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import path from "node:path";

// Vite bundles vite.config.ts into a temp file, so import.meta.url points to
// the bundle, not the source. process.cwd() is the project root in both dev
// and build contexts.
const r = (p: string) => path.resolve(process.cwd(), p);

export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    port: 3000,
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": r("."),
      buffer: "buffer/",
    },
  },
  // Node-only globals polyfill for legacy browser libs that reference them
  // during module evaluation. Two callers in this codebase:
  //   - `sockjs-client/lib/utils/browser-crypto.js` -> `if (global.crypto ...)`
  //   - `react-thermal-printer` -> `iconv-lite` -> `safer-buffer` (needs `Buffer`)
  // `define` is applied at the source level; the matching one inside
  // `optimizeDeps.esbuildOptions` ensures the same replacement happens for
  // pre-bundled deps in `node_modules/.vite/deps/`. The `buffer/` alias above
  // makes `require('buffer').Buffer` resolve to the npm `buffer` package.
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["buffer", "safer-buffer", "iconv-lite"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    svgr(),
    ...(process.env.BUILD_TARGET === "node"
      ? []
      : [cloudflare({ viteEnvironment: { name: "ssr" } })]),
    tanstackStart(),
    viteReact(),
  ],
});
