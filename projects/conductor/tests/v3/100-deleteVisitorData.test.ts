import { testData } from '../../utils/testData'
import { test } from '../../utils/playwright'
import { withRetry } from '../../utils/retry'

test.slow()

test.describe('DeleteVisitorData Suite', () => {
  test('for valid apiKey and visitorId with Smart Signals', async ({ identify, sdkApi, assert }) => {
    const { visitorId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
      skipCleanup: true,
    })

    // Trigger the deletion. It completes asynchronously and, unlike before,
    // events for the deleted visitor keep being returned for some time — so we
    // can no longer confirm deletion by querying events. Instead, re-issue the
    // delete and poll until it reports the visitor is already gone (404).
    await sdkApi.deleteVisitor({
      visitorId,
      apiKey: testData.credentials.maxFeaturesUS.unscopedKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    await withRetry(() =>
      assert.thatResponseMatch({
        expectedStatusCode: 404,
        expectedResponse: {
          error: {
            code: 'VisitorNotFound',
            message: 'visitor not found',
          },
        },
        callback: (api) =>
          api.deleteVisitor({
            visitorId,
            apiKey: testData.credentials.maxFeaturesUS.unscopedKey,
            region: testData.credentials.maxFeaturesUS.region,
          }),
      })
    )
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
          apiKey: testData.credentials.maxFeaturesUS.unscopedKey,
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
          apiKey: testData.credentials.maxFeaturesUS.unscopedKey,
          region: testData.credentials.maxFeaturesUS.region,
        }),
    })
  })
})
