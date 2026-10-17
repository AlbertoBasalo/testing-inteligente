import { expect, test } from "vite-plus/test";
import { createHealthStore } from "./health.store.ts";

test("health store progresses from loading to loaded or unavailable", async () => {
  const health = { status: "ok" as const, runs: 3, uptime: 2 };
  const available = createHealthStore({ read: async () => health });
  expect(available.state.status).toBe("loading");
  expect(await available.load()).toStrictEqual({ status: "loaded", health });
  const unavailable = createHealthStore({ read: async () => undefined });
  expect(await unavailable.load()).toStrictEqual({ status: "unavailable" });
});
