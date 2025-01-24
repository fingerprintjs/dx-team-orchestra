import { testData } from '../utils/testData'
import { test } from '../utils/playwright'
import { delay } from '../utils/delay'

function waitBeforeFetch() {
  // Wait before fetching visitor after deletion
  return delay(30000)
}

test.slow()

test.describe('DeleteVisitorData Suite', () => {
  test('for valid apiKey and visitorId with Smart Signals', async ({ identify, sdkApi, assert }) => {
    const { visitorId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
      skipCleanup: true,
    })

    await sdkApi.deleteVisitor({
      visitorId,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    await waitBeforeFetch()

    await assert.thatResponseMatch({
      strict: false,
      expectedResponse: {
        visitorId,
        visits: [],
      },
      expectedStatusCode: 200,
      callback: (api) =>
        api.getVisitor({
          visitorId,
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
        }),
    })
  })
})

test.describe('DeleteVisitorData Suite 400 errors', () => {
  test('without sending visitorId - RequestCannotBeParsed', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 400,
      expectedResponse: {
        error: {
          code: 'RequestCannotBeParsed',
          message: 'visitor id is required',
        },
      },
      callback: (api) =>
        api.deleteVisitor({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
        }),
    })
  })
})

test.describe('DeleteVisitorData Suite 403 errors', () => {
  test('APIKey is missing - TokenRequired', async ({ identify, assert }) => {
    const { visitorId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await assert.thatResponseMatch({
      expectedStatusCode: 403,
      expectedResponse: {
        error: {
          code: 'TokenRequired',
          message: 'secret key is required',
        },
      },
      callback: (api) =>
        api.deleteVisitor({
          visitorId,
          region: testData.credentials.maxFeaturesUS.region,
        }),
    })
  })

  // TODO Fix
  test.fixme('FeatureNotEnabled', async ({ assert, identify }) => {
    const { visitorId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await assert.thatResponseMatch({
      expectedStatusCode: 403,
      expectedResponse: {
        error: {
          code: 'FeatureNotEnabled',
          message: 'feature not enabled',
        },
      },
      callback: (api) =>
        api.deleteVisitor({
          visitorId,
          apiKey: testData.credentials.regularEU.privateKey,
          region: testData.credentials.regularEU.region,
        }),
    })
  })
})

test.describe('DeleteVisitorData Suite 404 errors', () => {
  test('VisitorNotFound', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 404,
      expectedResponse: {
        error: {
          code: 'VisitorNotFound',
          message: 'visitor not found',
        },
      },
      callback: (api) =>
        api.deleteVisitor({
          visitorId: testData.invalid.visitorId,
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
        }),
    })
  })
})
