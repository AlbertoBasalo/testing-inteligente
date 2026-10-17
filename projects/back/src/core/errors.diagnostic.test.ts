import { expect, test } from "vite-plus/test";
import { describeFailure } from "./errors.diagnostic.ts";

test("diagnostics distinguish messages and causes without enumerating attached secrets", () => {
  const error = new Error("Safe operation failed", { cause: new Error("Safe database cause") });
  Object.assign(error, {
    password: "secret-password",
    token: "secret-token",
    formValue: "private-form-value",
  });
  expect(describeFailure(error)).toBe(
    "Error: Safe operation failed <- caused by Error: Safe database cause",
  );
  expect(describeFailure(new Error("Different safe failure"))).not.toBe(describeFailure(error));
});
test("cyclic cause chain terminates without an arbitrary depth limit", () => {
  const error = new Error("Safe cyclic failure");
  error.cause = error;
  expect(describeFailure(error)).toBe("Error: Safe cyclic failure");
});
