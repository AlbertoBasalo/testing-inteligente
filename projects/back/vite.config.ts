import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    name: "back",
    include: ["src/**/*.test.ts"],
  },
});
