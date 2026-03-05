import { Browser, BrowserContext, chromium, devices } from '@playwright/test'
import { Agent, GetOptions, GetResult } from '@fingerprint/agent'
import * as path from 'path'
import * as fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { getRandomElement } from '../utils/array'

// @ts-ignore
const serverPath = path.dirname(fileURLToPath(import.meta.url))

export type IdentifyOptions = GetOptions & {
  publicApiKey: string
  device?: (typeof devices)[string]
}

export type IdentifyResult = Omit<GetResult, 'sealedResult'> & {
  sealed_result?: string
}

export function getRandomDevice() {
  return getRandomElement(Object.values(devices))
}

export async function identify(
  browser: Browser,
  { publicApiKey, device = getRandomDevice(), ...options }: Readonly<IdentifyOptions>
): Promise<IdentifyResult> {
  // Read and process the HTML file
  const htmlPath = path.join(serverPath, '/identification_v4.html')
  let htmlContent = await fs.readFile(htmlPath, { encoding: 'utf-8' })
  htmlContent = htmlContent.replace('{{PUBLIC_API_KEY}}', publicApiKey)

  let context: BrowserContext | undefined
  let closed = false
  const ORIGIN = 'https://conductor.test'

  try {
    // Important: clone the device object so we don't pass a shared reference
    context = await browser.newContext({ ...(device as any), baseURL: ORIGIN })
    context.on('close', () => {
      closed = true
    })

    const page = await context.newPage()

    // ✅ Serve the HTML at a real origin to avoid opaque-origin SecurityError
    await context.route('**/identification_v4.html', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: htmlContent,
      })
    )
    await page.goto(`${ORIGIN}/identification_v4.html`, { waitUntil: 'load' })

    // Wait for agent to be ready, then call get()
    await page.waitForFunction(() => !!(window as any).FP, null, { timeout: 15_000 })

    const value = await page.evaluate(async (params) => {
      const agent = (window as any).FP as Agent
      const result = await agent.get(params)

      return {
        ...result,
        sealed_result: result.sealed_result ? result.sealed_result.base64() : undefined,
      } as IdentifyResult
    }, options)

    if (!value) {
      throw new Error('Failed to identify')
    }

    return value
  } finally {
    // Be defensive: the context may have already been torn down
    if (context && !closed) {
      try {
        // Close pages first to reduce races
        const pages = context.pages()
        await Promise.allSettled(pages.map((p) => p.close().catch(() => {})))
        // Small microtask delay to let the browser detach targets
        await new Promise((r) => setTimeout(r, 0))
        await context.close()
      } catch (err) {
        // Swallow the benign race where the context is already gone
        const msg = String(err || '')
        if (!/Failed to find context with id|Target\.disposeBrowserContext/i.test(msg)) {
          // Bubble up only unexpected close errors
          throw err
        }
      }
    }
  }
}

export async function identifyBulk(browser: Browser, options: Readonly<IdentifyOptions>, size: number) {
  return Promise.all(Array.from({ length: size }).map(() => identify(browser, options)))
}
