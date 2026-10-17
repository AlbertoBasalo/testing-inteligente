import { expect, test } from "vite-plus/test";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createLogger } from "./logger.ts";

test("logger filters levels and flushes single plain-text lines", async () => {
  const directory = await mkdtemp(join(tmpdir(), "logger-"));
  const logger = createLogger({ directory, level: "warn" });
  logger.write("info", "hidden");
  logger.write("warn", "first\nsecond");
  await logger.flush();
  const files = await readdir(directory);
  const text = await readFile(join(directory, files[0]!), "utf8");
  expect(text).toMatch(/^\d{2}:\d{2}:\d{2}\.\d{3} back WARN first \| second\n$/);
  expect(text.includes("hidden")).toBe(false);
  await rm(directory, { recursive: true, force: true });
});
