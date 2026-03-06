import { testData } from '../../utils/testData'
import { test } from '../../utils/v4/playwright'
import { delay } from '../../utils/delay'
import { expect } from '@playwright/test'

function waitBeforeFetch() {
  // Wait before fetching visitor after deletion
  return delay(30000)
}

test.slow()

test.describe('DeleteVisitorData Suite', () => {
  test('for valid apiKey and visitor_id with Smart Signals', async ({ identify, sdkApi, assert }) => {
    const { visitor_id, event_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
      skipCleanup: true,
    })

    await sdkApi.deleteVisitor({
      visitor_id,
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    await waitBeforeFetch()

    await assert.thatResponseMatch({
      strict: false,
      expectedResponse: {
        events: [],
      },
      expectedStatusCode: 200,
      callback: (api) =>
        api.searchEvents({
          visitor_id,
          api_key: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
        }),
    })
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
            api_key: testData.credentials.maxFeaturesUS.privateKey,
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
            api_key: testData.credentials.maxFeaturesUS.privateKey,
            region: testData.credentials.maxFeaturesUS.region,
          }),
      })
    })
  })
})
