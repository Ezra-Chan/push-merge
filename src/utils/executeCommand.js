#!/usr/bin/env node
"use strict";
const getStream = require("get-stream");

async function executeCommand(
  command,
  cwd = process.cwd(),
  returnValue = false,
  callback
) {
  const execa = await import("execa");
  return new Promise((resolve, reject) => {
    const child = execa.execaCommand(command, { cwd });
    if (returnValue) {
      getStream(child.stdout).then(value => {
        if (command.startsWith("git pull") || command.startsWith("git push")) {
          console.log("\n", value);
        }
        callback && callback();
        resolve(value);
      });
    }
    child.on("close", code => {
      if (code !== 0) {
        reject(new Error(`command failed: ${command}, ${code}`));
        return;
      }
      resolve();
    });
  });
}
module.exports = exports = { executeCommand };
