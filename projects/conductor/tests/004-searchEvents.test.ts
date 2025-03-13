import { test } from '../utils/playwright'
import testData from '../utils/testData'
import { expect } from '@playwright/test'
import { delay } from '../utils/delay'
import * as assert from 'node:assert';

test.describe('SearchEvents suite', () => {
  test('with valid api key and limit', async ({ assert, identify }) => {
    const linkedId = `test_${Date.now()}`

    const { visitorId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
      linkedId,
    })

    await assert.thatResponsesMatch('searchEvents', {
      visitorId,
      linkedId,
      start: new Date().getTime() - 10_000,
      end: new Date().getTime() + 10_000,
      limit: 10,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })
  })

  test('with invalid limit', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 400,
      expectedResponse: {
        error: {
          code: 'RequestCannotBeParsed',
          message: 'invalid limit',
        },
      },
      callback: (api) =>
        api.searchEvents({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          limit: 0,
        }),
    })
  })

  test('with partial params', async ({ identify, assert }) => {
    const { visitorId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await assert.thatResponseMatch({
      expectedStatusCode: 200,
      callback: (api) =>
        api.searchEvents({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          limit: 10,
          bot: 'good',
          visitorId,
        }),
    })
  })

  test('with all params', async ({ identify, assert, fingerprintApi }) => {
    const { visitorId, requestId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
      linkedId: 'test',
    })

    const { data: event } = await fingerprintApi.getEvent({
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      requestId,
    })

    const start = new Date()
    start.setHours(start.getHours() - 1)

    const end = new Date()
    end.setHours(end.getHours() + 1)

    await assert.thatResponseMatch({
      expectedStatusCode: 200,
      callback: (api) =>
        api.searchEvents({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          limit: 10,
          bot: 'good',
          visitorId,
          linkedId: 'test',
          start: start.getTime(),
          end: end.getTime(),
          ipAddress: `${event.products.identification.data.ip}/24`,
          reverse: false,
          suspect: false,
        }),
    })
  })

  test('with reverse params', async ({ sdkApi }) => {
    const { data: normalData } = await sdkApi.searchEvents({
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      limit: 10,
      reverse: false,
    })
    const { data: reversedData } = await sdkApi.searchEvents({
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      limit: 10,
      reverse: true,
    })

    expect(normalData.events).toHaveLength(10)
    expect(reversedData.events).toHaveLength(10)

    expect(normalData.events[0].products.identification.data.timestamp).toBeGreaterThanOrEqual(
      reversedData.events[0].products.identification.data.timestamp
    )
  })

  test('with paginationKey', async ({ fingerprintApi, assert }) => {
    const {data: originalResult} = await fingerprintApi.searchEvents({
      limit: 1,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    expect(originalResult.events.length).toBe(1)

    const paginatedResult = await assert.thatResponsesMatch('searchEvents', {
      paginationKey: originalResult.paginationKey,
      limit: 1,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    expect(originalResult.events.length).toBe(1)
    expect(paginatedResult.events[0].products.identification.data.requestId)
        .not.toEqual(originalResult.events[0].products.identification.data.requestId);
  })

  test('with paginationKey reversed', async ({ fingerprintApi, assert }) => {
    const {data: originalResult} = await fingerprintApi.searchEvents({
      limit: 1,
      reverse: true,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    expect(originalResult.events.length).toBe(1)

    const paginatedResult = await assert.thatResponsesMatch('searchEvents', {
      paginationKey: originalResult.paginationKey,
      limit: 1,
      reverse: true,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    expect(originalResult.events.length).toBe(1)
    expect(paginatedResult.events[0].products.identification.data.requestId)
        .not.toEqual(originalResult.events[0].products.identification.data.requestId);
  })

  test('with invalid bot', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 400,
      expectedResponse: {
        error: {
          code: 'RequestCannotBeParsed',
          message: 'invalid bot type',
        },
      },
      callback: (api) =>
        api.searchEvents({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          limit: 10,
          bot: 'bot',
        }),
    })
  })

  test('with invalid ip address', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 400,
      expectedResponse: {
        error: {
          code: 'RequestCannotBeParsed',
          message: 'invalid ip address',
        },
      },
      callback: (api) =>
        api.searchEvents({
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          limit: 10,
          ipAddress: '127.0.0.',
        }),
    })
  })

  test('with start and end date', async ({ sdkApi, identifyBulk }) => {
    test.slow()

    await identifyBulk(
      {
        auth: testData.credentials.maxFeaturesUS,
      },
      10
    )

    // Wait for events to propagate
    await delay(30_000)

    const { data: dataWithoutDateFilter } = await sdkApi.searchEvents({
      limit: 10,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    expect(dataWithoutDateFilter.events).toHaveLength(10)

    const [event] = dataWithoutDateFilter.events

    const { data: dataWithFilter } = await sdkApi.searchEvents({
      limit: 10,
      visitorId: event.products.identification.data.visitorId,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      start: event.products.identification.data.timestamp - 10,
      end: event.products.identification.data.timestamp + 10,
    })

    expect(dataWithFilter.events).toHaveLength(1)
  })

  test('with invalid token', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 403,
      expectedResponse: {
        error: {
          code: 'TokenNotFound',
          message: 'secret key is not found',
        },
      },
      callback: (api) =>
        api.searchEvents({
          apiKey: testData.credentials.invalid.privateKey,
          region: testData.credentials.invalid.region,
          limit: 10,
        }),
    })
  })
})
