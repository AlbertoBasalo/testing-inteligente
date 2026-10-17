import { expect, test } from "vite-plus/test";
import { DatabaseSync } from "node:sqlite";
import { composeApplication } from "./app.compose.ts";
import { migrateDatabase } from "./core/database.ts";

test("composition registers independent applications without listening", () => {
  const database = new DatabaseSync(":memory:");
  migrateDatabase(database);
  const first = composeApplication({ database });
  const second = composeApplication({ database });
  expect(first).not.toBe(second);
  expect(typeof first.listen).toBe("function");
  database.close();
});
