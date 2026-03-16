import { test } from '../../utils/v4/playwright'
import testData from '../../utils/testData'

test.describe('GetEvent Suite', () => {
  test('for valid apiKey and event_id with Smart Signals', async ({ identify, assert }) => {
    const { event_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })
    const requestData = {
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      event_id: event_id,
    }

    await assert.thatResponsesMatch('getEvent', requestData)
  })

  test('for valid apiKey and event_id without Smart Signals', async ({ identify, assert }) => {
    const { event_id } = await identify({
      auth: testData.credentials.minFeaturesUS,
    })
    const requestData = {
      api_key: testData.credentials.minFeaturesUS.privateKey,
      region: testData.credentials.minFeaturesUS.region,
      event_id: event_id,
    }

    await assert.thatResponsesMatch('getEvent', requestData)
  })

  test('for missing parameters', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 403,
      callback: (api) =>
        api.getEvent({
          api_key: '',
          region: '',
          event_id: '',
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
          api_key: testData.credentials.invalid.privateKey,
          region: testData.credentials.invalid.region,
          event_id: testData.invalid.requestID,
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
          api_key: testData.credentials.invalid.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          event_id: event_id,
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
          api_key: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.invalid.region,
          event_id: event_id,
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
          api_key: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          event_id: testData.invalid.requestID,
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
          api_key: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.regularEU.region,
          event_id: event_id,
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
          api_key: testData.credentials.deleted.privateKey,
          region: testData.credentials.deleted.region,
          event_id: event_id,
        }),
    })
  })
})
