import { expect, test, vi } from "vite-plus/test";
import type { Server } from "node:http";
import type { DatabaseSync } from "node:sqlite";
import { registerShutdown } from "./shutdown.ts";

test("timeout and late close use one finalizer and keep failure", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  vi.spyOn(process, "disconnect").mockImplementation(() => {});
  const listeners = process.listeners("message");
  const previousCode = process.exitCode;
  let closes = 0;
  let forced = 0;
  let closeCallback: ((error?: Error) => void) | undefined;
  const server = {
    close(callback: typeof closeCallback) {
      closeCallback = callback;
    },
    closeAllConnections() {
      forced++;
    },
  } as unknown as Server;
  registerShutdown(server, {
    database: {
      close() {
        closes++;
      },
    } as DatabaseSync,
    logger: { write() {}, flush: async () => {} },
  });
  const stop = process.listeners("message").find((listener) => !listeners.includes(listener))!;
  stop.call(process, "shutdown", undefined);
  vi.advanceTimersByTime(5000);
  expect(forced).toBe(1);
  expect(closes).toBe(1);
  expect(process.exitCode).toBe(1);
  closeCallback?.();
  await Promise.resolve();
  expect(closes).toBe(1);
  expect(process.exitCode).toBe(1);
  process.removeListener("message", stop);
  process.exitCode = previousCode;
  vi.useRealTimers();
  vi.restoreAllMocks();
});
