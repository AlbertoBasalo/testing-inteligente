import { expect, test } from "vite-plus/test";
import { readAccount } from "./users.service.ts";

test("account exposes only own public details and hides other identifiers", () => {
  const user = { id: "own", name: "Name", email: "email", role: "user", createdAt: "date" };
  expect(readAccount({ id: "own", user })).toStrictEqual({
    name: "Name",
    email: "email",
    createdAt: "date",
  });
  expect(() => readAccount({ id: "other", user })).toThrow(/Not found/);
});
