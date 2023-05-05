"use strict";
const ora = require("ora");
const chalk = require("chalk");
const { executeCommand } = require("../src/utils/executeCommand.js");
const { errLog } = require("../src/utils/log.js");

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
    await executeCommand(`git push origin ${branch}`);
    spinner.succeed(chalk.green(`推送成功!`));
  } catch (error) {
    spinner.fail("推送失败!");
    errLog(error);
    process.exit();
  }
};
