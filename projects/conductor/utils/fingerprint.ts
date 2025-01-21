import {Credential} from "./testData";
import {delay} from "./delay";
import {APIRequestContext} from "@playwright/test";

const fingerprintApis = {
  us: 'https://api.fpjs.io',
  eu: 'https://eu.api.fpjs.io',
  ap: 'https://ap.api.fpjs.io',
}

type Region = keyof typeof fingerprintApis

export function getFingerprintEndpoint(region: Region) {
  return fingerprintApis[region]
}

export function assertValidRegion(region: string): asserts region is Region {
  if (!(region in fingerprintApis)) {
    throw new Error('Invalid region')
  }
}

export type VisitorData = {
  visitorId: string
  auth: Credential
}

export async function cleanupVisitors(request: APIRequestContext, visitors: VisitorData[]) {
  await Promise.all(
    visitors.map(visitor => cleanupVisitor(request, visitor))
  )
}

async function cleanupVisitor(request: APIRequestContext, visitor: VisitorData): Promise<void> {
  const region = visitor.auth.region ?? 'us';
  assertValidRegion(region);

  const url = new URL(
    getFingerprintEndpoint(region)
  );
  url.pathname = `visitors/${visitor.visitorId}`;

  const response = await request.delete(url.toString(), {
    headers: {
      'Auth-API-Key': visitor.auth.privateKey,
      'Accept': 'application/json'
    }
  });

  if (response.ok()) {
    return
  }

  if (response.status() === 429) {
    let retryAfter = parseInt(response.headers()?.['Retry-After'])
    if (Number.isNaN(retryAfter)) {
      retryAfter = 1
    }

    console.warn(`Too many requests while trying to delete visitor ${visitor.visitorId}. Retrying after ${retryAfter}s`)

    await delay(retryAfter * 1000)

    return cleanupVisitor(request, visitor)
  }

  console.error(`Failed to delete visitor ${visitor.visitorId} with status ${response.status()}.`, {
    body: await response.json()
  })

  throw new Error(`Failed to delete visitor ${visitor.visitorId} with status ${response.status()}.`)
}