import { test as pwTest } from '@playwright/test'
import { identify, IdentifyOptions, IdentifyResult } from '../../htmlScripts/runIdentification_v4'
import { cleanupVisitors, VisitorData } from './fingerprint'
import { Credential } from '../testData'
import { DecryptionAlgorithm, unsealEventsResponse } from '@fingerprint/node-sdk'
import { FingerprintV4Api, RealFingerprintV4Api, SdkFingerprintV4Api } from './api'
import { AssertionsV4 } from './assertions'

type Fixture = {
  fingerprintApi: FingerprintV4Api
  sdkApi: SdkFingerprintV4Api
  assert: AssertionsV4
  identify: (options: Readonly<TestIdentifyOptions>) => Promise<IdentifyResult>
  identifyBulk: (options: Readonly<TestIdentifyOptions>, size: number) => Promise<IdentifyResult[]>
}

export type TestIdentifyOptions = Omit<IdentifyOptions, 'publicApiKey'> & {
  auth: Credential
  skipCleanup?: boolean
}

export const test = pwTest.extend<Fixture>({
  identifyBulk: async ({ identify }, use) => {
    const identifyBulk = (options: Readonly<TestIdentifyOptions>, size: number) => {
      return Promise.all(Array.from({ length: size }).map(() => identify(options)))
    }

    await use(identifyBulk)
  },
  identify: async ({ browser, fingerprintApi }, use) => {
    const visitors: VisitorData[] = []

    const wrappedIdentify = async (options: Readonly<TestIdentifyOptions>) => {
      const result = await identify(browser, {
        ...options,
        publicApiKey: options.auth.publicKey,
      })

      if (!options?.skipCleanup) {
        let visitorId: string
        if (result.sealed_result) {
          if (!options.auth.encryptionKey) {
            throw new TypeError('No encryption key provided for unsealing result')
          }

          const unsealedData = await unsealEventsResponse(Buffer.from(result.sealed_result, 'base64'), [
            {
              key: Buffer.from(options.auth.encryptionKey, 'base64'),
              algorithm: DecryptionAlgorithm.Aes256Gcm,
            },
          ])

          visitorId = unsealedData.identification.visitor_id
        } else {
          visitorId = result.visitor_id
        }

        visitors.push({
          visitorId,
          auth: options.auth,
        })
      }

      return result
    }

    await use(wrappedIdentify)

    await cleanupVisitors(fingerprintApi, visitors)
  },
  fingerprintApi: async ({ request }, use) => {
    await use(new RealFingerprintV4Api(request))
  },
  sdkApi: async ({ request }, use) => {
    await use(new SdkFingerprintV4Api(request))
  },
  assert: async ({ fingerprintApi, sdkApi }, use) => {
    await use(new AssertionsV4(fingerprintApi, sdkApi))
  },
})
