import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
    jsx: "automatic",
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
    restoreMocks: true,
  },
});
