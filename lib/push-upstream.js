"use strict";
const ora = require("ora");
const chalk = require("chalk");
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

const writeBranch = async branch => {
  const temp = JSON.stringify({ branch });
  fs.writeFileSync(
    path.resolve(__dirname, "../branch.js"),
    "export const branch = " + temp,
    "utf-8"
  );
};

module.exports = async mergeFlag => {
  const spinner = ora();
  spinner.text = "正在推送，请等待...";
  spinner.start();
  try {
    let branch = await executeCommand(
      `git rev-parse --abbrev-ref HEAD`,
      undefined,
      true
    );
    branch = branch.slice(0, -1);
    await writeBranch(branch);
    await executeCommand(`git push`, undefined, true);
    spinner.succeed(chalk.green(`推送成功!`));
    if (mergeFlag) {
      await writeFile("secondary");
      await executeCommand(`npm run test`, __dirname, true, () => {
        successLog("merge地址已复制到剪贴板!");
      });
    }
  } catch (error) {
    errLog(error);
    process.exit();
  }
};
