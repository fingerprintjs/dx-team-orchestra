import { delay } from './delay'

type RetryOpts = {
  retries?: number
  waitMs?: number
}

export async function withRetry<T>(
  callback: () => Promise<T>,
  { retries = 3, waitMs = 1000 }: RetryOpts = {}
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
