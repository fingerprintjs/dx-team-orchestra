import { Credential } from './testData'
import { delay } from './delay'
import { isRequestError } from './http'
import { FingerprintApi } from './api'

export type VisitorData = {
  visitorId: string
  auth: Credential
}

export async function cleanupVisitors(api: FingerprintApi, visitors: VisitorData[]) {
  await Promise.all(visitors.map((visitor) => cleanupVisitor(api, visitor)))
}

async function cleanupVisitor(api: FingerprintApi, visitor: VisitorData): Promise<void> {
  try {
    await api.deleteVisitor({
      visitorId: visitor.visitorId,
      region: visitor.auth.region,
      apiKey: visitor.auth.unscopedKey,
    })
  } catch (error) {
    if (!isRequestError(error)) {
      throw error
    }

    // A missing visitor is the only non-fatal cleanup outcome (e.g. a duplicate
    // cleanup already deleted it), but still surface it. Anything else must throw.
    if (error.status === 404) {
      console.warn(`Visitor ${visitor.visitorId} not found during cleanup (already deleted?), skipping.`)
      return
    }

    if (error.status === 429) {
      console.warn(`Too many requests while deleting visitor ${visitor.visitorId}, retrying.`)
      await delay(1000)
      return cleanupVisitor(api, visitor)
    }

    throw error
  }
}
