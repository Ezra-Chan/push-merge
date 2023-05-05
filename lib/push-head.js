"use strict";
const ora = require("ora");
const ncp = require("copy-paste");
const chalk = require("chalk");
const { executeCommand } = require("../src/utils/executeCommand.js");
const { errLog, successLog } = require("../src/utils/log.js");

module.exports = async () => {
  const spinner = ora();
  spinner.text = "正在推送，请等待...";
  spinner.start();
  try {
    const branch = await executeCommand(
      `git rev-parse --abbrev-ref HEAD`,
      undefined,
      true
    );
    await executeCommand(`git push origin HEAD:cx_${branch}`);
    spinner.succeed(chalk.green(`推送成功!`));
    ncp.copy(branch);
    successLog("分支已复制到剪贴板！");
  } catch (error) {
    spinner.fail("推送失败!");
    errLog(error);
    process.exit();
  }
};
