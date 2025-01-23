import { expect } from '@playwright/test'
import testData from '../utils/testData'
import { test } from '../utils/playwright'

test.describe('Related Visitors Suite', () => {
  test('with valid apiKey and visitor id', async ({ assert, sdkApi, identify }) => {
    const { visitorId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await assert.thatResponsesMatch('getRelatedVisitors', {
      visitorId,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
    })

    const { data } = await sdkApi.getRelatedVisitors({
      visitorId,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
    })

    expect(data).toStrictEqual({
      relatedVisitors: [],
    })
  })

  test('with invalid region', async ({ assert, identify }) => {
    const { visitorId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await assert.thatResponseMatch({
      expectedStatusCode: 403,
      expectedResponse: {
        error: {
          code: 'WrongRegion',
          message: 'wrong region',
        },
      },
      callback: (api) =>
        api.getRelatedVisitors({
          visitorId,
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: 'eu',
        }),
    })
  })

  test('with invalid visitor id', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 404,
      expectedResponse: {
        error: {
          code: 'VisitorNotFound',
          message: 'visitor not found',
        },
      },
      callback: (api) =>
        api.getRelatedVisitors({
          visitorId: testData.mocks.invalid.visitorId,
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
        }),
    })
  })

  test('with api key that does not have the feature enabled', async ({ assert, identify }) => {
    const { visitorId } = await identify({
      auth: testData.credentials.minFeaturesUS,
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
        api.getRelatedVisitors({
          visitorId,
          apiKey: testData.credentials.minFeaturesUS.privateKey,
        }),
    })
  })

  test('with invalid api key', async ({ assert, identify }) => {
    const { visitorId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await assert.thatResponseMatch({
      expectedStatusCode: 403,
      expectedResponse: {
        error: {
          code: 'TokenNotFound',
          message: 'secret key is not found',
        },
      },
      callback: (api) =>
        api.getRelatedVisitors({
          visitorId,
          apiKey: testData.credentials.invalid.privateKey,
        }),
    })
  })
})
