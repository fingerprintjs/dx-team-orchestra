import {test as pwTest} from '@playwright/test'
import {FingerprintApi, RealFingerprintApi, SdkFingerprintApi} from "./api";
import {Assertions} from "./assertions";

type Fixture = {
  fingerprintApi: FingerprintApi
  sdkApi: SdkFingerprintApi
  assert: Assertions
}

export const test = pwTest.extend<Fixture>({
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
