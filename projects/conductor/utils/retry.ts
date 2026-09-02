import { delay } from './delay'

type RetryOpts = {
  retries?: number
  waitMs?: number
}

export async function withRetry<T>(
  callback: () => Promise<T>,
  // Defaults sized for event propagation against the live API: poll for up to
  // ~40s (8 × 5s), exiting as soon as the callback succeeds.
  { retries = 8, waitMs = 5000 }: RetryOpts = {}
): Promise<T> {
  let attempt = 0
  while (attempt < retries) {
    try {
      return await callback()
    } catch (error) {
      attempt++
      if (attempt >= retries) {
        throw error
      }

      await delay(waitMs)
    }
  }
}
