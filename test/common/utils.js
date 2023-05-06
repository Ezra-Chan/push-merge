export const replacePage = async ({ browser, globalConfig, url }) => {
  const { baseUrl } = globalConfig;
  const target = await browser.waitForTarget(t =>
    t.url().includes(`${baseUrl}${url}`)
  );
  const page1 = await target.page();
  await awaitTime(500);
  return page1;
};

// 给Input框设值
export const setInputValue = async ({ page, key, value, clickCount = 0 }) => {
  try {
    await awaitDom({ page, key });
    const dom = await page.$(key);
    if (clickCount > 0) {
      await dom.click({ clickCount });
    }
    await dom.type(value);
    //console.log(key);
  } catch (e) {
    // console.log(e);
  }
};

//dom 元素点击
export const handleClick = async ({ page, key, index }) => {
  try {
    if (index >= 0) {
      await awaitDom({ page, key });
      const dom = await page.$(key);
      console.log("dom: ", dom, key);
      await dom[index].click();
    } else {
      await awaitDom({ page, key });
      const dom = await page.$(key);
      await dom.click();
    }
  } catch (e) {
    // console.log(e);
  }
};

//dom 元素hover
export const handleHover = async ({ page, key }) => {
  try {
    await awaitDom({ page, key });
    const dom = await page.$(key);
    await dom.hover();
  } catch (e) {
    // console.log(e);
  }
};
//获取元素信息
export const pageEval = async ({ page, key, evalFunc }) => {
  let value;
  try {
    await awaitDom({ page, key });
    value = await page.$eval(key, evalFunc);
  } catch (e) {
    //console.log(e);
  }
  return value;
};
//等待执行
export const awaitTime = async (time = 1) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
// 等待元素出现
export const awaitDom = async ({ page, key }) => {
  try {
    await page.waitForSelector(key);
  } catch (e) {
    //console.log(e);
  }
};
// 校验结果
export const checkResult = async params => {
  const { condition, name, page } = params;
  if (condition) {
    console.info(`${name}: pass!`);
  } else {
    const time = new Date();
    const imageName = `./images/${name}${time.valueOf()}.png`;
    await page.screenshot({ path: imageName });
    console.info(`${name}: failed! 截图${imageName}`);
  }
};

// 请求接口
export const queryCheck = async (page, globalConfig, url) => {
  const result = globalConfig.urlMap[url] || {};
  const status = result.status || 0;
  await checkResult({
    condition: status === 200,
    name: "请求成功",
    page: page,
  });
  expect(status).toEqual(200);
};
export const changePage = async browser => {
  let pages = await browser.pages();
  return (await browser.pages())[pages.length - 1];
};

export const addPageOnResponse = async (globalConfig, page) => {
  await page.on("response", async response => {
    const url = response.url();
    if (url.includes("/sdata/rest")) {
      try {
        let urlObj = new URL(url);
        const key = urlObj.pathname;
        const json = await response.json();
        globalConfig.urlMap[key] = {
          status: json.status,
          message: json.message,
        };
      } catch (e) {}
    }
  });
};
//获取当前打开的页面数量
export const getPageNum = async browser => {
  let pages = await browser.pages();
  return pages.length - 1;
};
//获取dom元素的指定属性值
export const getDomPropertyValue = async (page, key, property) => {
  return await (await (await page.$(key)).getProperty(property)).jsonValue();
};

//获取dom元素的X,Y坐标
export const getDomXY = async ({ page, key }) => {
  try {
    await awaitDom({ page, key });
    let tmpElement = await page.$(key);
    return await tmpElement.boundingBox();
  } catch (e) {
    console.log(e);
  }
};

//控制鼠标移动
export const moveMouse = async (page, x, y) => {
  await page.mouse.move(x, y);
};

export const checkUrlResult = async ({ page, url, message }) => {
  try {
    await page.waitForResponse(async res => {
      const resUrl = res.url();
      if (resUrl.indexOf(url) > -1) {
        const json = await res.json();
        const status = json.status || 0;
        await checkResult({
          condition: status === 200,
          name: message || "请求成功",
          page: page,
        });
        expect(status).toEqual(200);
        return resUrl;
      }
    });
  } catch (e) {
    //console.log(e)
  }
};
