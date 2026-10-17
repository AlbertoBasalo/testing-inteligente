import { expect, test } from "vite-plus/test";
import { DatabaseSync } from "node:sqlite";
import express from "express";
import request from "supertest";
import { completeServer } from "../../core/server.ts";
import { migrateDatabase } from "../../core/database.ts";
import { mountRegistrations } from "../../core/session.ts";
import { createAuthRepository } from "./auth.repository.ts";
import { createAuthService } from "./auth.service.ts";
import { Email } from "../../shared/email.value.ts";
import { tokenHash } from "./auth.password.service.ts";

test("credentials are salted and only token hash is stored; expired session is invalid", async () => {
  const database = new DatabaseSync(":memory:");
  migrateDatabase(database);
  const auth = createAuthService({
    repository: createAuthRepository(database),
    sessionTtlHours: 24,
  });
  const email = new Email("UNIT@example.test");
  await auth.register({ email, name: "Unit", password: "password" });
  const logged = await auth.login({ email, password: "password" });
  const row = database.prepare("SELECT * FROM sessions").get()!;
  expect(row.tokenHash).toBe(tokenHash(logged.token));
  expect(Object.values(row).includes(logged.token)).toBe(false);
  expect(auth.resolve(logged.token)).toBeTruthy();
  database.exec("UPDATE sessions SET expiresAt = '2000-01-01T00:00:00.000Z'");
  expect(auth.resolve(logged.token)).toBe(undefined);
  expect(String(database.prepare("SELECT passwordHash FROM users").get()?.passwordHash)).toMatch(
    /^scrypt\$131072\$8\$1\$/,
  );
  await expect(
    auth.login({ email: new Email("unknown@example.test"), password: "wrong" }),
  ).rejects.toThrow(/Invalid credentials/);
  database.close();
});
test("registration is protected unless marked public", async () => {
  const application = express();
  mountRegistrations(application, {
    resolve: () => undefined,
    registrations: [
      {
        basePath: "/api/test",
        register(router) {
          router.get("/", (_request, response) => {
            response.json({ ok: true });
          });
        },
      },
    ],
  });
  completeServer(application);
  const response = await request(application).get("/api/test");
  expect(response.status).toBe(401);
});
