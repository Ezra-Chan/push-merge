"use strict";
const { executeCommand } = require("../src/utils/executeCommand.js");
const { successLog, errLog } = require("../src/utils/log.js");

module.exports = async () => {
  try {
    const push = require("./push-head.js");
    const func = () => {
      return new Promise((resolve, reject) => {
        push(resolve, reject);
      });
    };
    await func();
    await executeCommand(`npm run start`, __dirname, true, () => {
      successLog("merge地址已复制到剪贴板!");
    });
  } catch (error) {
    errLog(error);
    process.exit();
  }
};
