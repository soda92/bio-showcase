import { assertEquals } from "jsr:@std/assert@^0.224.0";
import { render } from "npm:preact-render-to-string@^6.5.1";
import { signal } from "@preact/signals";
import Counter from "./islands/Counter.tsx";

Deno.test("Counter renders correct count value", () => {
  const count = signal(42);
  const html = render(<Counter count={count} />);
  assertEquals(html.includes("42"), true);
});
