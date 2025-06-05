import { testData } from '../utils/testData'
import { test } from '../utils/playwright'

test.describe('GetEvents Suite', () => {
  test('for valid apiKey and requestId with Smart Signals', async ({ identify, assert }) => {
    const { requestId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })
    const requestData = {
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      requestId,
    }

    await assert.thatResponsesMatch('getEvent', requestData)
  })

  test('for valid apiKey and requestId without Smart Signals', async ({ identify, assert }) => {
    const { requestId } = await identify({
      auth: testData.credentials.minFeaturesUS,
    })
    const requestData = {
      apiKey: testData.credentials.minFeaturesUS.privateKey,
      region: testData.credentials.minFeaturesUS.region,
      requestId,
    }

    await assert.thatResponsesMatch('getEvent', requestData)
  })

  test('for missing parameters', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 403,
      callback: (api) =>
        api.getEvent({
          apiKey: '',
          region: '',
          requestId: '',
        }),
    })
  })

  test('for invalid apikey, region, and requestID', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedResponse: {
        error: {
          code: 'TokenNotFound',
          message: 'secret key is not found',
        },
      },
      expectedStatusCode: 403,
      callback: (api) =>
        api.getEvent({
          apiKey: testData.credentials.invalid.privateKey,
          region: testData.credentials.invalid.region,
          requestId: testData.invalid.requestID,
        }),
    })
  })

  test('for invalid apikey', async ({ assert, identify }) => {
    const { requestId } = await identify({
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
        api.getEvent({
          apiKey: testData.credentials.invalid.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          requestId,
        }),
    })
  })

  test('for invalid region', async ({ assert, identify }) => {
    const { requestId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })
    await assert.thatResponseMatch({
      expectedStatusCode: 200,
      callback: (api) =>
        api.getEvent({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.invalid.region,
          requestId,
        }),
    })
  })

  test('for invalid requestId', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 404,
      expectedResponse: {
        error: {
          code: 'RequestNotFound',
          message: 'request id not found',
        },
      },
      callback: (api) =>
        api.getEvent({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          requestId: testData.invalid.requestID,
        }),
    })
  })

  test('for different region', async ({ assert, identify }) => {
    const { requestId } = await identify({
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
        api.getEvent({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.regularEU.region,
          requestId,
        }),
    })
  })

  test('for deleted APIkey', async ({ assert, identify }) => {
    const { requestId } = await identify({
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
        api.getEvent({
          apiKey: testData.credentials.deleted.privateKey,
          region: testData.credentials.deleted.region,
          requestId,
        }),
    })
  })
})
