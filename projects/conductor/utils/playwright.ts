import {test as pwTest} from '@playwright/test'
import {FingerprintApi, RealFingerprintApi, SdkFingerprintApi} from "./api";
import {Assertions} from "./assertions";
import {identify, IdentifyOptions} from "../htmlScripts/runIdentification";
import {ExtendedGetResult} from "@fingerprintjs/fingerprintjs-pro";
import {cleanupVisitors, VisitorData} from "./fingerprint";
import {Credential} from "./testData";
import {DecryptionAlgorithm, unsealEventsResponse} from "@fingerprintjs/fingerprintjs-pro-server-api";

type Fixture = {
  fingerprintApi: FingerprintApi
  sdkApi: SdkFingerprintApi
  assert: Assertions
  identify: (options: Readonly<TestIdentifyOptions>) => Promise<ExtendedGetResult>
  identifyBulk: (options: Readonly<TestIdentifyOptions>, size: number) => Promise<ExtendedGetResult[]>
}

export type TestIdentifyOptions = Omit<IdentifyOptions, 'publicApiKey'> & {
  auth: Credential
  skipCleanup?: boolean
}

export const test = pwTest.extend<Fixture>({
  identifyBulk: async ({identify}, use) => {
    const identifyBulk = (options: Readonly<TestIdentifyOptions>, size: number) => {
      return Promise.all(
        Array.from({length: size}).map(() => identify(options))
      )
    }

    await use(identifyBulk)
  },
  identify: async ({browser, request}, use) => {
    const visitors: VisitorData[] = []

    const wrappedIdentify = async (options: Readonly<TestIdentifyOptions>) => {
      const result = await identify(browser, {
        ...options,
        publicApiKey: options.auth.publicKey,
      })

      if (!options?.skipCleanup) {
        let visitorId: string
        if (result.sealedResult) {
          if (!options.auth.encryptionKey) {
            throw new TypeError('No encryption key provided for unsealing result')
          }

          const unsealedData = await unsealEventsResponse(
            Buffer.from(result.sealedResult, 'base64'),
            [
              {
                key: Buffer.from(options.auth.encryptionKey, 'base64'),
                algorithm: DecryptionAlgorithm.Aes256Gcm
              }
            ]
          )

          visitorId = unsealedData.products.identification.data.visitorId
        } else {
          visitorId = result.visitorId
        }

        visitors.push({
          visitorId,
          auth: options.auth,
        })
      }

      return result
    }

    await use(wrappedIdentify)

    await cleanupVisitors(request, visitors)
  },
  fingerprintApi: async ({request}, use) => {
    await use(
      new RealFingerprintApi(request)
    )
  },
  sdkApi: async ({request}, use) => {
    await use(
      new SdkFingerprintApi(request)
    )
  },
  assert: async ({fingerprintApi, sdkApi}, use) => {
    await use(new Assertions(fingerprintApi, sdkApi))
  }
})
