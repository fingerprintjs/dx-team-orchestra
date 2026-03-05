import { test } from '../../utils/v4/playwright'
import testData from '../../utils/testData'

test.describe('GetEvent Suite', () => {
  test('for valid apiKey and event_id with Smart Signals', async ({ identify, assert }) => {
    const { event_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })
    const requestData = {
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      eventId: event_id,
    }

    await assert.thatResponsesMatch('getEvent', requestData)
  })

  test('for valid apiKey and event_id without Smart Signals', async ({ identify, assert }) => {
    const { event_id } = await identify({
      auth: testData.credentials.minFeaturesUS,
    })
    const requestData = {
      apiKey: testData.credentials.minFeaturesUS.privateKey,
      region: testData.credentials.minFeaturesUS.region,
      eventId: event_id,
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
          eventId: '',
        }),
    })
  })

  test('for invalid apikey, region, and eventId', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedResponse: {
        error: {
          code: 'secret_api_key_not_found',
          message: 'no fingerprint workspace found for specified secret API key',
        },
      },
      expectedStatusCode: 403,
      callback: (api) =>
        api.getEvent({
          apiKey: testData.credentials.invalid.privateKey,
          region: testData.credentials.invalid.region,
          eventId: testData.invalid.requestID,
        }),
    })
  })

  test('for invalid apikey', async ({ assert, identify }) => {
    const { event_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await assert.thatResponseMatch({
      expectedStatusCode: 403,
      expectedResponse: {
        error: {
          code: 'secret_api_key_not_found',
          message: 'no fingerprint workspace found for specified secret API key',
        },
      },
      callback: (api) =>
        api.getEvent({
          apiKey: testData.credentials.invalid.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          eventId: event_id,
        }),
    })
  })

  test('for invalid region', async ({ assert, identify }) => {
    const { event_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })
    await assert.thatResponseMatch({
      expectedStatusCode: 200,
      callback: (api) =>
        api.getEvent({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.invalid.region,
          eventId: event_id,
        }),
    })
  })

  test('for invalid eventId', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 404,
      expectedResponse: {
        error: {
          code: 'event_not_found',
          message: 'event id not found',
        },
      },
      callback: (api) =>
        api.getEvent({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          eventId: testData.invalid.requestID,
        }),
    })
  })

  test('for different region', async ({ assert, identify }) => {
    const { event_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await assert.thatResponseMatch({
      expectedStatusCode: 403,
      expectedResponse: {
        error: {
          code: 'wrong_region',
          message: 'wrong region',
        },
      },
      callback: (api) =>
        api.getEvent({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.regularEU.region,
          eventId: event_id,
        }),
    })
  })

  test('for deleted APIkey', async ({ assert, identify }) => {
    const { event_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await assert.thatResponseMatch({
      expectedStatusCode: 403,
      expectedResponse: {
        error: {
          code: 'secret_api_key_not_found',
          message: 'no fingerprint workspace found for specified secret API key',
        },
      },
      callback: (api) =>
        api.getEvent({
          apiKey: testData.credentials.deleted.privateKey,
          region: testData.credentials.deleted.region,
          eventId: event_id,
        }),
    })
  })
})
