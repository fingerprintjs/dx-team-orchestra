import { chromium } from "playwright";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import testData from "./testData";

async function waitForServer(
  url: string,
  timeout: number = 5000
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Server at ${url} did not start within ${timeout}ms`);
}

async function generateRequestId() {
  const serverPath = path.resolve(process.cwd());
  const htmlFile = "generateRequestId.html";
  const serverUrl = "http://localhost:8080";

  const htmlPath = path.resolve(serverPath, htmlFile);
  let htmlContent = fs.readFileSync(htmlPath, "utf-8");

  if (!htmlContent) {
    throw new Error("Failed to read the HTML file");
  }

  htmlContent = htmlContent.replace(
    "{{PUBLIC_API_KEY}}",
    testData.generatidentification.publicApiKey
  );

  const tempHtmlPath = path.resolve(serverPath, "temp_generateRequestId.html");
  fs.writeFileSync(tempHtmlPath, htmlContent);

  const server = exec(`npx http-server ${serverPath} -p 8080`);

  try {
    await waitForServer(serverUrl);

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`${serverUrl}/temp_generateRequestId.html`);

    await page.waitForTimeout(2000);

    const requestId = await page.evaluate(() =>
      localStorage.getItem("requestId")
    );

    if (!requestId) {
      throw new Error("Failed to generate requestId");
    }

    return requestId;
  } finally {
    server.kill();

    fs.unlinkSync(tempHtmlPath);
  }
}

export default generateRequestId;
