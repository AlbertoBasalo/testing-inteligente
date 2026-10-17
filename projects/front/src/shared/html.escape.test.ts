import { expect, test } from "vite-plus/test";
import { escapeHtml } from "./html.escape.ts";

test("escapeHtml protects text and quoted attributes", () => {
  expect(escapeHtml("<script>\"&'")).toBe("&lt;script&gt;&quot;&amp;&#39;");
});
