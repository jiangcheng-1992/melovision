/**
 * Manual browser-console test for the music page "continue to next step" loading state.
 *
 * Usage:
 * 1. Open the MeloVision music page in the browser.
 * 2. Open DevTools Console.
 * 3. Paste this file content and run it.
 *
 * Expected:
 * - The "continue" button is found and clicked.
 * - The top progress bar appears.
 * - The loading message appears.
 * - The button becomes disabled or changes text to a loading state.
 */

(async () => {
  const BUTTON_SELECTOR = '[data-testid="music-next-step-button"]';
  const PROGRESS_TRACK_SELECTOR = '[data-testid="music-next-step-progress-track"]';
  const PROGRESS_BAR_SELECTOR = '[data-testid="music-next-step-progress-bar"]';
  const MESSAGE_SELECTOR = '[data-testid="music-next-step-loading-message"]';

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function waitForElement(selector, timeoutMs = 3000) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
      await wait(50);
    }

    throw new Error(`元素未出现: ${selector}`);
  }

  function getProgressWidth(progressBar) {
    const width = progressBar instanceof HTMLElement ? progressBar.style.width : "";
    return width || "(empty)";
  }

  console.group("MeloVision Next-Step Progress Test");

  try {
    const button = await waitForElement(BUTTON_SELECTOR, 1500);
    console.log("找到按钮:", button);

    if (!(button instanceof HTMLButtonElement)) {
      throw new Error("下一步控件不是 button 元素");
    }

    const beforeText = button.textContent?.trim() || "";
    console.log("点击前文案:", beforeText);

    button.click();
    console.log("已触发点击");

    const progressTrack = await waitForElement(PROGRESS_TRACK_SELECTOR, 1500);
    const progressBar = await waitForElement(PROGRESS_BAR_SELECTOR, 1500);
    const message = await waitForElement(MESSAGE_SELECTOR, 1500);

    await wait(250);

    const afterText = button.textContent?.trim() || "";
    const disabled = button.disabled;
    const progressWidth = getProgressWidth(progressBar);
    const messageText = message.textContent?.trim() || "";

    console.log("点击后文案:", afterText);
    console.log("按钮 disabled:", disabled);
    console.log("进度条宽度:", progressWidth);
    console.log("提示文案:", messageText);

    if (!progressTrack) {
      throw new Error("未检测到进度条容器");
    }

    if (!String(progressWidth).includes("%")) {
      throw new Error(`进度条宽度异常: ${progressWidth}`);
    }

    if (!messageText.includes("正在进入分镜阶段")) {
      throw new Error(`未检测到预期加载文案: ${messageText}`);
    }

    if (!disabled && !afterText.includes("正在加载分镜")) {
      throw new Error("按钮未进入加载态");
    }

    console.log("测试通过: 点击后成功显示加载进度条和提示文案。");
  } catch (error) {
    console.error("测试失败:", error);
    throw error;
  } finally {
    console.groupEnd();
  }
})();
