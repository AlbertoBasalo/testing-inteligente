import { expect, test } from "vite-plus/test";
import { DatabaseSync } from "node:sqlite";
import { migrateDatabase } from "./database.ts";
import { readSettings } from "./settings.ts";

test("settings reject invalid PORT instead of using its default", () => {
  for (const PORT of ["0", "65536", "3.5", "abc", ""])
    expect(() => readSettings({ PORT })).toThrow(/PORT/);
  expect(readSettings({}).port).toBe(3000);
});
test("migrations are recorded once and unknown versions fail", () => {
  const database = new DatabaseSync(":memory:");
  migrateDatabase(database);
  migrateDatabase(database);
  expect(database.prepare("SELECT COUNT(*) AS count FROM schema_versions").get()?.count).toBe(3);
  database
    .prepare("INSERT INTO schema_versions VALUES (?, ?)")
    .run("9999-unknown.sql", new Date().toISOString());
  expect(() => migrateDatabase(database)).toThrow(/9999-unknown.sql/);
  database.close();
});
