import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "browser.spec.ts",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:43187",
    browserName: "chromium",
    channel: process.env.PW_CHANNEL ?? "msedge",
  },
  webServer: {
    command:
      "node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 43187 --strictPort",
    url: "http://127.0.0.1:43187",
    reuseExistingServer: true,
    timeout: 20000,
  },
});
