import {
  awaitTime,
  handleClick,
  setInputValue,
  awaitDom,
} from "../common/utils";

export default {
  name: "dataconnect",
  tests: [
    {
      name: "Merge Request",
      func: async ({ globalConfig, page, browser }) => {
        const ncp = await import("copy-paste");
        const { baseUrl, prefix, branch } = globalConfig;
        await page.goto(`${baseUrl}/onemind/onemind-web/-/merge_requests/new`);
        await awaitTime(1500);
        await handleClick({
          page,
          key: ".js-source-branch",
        });
        await awaitTime(500);
        await setInputValue({
          page,
          key: ".js-source-branch-dropdown > .dropdown-input > input",
          value: prefix + branch,
        });
        await awaitTime(300);
        await handleClick({
          page,
          key: `.js-source-branch-dropdown > .dropdown-content a[data-ref='${
            prefix + branch
          }']`,
        });
        await awaitTime(300);
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
        await awaitTime(300);
        await handleClick({
          page,
          key: "input[type='submit']",
        });
        await awaitTime(50000);
        // await handleClick({
        //   page,
        //   key: "input[type='submit']",
        // });
        // await awaitDom({ page, key: ".approve_button" });
        // const target2 = await browser.waitForTarget(
        //   t =>
        //     t
        //       .url()
        //       .includes(`${baseUrl}/onemind/onemind-web/-/merge_requests/`) &&
        //     !t.url().includes("new")
        // );
        // const page2 = await target2.page();
        // ncp.copy(page2.url());
        // await awaitTime(200);
      },
      time: 60000,
    },
  ],
};
