import { Credential } from '../testData'
import { delay } from '../delay'
import { isRequestError } from '../http'
import { FingerprintV4Api } from './api'

const fingerprintApis = {
  us: 'https://api.fpjs.io/v4',
  eu: 'https://eu.api.fpjs.io/v4',
  ap: 'https://ap.api.fpjs.io/v4',
}

type Region = keyof typeof fingerprintApis

export function assertValidRegion(region: string): asserts region is Region {
  if (!(region in fingerprintApis)) {
    throw new Error('Invalid region')
  }
}

export type VisitorData = {
  visitorId: string
  auth: Credential
}

export async function cleanupVisitors(api: FingerprintV4Api, visitors: VisitorData[]) {
  await Promise.all(visitors.map((visitor) => cleanupVisitor(api, visitor)))
}

async function cleanupVisitor(api: FingerprintV4Api, visitor: VisitorData): Promise<void> {
  const region = visitor.auth.region ?? 'us'
  assertValidRegion(region)

  try {
    await api.deleteVisitor({
      visitor_id: visitor.visitorId,
      region: visitor.auth.region,
      api_key: visitor.auth.deletionKey,
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
