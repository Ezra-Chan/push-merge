import puppeteer from "puppeteer";
import { BASE_URL } from "./common/constant";
import { appLogin } from "./common/login";
import testLists from "./tests";
import { branch } from "../branch";
// import config from "../config.json";
const config = require("../config.json");

let browser;
let page;
// 全局配置
const globalConfig = {
  baseUrl: BASE_URL,
  urlMap: {},
  ...branch,
  ...config,
};

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === "production", // true 不打开浏览器 false 打开浏览器,
    args: ["--no-sandbox"],
    defaultViewport: {
      width: 1920,
      height: 980,
    },
  });
  page = await browser.newPage();
  //登录
  await appLogin({ globalConfig, page, browser });
}, 20000);

for (let index = 0; index < testLists.length; index++) {
  const item = testLists[index];
  const tests = item.tests || [];
  const total = tests.length;
  describe(item.name, () => {
    for (let i = 0; i < total; i++) {
      const it = tests[i];
      const { name, func, time } = it;
      const logText = `${name}: test`;
      //初始化数据
      globalConfig.urlMap = {};
      if (time) {
        test(
          name,
          async () => {
            console.info(logText);
            await func({ globalConfig, page, browser });
          },
          time
        );
      } else {
        test(name, async () => {
          console.info(logText);
          await func({ globalConfig, page, browser });
        });
      }
    }
  });
}

afterAll(async () => {
  await browser.close(); // 关闭浏览器
  console.info("JEST END!");
});
