import { expect } from '@playwright/test'
import { testData } from '../../utils/testData'
import { test } from '../../utils/v4/playwright'
import { delay } from '../../utils/delay'
import { Event } from '@fingerprint/node-sdk'

function checkUpdatedEvent(updatedEvent: Event) {
  const propertiesToValidate = ['linked_id', 'tags', 'suspect'] as const

  propertiesToValidate.forEach((property) => {
    expect(updatedEvent[property]).toStrictEqual(testData.v4_updateEvent[property])
  })
}

test.slow()

async function waitBeforeUpdate() {
  // delay added before updating to ensure that the event_id is ready to be used
  await delay(12000)
}

test.describe('UpdateEvents Suite', () => {
  test('for valid apiKey and event_id with Smart Signals', async ({ sdkApi, fingerprintApi, identify }) => {
    const { event_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await waitBeforeUpdate()

    const { response } = await sdkApi.updateEvent({
      event_id: event_id,
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.publicKey,
      linked_id: testData.v4_updateEvent.linked_id,
      suspect: testData.v4_updateEvent.suspect,
      tags: testData.v4_updateEvent.tags,
    })

    expect(response.status()).toEqual(200)

    const { data: updatedEvent } = await fingerprintApi.getEvent({
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      event_id: event_id,
    })

    checkUpdatedEvent(updatedEvent)
  })

  test('for valid apiKey and event_id without Smart Signals', async ({ sdkApi, fingerprintApi, identify }) => {
    const { event_id } = await identify({
      auth: testData.credentials.minFeaturesUS,
    })

    await waitBeforeUpdate()

    const { response } = await sdkApi.updateEvent({
      event_id: event_id,
      api_key: testData.credentials.minFeaturesUS.privateKey,
      region: testData.credentials.minFeaturesUS.region,
      linked_id: testData.v4_updateEvent.linked_id,
      suspect: testData.v4_updateEvent.suspect,
      tags: testData.v4_updateEvent.tags,
    })
    expect(response.status()).toEqual(200)

    const { data: updatedEvent } = await fingerprintApi.getEvent({
      event_id: event_id,
      api_key: testData.credentials.minFeaturesUS.privateKey,
      region: testData.credentials.minFeaturesUS.region,
    })
    checkUpdatedEvent(updatedEvent)
  })

  test('for valid complex tag only', async ({ sdkApi, fingerprintApi, identify }) => {
    const { event_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })
    const { data: initialEvent } = await fingerprintApi.getEvent({
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      event_id: event_id,
    })

    await waitBeforeUpdate()

    const { response } = await sdkApi.updateEvent({
      event_id: event_id,
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      tags: testData.updateEventComplexTag.tag,
    })
    expect(response.status()).toEqual(200)

    const { data: updatedEvent } = await fingerprintApi.getEvent({
      event_id: event_id,
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    expect(updatedEvent.tags).toStrictEqual(testData.updateEventComplexTag.tag)
    expect(updatedEvent.linked_id).toStrictEqual(initialEvent.linked_id)
    expect(updatedEvent.suspect).toStrictEqual(initialEvent.suspect)
  })

  test('for linkedId only', async ({ sdkApi, fingerprintApi, identify }) => {
    const { event_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })
    const { data: initialEvent } = await fingerprintApi.getEvent({
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      event_id: event_id,
    })

    await waitBeforeUpdate()

    const { response } = await sdkApi.updateEvent({
      event_id: event_id,
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      linked_id: testData.v4_updateEvent.linked_id,
    })
    expect(response.status()).toEqual(200)

    const { data: updatedEvent } = await fingerprintApi.getEvent({
      event_id: event_id,
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    expect(updatedEvent.linked_id).toStrictEqual(testData.v4_updateEvent.linked_id)
    expect(updatedEvent.suspect).toStrictEqual(initialEvent.suspect)
    expect(updatedEvent.tags).toStrictEqual(initialEvent.tags)
  })

  for (const suspect of [true, false]) {
    test(`updateEvents for suspect=${suspect} only`, async ({ sdkApi, fingerprintApi, identify }) => {
      const { event_id } = await identify({
        auth: testData.credentials.maxFeaturesUS,
      })
      const { data: initialEvent } = await fingerprintApi.getEvent({
        event_id: event_id,
        api_key: testData.credentials.maxFeaturesUS.privateKey,
        region: testData.credentials.maxFeaturesUS.region,
      })
      const initialResponseBody = initialEvent

      await waitBeforeUpdate()

      const { response } = await sdkApi.updateEvent({
        event_id: event_id,
        api_key: testData.validSmartSignal.apiKey,
        region: testData.validSmartSignal.region,
        suspect,
      })
      expect(response.status()).toEqual(200)

      const { data: updatedEvent } = await fingerprintApi.getEvent({
        event_id: event_id,
        api_key: testData.validSmartSignal.apiKey,
        region: testData.validSmartSignal.region,
      })

      expect(updatedEvent.suspect).toBe(suspect)

      expect(updatedEvent.linked_id).toStrictEqual(initialResponseBody.linked_id)
      expect(updatedEvent.tags).toStrictEqual(initialResponseBody.tags)
    })
  }

  test.describe('403 errors', () => {
    test('Auth-API-Key header is missing - TokenRequired', async ({ identify, assert }) => {
      const { event_id } = await identify({
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
          api.updateEvent({
            event_id: event_id,
            region: testData.credentials.maxFeaturesUS.region,
            linked_id: testData.v4_updateEvent.linked_id,
            suspect: testData.v4_updateEvent.suspect,
            tags: testData.v4_updateEvent.tags,
          }),
      })
    })

    test('invalid Auth-API-Key - TokenNotFound', async ({ assert, identify }) => {
      const { event_id } = await identify({
        auth: testData.credentials.maxFeaturesUS,
      })

      await assert.thatResponseMatch({
        expectedResponse: {
          error: {
            code: 'secret_api_key_not_found',
            message: 'no fingerprint workspace found for specified secret API key',
          },
        },
        expectedStatusCode: 403,
        callback: (api) =>
          api.updateEvent({
            event_id: event_id,
            api_key: testData.credentials.invalid.privateKey,
            region: testData.credentials.invalid.region,
            linked_id: testData.v4_updateEvent.linked_id,
            suspect: testData.v4_updateEvent.suspect,
            tags: testData.v4_updateEvent.tags,
          }),
      })
    })
  })

  test.describe('404 errors', () => {
    test('invalid event_id - RequestNotFound', async ({ assert }) => {
      await assert.thatResponseMatch({
        expectedResponse: {
          error: {
            code: 'event_not_found',
            message: 'event id not found',
          },
        },
        expectedStatusCode: 404,
        callback: (api) =>
          api.updateEvent({
            event_id: testData.invalid.requestID,
            api_key: testData.credentials.maxFeaturesUS.privateKey,
            region: testData.credentials.maxFeaturesUS.region,
            linked_id: testData.v4_updateEvent.linked_id,
            suspect: testData.v4_updateEvent.suspect,
            tags: testData.v4_updateEvent.tags,
          }),
      })
    })
  })

  test.describe('409 errors', () => {
    test('updateEvents Event Not ready - StateNotReady', async ({ identify, assert }) => {
      const { event_id } = await identify({
        auth: testData.credentials.maxFeaturesUS,
      })

      await assert.thatResponseMatch({
        expectedStatusCode: 409,
        expectedResponse: {
          error: {
            code: 'state_not_ready',
            message: 'resource is not mutable yet, try again',
          },
        },
        callback: (api) =>
          api.updateEvent({
            event_id: event_id,
            api_key: testData.credentials.maxFeaturesUS.privateKey,
            region: testData.credentials.maxFeaturesUS.region,
            linked_id: testData.v4_updateEvent.linked_id,
            suspect: testData.v4_updateEvent.suspect,
            tags: testData.v4_updateEvent.tags,
          }),
      })
    })
  })
})
