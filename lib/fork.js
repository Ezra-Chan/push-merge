"use strict";
const ora = require("ora");
const chalk = require("chalk");
const { executeCommand } = require("../src/utils/executeCommand.js");
const { errLog } = require("../src/utils/log.js");

module.exports = async () => {
  const spinner = ora();
  spinner.text = "正在同步，请等待...";
  spinner.start();
  try {
    const upstream = await executeCommand(
      `git config --get remote.upstream.url`,
      undefined,
      true
    );
    if (upstream.indexOf("secondary/web-secondary--development") === -1) {
      await executeCommand(
        "git remote add upstream git@10.15.111.8:secondary/web-secondary--development.git"
      );
    }
    await executeCommand("git fetch upstream");
    const branch = await executeCommand(
      `git rev-parse --abbrev-ref HEAD`,
      undefined,
      true
    );
    await executeCommand(`git pull --rebase upstream ${branch}`);
    spinner.succeed(chalk.green(`同步完毕!`));
  } catch (error) {
    spinner.fail("同步失败!");
    errLog(error);
    process.exit();
  }
};
