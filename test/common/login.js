import { setInputValue, handleClick, awaitTime } from "./utils";
// app login
export const appLogin = async ({ globalConfig, page, browser }) => {
  const { baseUrl, account, password } = globalConfig;
  await page.goto(`${baseUrl}/users/sign_in`);
  await setInputValue({
    page,
    key: "#user_login",
    value: account,
  });
  await setInputValue({
    page,
    key: "#user_password",
    value: password,
  });
  await handleClick({ page, key: "input[type='submit']" });
  await awaitTime(1000);
};
