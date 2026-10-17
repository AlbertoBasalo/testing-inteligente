import { expect, test } from "vite-plus/test";
import { formatFact, isEndAligned, listMessage, missingValue } from "./record.format.ts";

test("a missing fact shows a dash, never undefined, null or an empty value", () => {
  expect(formatFact("text", undefined)).toBe(missingValue);
  expect(formatFact("text", "  ")).toBe(missingValue);
  expect(formatFact("list", [])).toBe(missingValue);
  expect(formatFact("number", undefined)).toBe(missingValue);
});
test("facts keep their kind when they show", () => {
  expect(formatFact("list", ["Vite", "Pico CSS"])).toBe("Vite, Pico CSS");
  expect(formatFact("number", 1234)).toMatch(/^1\D?234$/);
  expect(formatFact("duration", 65)).toMatch(/\d/);
});
test("numbers, dates and durations align to the end of a table cell", () => {
  expect(isEndAligned("number")).toBe(true);
  expect(isEndAligned("date")).toBe(true);
  expect(isEndAligned("duration")).toBe(true);
  expect(isEndAligned("text")).toBe(false);
  expect(isEndAligned("list")).toBe(false);
});
test("an empty list shows its empty message in the place of the table", () => {
  expect(listMessage(0, "No projects")).toBe("No projects");
  expect(listMessage(2, "No projects")).toBe(undefined);
});
