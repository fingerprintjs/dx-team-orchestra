import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs/promises";
import testData from "../testData";

export async function generateRequestId() {
  const serverPath = path.resolve(process.cwd());
  const htmlFile = "htmlScripts/nodeRequestID.html";

  const htmlPath = path.join(serverPath, htmlFile);
  let htmlContent = await fs.readFile(htmlPath, { encoding: "utf-8" });

  htmlContent = htmlContent.replace(
    "{{PUBLIC_API_KEY}}",
    testData.generatidentification.publicApiKey
  );

  const tempHtmlPath = path.join(serverPath, "temp_generateRequestId.html");
  await fs.writeFile(tempHtmlPath, htmlContent);

  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`file://${tempHtmlPath}`);

    await page.waitForTimeout(2000);

    const requestId = await page.evaluate(() =>
      localStorage.getItem("requestId")
    );

    if (!requestId) {
      throw new Error("Failed to generate requestId");
    }

    return requestId;
  } finally {
    await fs.unlink(tempHtmlPath);
  }
}

export default generateRequestId;
