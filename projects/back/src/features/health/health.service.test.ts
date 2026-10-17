import { expect, test } from "vite-plus/test";
import { createHealthService } from "./health.service.ts";

test("health records startup and reads count through its repository", () => {
  let runs = 4;
  const service = createHealthService({
    recordRun() {
      runs++;
    },
    countRuns() {
      return runs;
    },
  });
  const health = service.read();
  expect(health.status).toBe("ok");
  expect(health.runs).toBe(5);
  expect(health.uptime > 0).toBeTruthy();
  expect(service.read().uptime > health.uptime).toBeTruthy();
});
