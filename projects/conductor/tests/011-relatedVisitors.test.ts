import {expect} from "@playwright/test";
import testData from "../utils/testData";
import {test} from "../utils/playwright";
import {identify} from "../htmlScripts/runIdentification";

test.describe('Related Visitors Suite', () => {
  test('with valid apiKey and visitor id', async ({sdkApi, assert}) => {
    const {visitorId} = await identify({
      publicApiKey: testData.credentials.maxFeaturesUS.publicKey,
    })

    await assert.thatResponsesMatch('getRelatedVisitors', {
      visitorId,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
    })

    const {data} = await sdkApi.getRelatedVisitors({
      visitorId,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
    })

    expect(data).toStrictEqual({
      relatedVisitors: []
    })
  })

  test('with invalid region', async ({sdkApi}) => {
    const {visitorId} = await identify({
      publicApiKey: testData.credentials.maxFeaturesUS.publicKey,
    })

    const {data, response} = await sdkApi.getRelatedVisitors({
      visitorId,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: 'eu',
    })

    expect(response.status()).toEqual(403)

    expect(data).toStrictEqual({
      error: {
        code: 'WrongRegion',
        message: 'wrong region'
      }
    })
  })

  test('with invalid visitor id', async ({sdkApi}) => {
    const {data, response} = await sdkApi.getRelatedVisitors({
      visitorId: testData.mocks.invalid.visitorId,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
    })

    expect(response.status()).toEqual(404)

    expect(data).toStrictEqual({
      error: {
        code: 'VisitorNotFound',
        message: 'visitor not found'
      }
    })
  })

  test('with api key that does not have the feature enabled', async ({sdkApi}) => {
    const {visitorId} = await identify({
      publicApiKey: testData.credentials.minFeaturesUS.publicKey,
    })


    const {data, response} = await sdkApi.getRelatedVisitors({
      visitorId,
      apiKey: testData.credentials.minFeaturesUS.privateKey,
    })

    expect(response.status()).toEqual(403)
    expect(data).toStrictEqual({
      error: {
        code: 'FeatureNotEnabled',
        message: 'feature not enabled'
      }
    })
  })

  test('with invalid api key', async ({sdkApi}) => {
    const {visitorId} = await identify({
      publicApiKey: testData.credentials.maxFeaturesUS.publicKey,
    })

    const {data, response} = await sdkApi.getRelatedVisitors({
      visitorId,
      apiKey: testData.credentials.invalid.privateKey,
    })

    expect(response.status()).toEqual(403)
    expect(data).toStrictEqual({
      error: {
        code: 'TokenNotFound',
        message: 'secret key is not found'
      }
    })
  })
})