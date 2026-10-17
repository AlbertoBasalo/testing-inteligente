import { expect, test } from "vite-plus/test";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { projectDirectory, readSettings } from "./settings.ts";

test("settings preserve configured values and project-relative paths from another directory", () => {
  const previous = process.cwd();
  process.chdir(tmpdir());
  try {
    const defaults = readSettings({});
    expect(defaults.sessionTtlHours).toBe(24);
    expect(defaults.bodyLimitKb).toBe(100);
    expect(defaults.logLevel).toBe("info");
    expect(defaults.host).toBe("0.0.0.0");
    expect(defaults.corsOrigins).toStrictEqual(["*"]);
    expect(defaults.databasePath).toBe(resolve(projectDirectory, "./data/app.sqlite"));
    expect(defaults.logDirectory).toBe(resolve(projectDirectory, "./logs"));
    const configured = readSettings({
      PORT: "65535",
      HOST: "127.0.0.1",
      SESSION_TTL_HOURS: "720",
      BODY_LIMIT_KB: "1",
      LOG_LEVEL: "debug",
      LOG_DIR: "./custom-logs",
      DATABASE_URL: "./custom-data/app.sqlite",
      CORS_ORIGIN: " https://first.example , https://second.example ",
    });
    expect(configured.port).toBe(65535);
    expect(configured.sessionTtlHours).toBe(720);
    expect(configured.bodyLimitKb).toBe(1);
    expect(configured.logLevel).toBe("debug");
    expect(configured.host).toBe("127.0.0.1");
    expect(configured.corsOrigins).toStrictEqual([
      "https://first.example",
      "https://second.example",
    ]);
    expect(configured.databasePath).toBe(resolve(projectDirectory, "./custom-data/app.sqlite"));
    expect(configured.logDirectory).toBe(resolve(projectDirectory, "./custom-logs"));
  } finally {
    process.chdir(previous);
  }
});
test("invalid numeric and log settings preserve named startup failures", () => {
  for (const value of ["0", "721", "1.5", "invalid", ""])
    expect(() => readSettings({ SESSION_TTL_HOURS: value })).toThrow(/SESSION_TTL_HOURS/);
  for (const value of ["0", "1.5", "invalid", ""])
    expect(() => readSettings({ BODY_LIMIT_KB: value })).toThrow(/BODY_LIMIT_KB/);
  expect(() => readSettings({ LOG_LEVEL: "invalid" })).toThrow(
    /LOG_LEVEL must be debug, info, warn or error/,
  );
});
