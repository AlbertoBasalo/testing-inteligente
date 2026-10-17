import { expect, test } from "vite-plus/test";
import { readAuthInput } from "./auth.controller.ts";
import { ExpectedError } from "../../shared/error.type.ts";

function catchDetails(action: () => unknown) {
  try {
    action();
  } catch (error) {
    expect(error).toBeInstanceOf(ExpectedError);
    return (error as ExpectedError).details;
  }
  throw new Error("Expected an error");
}

test("auth input aggregates every field error for register and login", () => {
  for (const isRegister of [true, false]) {
    const details = catchDetails(() =>
      readAuthInput({ email: 3, name: " ", password: "" }, isRegister),
    );
    expect(details.status).toBe(400);
    expect(details.fields).toStrictEqual(
      isRegister
        ? {
            email: "email is required",
            name: "name is required",
            password: "password is required",
          }
        : { email: "email is required", password: "password is required" },
    );
  }
});
test("auth modes normalize identity while preserving original password", () => {
  const input = { email: " USER@EXAMPLE.TEST ", name: " Name ", password: " secret " };
  const registered = readAuthInput(input, true);
  const login = readAuthInput(input, false);
  expect(registered.email.value).toBe("user@example.test");
  expect(registered.name).toBe("Name");
  expect(registered.password).toBe(" secret ");
  expect(login.email.value).toBe(registered.email.value);
  expect(login.name).toBe("");
  expect(login.password).toBe(input.password);
});
test("register rejects a password shorter than four characters", () => {
  const input = { email: "user@example.test", name: "Name", password: "123" };
  const details = catchDetails(() => readAuthInput(input, true));
  expect(details.status).toBe(400);
  expect(details.fields).toStrictEqual({ password: "Password too short" });
  expect(readAuthInput({ ...input, password: "1234" }, true).password).toBe("1234");
  expect(readAuthInput(input, false).password).toBe("123");
});
