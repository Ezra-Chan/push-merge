import {
  awaitTime,
  handleClick,
  setInputValue,
  awaitDom,
} from "../common/utils";

const target = "secondary/web-secondary--development";

export default {
  name: "secondary",
  tests: [
    {
      name: "Merge Request",
      func: async ({ globalConfig, page, browser }) => {
        const ncp = await import("copy-paste");
        const { path, branch } = globalConfig;
        await page.goto(`${path}/-/merge_requests/new`);
        await awaitTime(1500);
        // 选择源分支
        await handleClick({
          page,
          key: ".js-source-branch",
        });
        await awaitTime(500);
        await setInputValue({
          page,
          key: ".js-source-branch-dropdown > .dropdown-input > input",
          value: branch,
        });
        await awaitTime(300);
        await handleClick({
          page,
          key: `.js-source-branch-dropdown > .dropdown-content a[data-ref='${branch}']`,
        });
        await awaitTime(300);

        // 选择目标仓库
        await handleClick({
          page,
          key: ".js-target-project",
        });
        await awaitTime(500);
        await setInputValue({
          page,
          key: ".dropdown-target-project > .dropdown-input > input",
          value: target,
        });
        await awaitTime(300);
        await handleClick({
          page,
          key: `.dropdown-target-project > .dropdown-content a[data-refs-url='/${target}/refs']`,
        });

        // 选择目标分支
        await handleClick({
          page,
          key: ".js-target-branch",
        });
        await awaitTime(500);
        await setInputValue({
          page,
          key: ".js-target-branch-dropdown > .dropdown-input > input",
          value: branch,
        });
        await awaitTime(300);
        await handleClick({
          page,
          key: `.js-target-branch-dropdown > .dropdown-content a[data-ref='${branch}']`,
        });
        await awaitTime(1000);

        // 点击提交
        await handleClick({
          page,
          key: "input[type='submit']",
        });
        await awaitTime(500);
        await handleClick({
          page,
          key: "input[type='submit']",
        });
        await awaitDom({ page, key: ".approve_button" });
        const reg = /\/-\/merge_requests\/\d{4,5}/;
        const target2 = await browser.waitForTarget(t => reg.test(t.url()), {
          timeout: 10 * 1000,
        });
        const page2 = await target2.page();
        ncp.copy(page2.url());
        await awaitTime(200);
      },
      time: 60000,
    },
  ],
};
