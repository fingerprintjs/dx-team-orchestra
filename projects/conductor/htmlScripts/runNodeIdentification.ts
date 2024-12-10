import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs/promises";
import testData from "../utils/testData";

export async function generateRequestId(key: "requestId" | "visitorId") {
  const serverPath = path.resolve(process.cwd());
  const htmlFile = "htmlScripts/nodeIdentification.html";

  const htmlPath = path.join(serverPath, htmlFile);
  let htmlContent = await fs.readFile(htmlPath, { encoding: "utf-8" });

  htmlContent = htmlContent.replace(
    "{{PUBLIC_API_KEY}}",
    testData.generatidentification.publicApiKey
  );

  const tempHtmlPath = path.join(
    serverPath,
    `temp_nodeIdentification-${Date.now()}-${Math.random()
      .toString(10)
      .substring(2, 5)}.html`
  );
  await fs.writeFile(tempHtmlPath, htmlContent);

  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`file://${tempHtmlPath}`);

    await page.waitForTimeout(2000);
    const value = await page.evaluate(async (key) => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          const result = localStorage.getItem(key);
          if (result) {
            clearInterval(interval);
            resolve(result);
          }
        }, 100); // Check every 100ms
      });
    }, key);

    if (!value) {
      throw new Error(`Failed to generate ${key}`);
    }

    return value;
  } finally {
    await fs.unlink(tempHtmlPath);
  }
}

export default generateRequestId;
