"use strict";
const fs = require("fs-extra");
const path = require("path");
const { executeCommand } = require("../src/utils/executeCommand.js");
const { successLog, errLog } = require("../src/utils/log.js");

const writeFile = async type => {
  fs.writeFileSync(
    path.resolve(__dirname, "../type.js"),
    `export const type = '${type}';`,
    "utf-8"
  );
};

module.exports = async () => {
  try {
    const push = require("./push-head.js");
    const func = () => {
      return new Promise((resolve, reject) => {
        push(resolve, reject);
      });
    };
    await func();
    await writeFile("onemind");
    await executeCommand(`npm run test`, __dirname, true, () => {
      successLog("merge地址已复制到剪贴板!");
    });
  } catch (error) {
    errLog(error);
    process.exit();
  }
};
