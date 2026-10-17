import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    name: "front",
    include: ["src/**/*.test.ts"],
  },
});
