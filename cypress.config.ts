import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    experimentalRunAllSpecs: true,
    specPattern: "_tests/e2e/**/*.{spec,cy}.ts",
    supportFile: "_tests/support/index.ts",
    fixturesFolder: "_tests/fixtures",
    env: {
      USER: process.env.CYPRESS_LOGIN,
      PASSWORD: process.env.CYPRESS_PASSWORD,
    },
  },
  fixturesFolder: "_tests/fixtures",
  supportFolder: "_tests/support",
});
