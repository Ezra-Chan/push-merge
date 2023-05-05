"use strict";
const ora = require("ora");
const ncp = require("copy-paste");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const { executeCommand } = require("../src/utils/executeCommand.js");
const { errLog, successLog } = require("../src/utils/log.js");

const writeBranch = async branch => {
  const temp = JSON.stringify({ branch });
  fs.writeFileSync(
    path.resolve(__dirname, "../branch.js"),
    "export const branch = " + temp,
    "utf-8"
  );
};

const errorFunc = (error, spinner) => {
  spinner.fail("推送失败!");
  if (error?.toString()?.includes?.("config.json")) {
    errLog("请先用`pm config`或者`pm c`命令设置Gitlab账号密码及分支前缀!");
  } else {
    errLog(error);
  }
  process.exit();
};

module.exports = async () => {
  const spinner = ora();
  spinner.text = "正在推送，请等待...";
  spinner.start();
  try {
    fs.readFile(
      path.resolve(__dirname, "../config.json"),
      "utf-8",
      async (err, data) => {
        if (err) {
          errorFunc(err, spinner);
        }
        const config = JSON.parse(data);
        let branch = await executeCommand(
          `git rev-parse --abbrev-ref HEAD`,
          undefined,
          true
        );
        branch = branch.slice(0, -1);
        await executeCommand(`git push origin HEAD:${config.prefix}${branch}`);
        spinner.succeed(chalk.green(`推送成功!`));
        await writeBranch(branch);
        ncp.copy(branch);
        successLog("分支已复制到剪贴板！");
        await executeCommand(`npm run test`, __dirname, true, () => {
          successLog("merge地址已复制到剪贴板!");
        });
      }
    );
  } catch (error) {
    errorFunc(error);
  }
};
