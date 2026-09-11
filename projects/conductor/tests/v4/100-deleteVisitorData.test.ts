import { testData } from '../../utils/testData'
import { test } from '../../utils/v4/playwright'
import { withRetry } from '../../utils/retry'

test.slow()

test.describe('DeleteVisitorData Suite', () => {
  test('for valid apiKey and visitor_id with Smart Signals', async ({ identify, sdkApi, assert }) => {
    const { visitor_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
      skipCleanup: true,
    })

    // Trigger the deletion. It completes asynchronously and, unlike before,
    // events for the deleted visitor keep being returned for some time — so we
    // can no longer confirm deletion by querying events. Instead, re-issue the
    // delete and poll until it reports the visitor is already gone (404).
    await sdkApi.deleteVisitor({
      visitor_id,
      api_key: testData.credentials.maxFeaturesUS.unscopedKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    await withRetry(() =>
      assert.thatResponseMatch({
        expectedStatusCode: 404,
        expectedResponse: {
          error: {
            code: 'visitor_not_found',
            message: 'visitor not found',
          },
        },
        callback: (api) =>
          api.deleteVisitor({
            visitor_id,
            api_key: testData.credentials.maxFeaturesUS.unscopedKey,
            region: testData.credentials.maxFeaturesUS.region,
          }),
      }),
      // Each retry re-issues the delete, which counts against the delete rate
      // limit — so we favor fewer, longer-spaced attempts over tight polling.
      { retries: 3, waitMs: 25000 }
    )
  })

  test.describe('DeleteVisitorData Suite 400 errors', () => {
    test('without sending visitor_id - request cannot be parsed', async ({ assert }) => {
      await assert.thatResponseMatch({
        expectedStatusCode: 400,
        expectedResponse: {
          error: {
            code: 'request_cannot_be_parsed',
            message: 'visitor id is required',
          },
        },
        callback: (api) =>
          api.deleteVisitor({
            api_key: testData.credentials.maxFeaturesUS.unscopedKey,
            region: testData.credentials.maxFeaturesUS.region,
          }),
      })
    })

    test('with an invalid visitor ID that should be encoded', async ({ assert }) => {
      await assert.thatResponseMatch({
        expectedStatusCode: 400,
        expectedResponse: {
          error: {
            code: 'request_cannot_be_parsed',
            message: 'invalid visitor id',
          },
        },
        callback: (api) =>
          api.deleteVisitor({
            visitor_id: '../events',
            api_key: testData.credentials.maxFeaturesUS.unscopedKey,
            region: testData.credentials.maxFeaturesUS.region,
          }),
      })
    })
  })

  test.describe('403 errors', () => {
    test('APIKey is missing - token required', async ({ identify, assert }) => {
      const { visitor_id } = await identify({
        auth: testData.credentials.maxFeaturesUS,
      })

      await assert.thatResponseMatch({
        expectedStatusCode: 403,
        expectedResponse: {
          error: {
            code: 'secret_api_key_required',
            message: 'secret API key in header is missing or empty',
          },
        },
        callback: (api) =>
          api.deleteVisitor({
            visitor_id,
            region: testData.credentials.maxFeaturesUS.region,
          }),
      })
    })
  })

  test.describe('404 errors', () => {
    test('Visitor not found', async ({ assert }) => {
      await assert.thatResponseMatch({
        expectedStatusCode: 404,
        expectedResponse: {
          error: {
            code: 'visitor_not_found',
            message: 'visitor not found',
          },
        },
        callback: (api) =>
          api.deleteVisitor({
            visitor_id: testData.invalid.visitorId,
            api_key: testData.credentials.maxFeaturesUS.unscopedKey,
            region: testData.credentials.maxFeaturesUS.region,
          }),
      })
    })
  })
})
