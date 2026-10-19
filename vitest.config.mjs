import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Maps '@/' to your root directory (adjust if your source files are in a 'src' folder)
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.js"],
    include: ["**/*.{test,spec}.{js,mjs,cjs,jsx,ts,tsx}"],
    css: false, // Disables parsing CSS files during testing to avoid processing errors
  },
});