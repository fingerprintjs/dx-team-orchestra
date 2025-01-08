import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function generateIdentificationData(
  key: "requestId" | "visitorId",
  publicApiKey: string
): Promise<string> {
  const serverPath = __dirname;
  const htmlFile = "/identification.html";

  // Read and process the HTML file
  const htmlPath = path.join(serverPath, htmlFile);
  let htmlContent = await fs.readFile(htmlPath, { encoding: "utf-8" });

  // Replace placeholder with public API key
  htmlContent = htmlContent.replace("{{PUBLIC_API_KEY}}", publicApiKey);

  // Create a temporary HTML file with a unique name
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

    // Load the temporary HTML file
    await page.goto(`file://${tempHtmlPath}`);

    // Wait for the key to appear in localStorage
    const value = await page.evaluate(async (key) => {
      return new Promise<string>((resolve) => {
        const interval = setInterval(() => {
          const result = localStorage.getItem(key);
          if (result) {
            clearInterval(interval);
            resolve(result);
          }
        }, 100);
      });
    }, key);

    if (!value) {
      throw new Error(`Failed to retrieve ${key} from localStorage`);
    }

    return value;
  } finally {
    await fs.unlink(tempHtmlPath).catch((err) => {
      console.error(`Failed to delete temp file: ${tempHtmlPath}`, err);
    });
  }
}

export default generateIdentificationData;
