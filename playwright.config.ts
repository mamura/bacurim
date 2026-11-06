import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e/specs",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 12_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: "npm run build && npm start -- --port 3100",
    wait: { stdout: /Ready in/ },
    stdout: "pipe",
    timeout: 120_000,
    reuseExistingServer: false,
    env: {
      NEXT_PUBLIC_API_ORIGIN: "http://127.0.0.1:8011",
      APP_URL: "http://127.0.0.1:3100",
      API_MOCKS_ENABLED: "false",
      NEXT_TELEMETRY_DISABLED: "1",
      ENABLE_UI_PREVIEW: "false",
      ENABLE_ARCHITECTURE_PREVIEW: "false",
      ENABLE_HTTP_PREVIEW: "false",
    },
  },
});
