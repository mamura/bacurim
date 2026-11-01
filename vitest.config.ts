import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const aliases = {
  "@": fileURLToPath(new URL("./src", import.meta.url)),
  "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
  "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
};

export default defineConfig({
  plugins: [react()],
  resolve: { alias: aliases },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "ui",
          environment: "jsdom",
          include: ["tests/ui/**/*.test.{ts,tsx}"],
          setupFiles: ["./tests/setup/ui.ts"],
          clearMocks: true,
          restoreMocks: true,
        },
      },
      {
        extends: true,
        resolve: {
          alias: {
            "server-only": fileURLToPath(
              new URL("./tests/setup/server-only.ts", import.meta.url),
            ),
          },
        },
        test: {
          name: "server",
          environment: "node",
          include: ["tests/server/**/*.test.ts", "tests/http/**/*.test.mts"],
          exclude: ["tests/http/api-integration.test.mts"],
          setupFiles: ["./tests/setup/server.ts"],
          clearMocks: true,
          restoreMocks: true,
        },
      },
    ],
  },
});
