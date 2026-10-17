import { expect, test } from "vite-plus/test";
import { createAccountStore } from "./users.store.ts";

test("account state retains declared loaded or unavailable result", async () => {
  const store = createAccountStore({ read: async () => ({ status: "not-found" }) });
  expect(store.state.status).toBe("loading");
  expect(await store.load({ value: "missing" })).toStrictEqual({ status: "not-found" });
});
