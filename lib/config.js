#!/usr/bin/env node
"use strict";
const inquirer = require("inquirer");
const { errLog } = require("../src/utils/log.js");

module.exports = () => {
  let promptList = [
    {
      type: "input",
      name: "prefix",
      message: "请输入分支前缀",
      validate(val) {
        if (val.trim() !== "") {
          return true;
        }
        return "前缀不能为空！";
      },
    },
    {
      type: "input",
      name: "account",
      message: "请输入Gitlab账号",
      validate(val) {
        if (val.trim() !== "") {
          return true;
        }
        return "账号不能为空！";
      },
    },
    {
      type: "input",
      name: "password",
      message: "请输入Gitlab密码",
      validate(val) {
        if (val.trim() !== "") {
          return true;
        }
        return "密码不能为空！";
      },
    },
  ];
  inquirer.prompt(promptList).then(async (answer = {}) => {
    try {
      const path = await import("path");
      const fs = await import("fs-extra");
      const { prefix, account, password } = answer;
      const config = JSON.stringify({ prefix, account, password });
      fs.default.writeFileSync(
        path.resolve(__dirname, "../config.json"),
        config,
        "utf-8"
      );
    } catch (error) {
      errLog(error);
      process.exit();
    }
  });
};
