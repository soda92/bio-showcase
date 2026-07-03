#!/usr/bin/env -S deno run -A --watch=static/,routes/
import { tailwind } from "@fresh/plugin-tailwind";

import { Builder } from "fresh/dev";
import { app } from "./main.ts";

const builder = new Builder();
tailwind(builder, {});
if (Deno.args.includes("build")) {
  const applySnapshot = await builder.build();
  applySnapshot(app);
} else {
  await builder.listen(() => Promise.resolve(app));
}