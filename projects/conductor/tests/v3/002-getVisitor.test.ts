import { testData } from '../../utils/testData'
import { test } from '../../utils/playwright'
import { expect } from '@playwright/test'
import { getRandomDevice } from '../../htmlScripts/runIdentification'
import { withRetry } from '../../utils/retry'

test.describe('GetVisitor Suite', () => {
  test('with valid apiKey', async ({ assert, identify }) => {
    const { visitorId, requestId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    const params = {
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      requestId,
      visitorId,
    }

    // Poll until the visit has propagated and both APIs agree.
    await withRetry(() => assert.thatResponsesMatch('getVisitor', params), { retries: 6, waitMs: 5000 })
  })

  test('with invalid visitor ID and api key', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 403,
      expectedResponse: {
        error: 'Forbidden (HTTP 403)',
      },
      callback: (api) =>
        api.getVisitor({
          apiKey: testData.credentials.invalid.privateKey,
          visitorId: testData.mocks.invalid.visitorId,
        }),
    })
  })

  test('with invalid visitor ID', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 400,
      expectedResponse: {
        error: 'bad request',
      },
      callback: (api) =>
        api.getVisitor({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          visitorId: testData.mocks.invalid.visitorId,
          requestId: testData.mocks.invalid.requestId,
        }),
    })
  })

  test('with different region', async ({ assert, identify }) => {
    const { visitorId, requestId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await assert.thatResponseMatch({
      expectedStatusCode: 403,
      expectedResponse: {
        error: 'Wrong region (HTTP 403)',
      },
      callback: (api) =>
        api.getVisitor({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          visitorId,
          requestId,
          region: 'eu',
        }),
    })
  })

  test('with deleted API key', async ({ assert, identify }) => {
    const { visitorId, requestId } = await identify({
      auth: testData.credentials.deleted,
      skipCleanup: true,
    })

    await assert.thatResponseMatch({
      expectedStatusCode: 403,
      expectedResponse: {
        error: 'Forbidden (HTTP 403)',
      },
      callback: (api) =>
        api.getVisitor({
          apiKey: testData.credentials.deleted.privateKey,
          visitorId,
          requestId,
          region: 'eu',
        }),
    })
  })

  test('with pagination', async ({ sdkApi, identifyBulk }) => {
    const visitors = await identifyBulk(
      {
        auth: testData.credentials.maxFeaturesUS,
        device: getRandomDevice(),
      },
      2
    )

    const params = {
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      visitorId: visitors[0].visitorId,
      limit: 1,
      region: testData.credentials.maxFeaturesUS.region,
    }

    // Poll the whole pagination flow: both visits must have propagated so that
    // page 1 and page 2 each return one distinct visit.
    await withRetry(
      async () => {
        const { data } = await sdkApi.getVisitor(params)
        expect(data.visits).toHaveLength(1)

        const { data: nextData } = await sdkApi.getVisitor({
          ...params,
          paginationKey: data.paginationKey,
        })

        expect(nextData.visits).toHaveLength(1)
        expect(nextData.visits).not.toEqual(data.visits)
      },
      { retries: 8, waitMs: 5000 }
    )
  })

  test('with linked id', async ({ sdkApi, identify }) => {
    const linkedId = `test_${Date.now()}`
    const { visitorId, requestId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
      linkedId,
    })

    await withRetry(
      async () => {
        const { data } = await sdkApi.getVisitor({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          linkedId,
          visitorId,
          requestId,
        })

        expect(data.visits).toHaveLength(1)
      },
      {
        waitMs: 5000,
      }
    )

    // The requestId filter takes precedence over the other filter parameters
    // now and will return the associated event with the request ID, ignoring
    // the other filter parameters.
    const { data: emptyData } = await sdkApi.getVisitor({
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      linkedId: 'different',
      visitorId,
    })

    expect(emptyData.visits).toHaveLength(0)
  })
})
