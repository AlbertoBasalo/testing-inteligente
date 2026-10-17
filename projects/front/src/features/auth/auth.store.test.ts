import { expect, test } from "vite-plus/test";
import { createSubmission, createSessionStore } from "./auth.store.ts";

test("submission state prevents overlapping requests and permits retry", () => {
  const submission = createSubmission();
  expect(submission.begin()).toBe(true);
  expect(submission.begin()).toBe(false);
  expect(submission.isSending).toBe(true);
  submission.finish();
  expect(submission.begin()).toBe(true);
});

test("session logic uses fake persistence and notifications without browser globals", () => {
  const writes: string[] = [];
  let removed = 0;
  let notifications = 0;
  const persistence = {
    readToken: () => null,
    writeToken(token: string) {
      writes.push(token);
    },
    clearToken() {
      removed++;
    },
  };
  const store = createSessionStore({
    persistence,
    notify() {
      notifications++;
    },
  });
  const user = {
    id: "user-id",
    email: "user@example.test",
    name: "User",
    role: "user" as const,
    createdAt: "2026-10-06T00:00:00.000Z",
  };
  expect(store.readUser()).toBe(undefined);
  store.setSession({ token: "opaque-token", user });
  expect(writes).toStrictEqual(["opaque-token"]);
  expect(store.readUser()).toBe(user);
  expect(notifications).toBe(1);
  store.clearSession();
  expect(removed).toBe(1);
  expect(store.readUser()).toBe(undefined);
  expect(notifications).toBe(2);
  store.restoreUser(user);
  expect(store.readUser()).toBe(user);
  expect(writes).toStrictEqual(["opaque-token"]);
  expect(notifications).toBe(3);
});
