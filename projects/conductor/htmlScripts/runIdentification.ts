import {chromium} from "@playwright/test";
import {Agent, ExtendedGetResult, GetOptions, GetResult} from '@fingerprintjs/fingerprintjs-pro';
import * as path from "path";
import *as fs from "fs/promises";
import {fileURLToPath} from "url";

type DeriveGetResult<TExtended extends boolean> = TExtended extends true ? ExtendedGetResult : GetResult;

const serverPath = path.dirname(fileURLToPath(import.meta.url));

export type IdentifyOptions<TExtended extends boolean, TIP = unknown> = GetOptions<TExtended, TIP> & {
  publicApiKey: string
};

export async function identify<TExtended extends boolean, TIP = unknown>(
  {publicApiKey, ...options}: Readonly<IdentifyOptions<TExtended, TIP>>,
): Promise<DeriveGetResult<TExtended>> {
  const htmlFile = "/identification.html";

  // Read and process the HTML file
  const htmlPath = path.join(serverPath, htmlFile);
  let htmlContent = await fs.readFile(htmlPath, {encoding: "utf-8"});

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
    const value = await page.evaluate(async (params) => {
      return new Promise<DeriveGetResult<TExtended>>((resolve) => {
        const interval = setInterval(async () => {
          const agent = (window as any).FPJS as Agent | undefined;
          if (!agent) {
            return
          }

          const result = await agent.get(params as GetOptions<TExtended, TIP>);
          if (result) {
            clearInterval(interval);
            resolve(result);
          }
        }, 100);
      });
    }, options);

    if (!value) {
      throw new Error(`Failed to identify`);
    }

    return value;
  } finally {
    await fs.unlink(tempHtmlPath).catch((err) => {
      console.error(`Failed to delete temp file: ${tempHtmlPath}`, err);
    });
  }
}

/**
 * @deprecated Use {@link identify} instead
 * */
export async function generateIdentificationData(
  key: "requestId" | "visitorId",
  publicApiKey: string
): Promise<string> {
  const result = await identify({
    publicApiKey,
  })

  return key === 'requestId' ? result.requestId : result.visitorId;
}

export async function identifyBulk<TExtended extends boolean, TIP = unknown>(
  options: Readonly<IdentifyOptions<TExtended, TIP>>,
  size: number
) {
  return Promise.all(
    Array.from({length: size}).map(() => identify(options))
  )
}

export default generateIdentificationData;
