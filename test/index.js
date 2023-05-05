#!/usr/bin/env node
"use strict";
const main = async () => {
  const path = await import("path");
  const fs = await import("fs-extra");
  const args = process.argv.slice(2);
  const [branch = "V8R4C100"] = args;
  const temp = JSON.stringify({ branch });
  fs.default.writeFileSync(
    path.resolve(__dirname, "../temp.js"),
    "export const temp = " + temp,
    "utf-8"
  );
};
main();
