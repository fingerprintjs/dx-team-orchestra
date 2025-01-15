import {generateIdentificationDataPair} from "../htmlScripts/runIdentification";
import {testData} from "../utils/testData";
import {test} from "../utils/playwright";
import {expect} from "@playwright/test";

test.describe('GetVisitor Suite', () => {
  test('with valid apiKey', async ({assert}) => {
    const {visitorId, requestId} = await generateIdentificationDataPair(testData.credentials.maxFeaturesUS.publicKey);

    const params = {
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      requestId,
      visitorId
    };

    await assert.thatResponsesMatch('getVisitor', params)
  })

  test('with invalid visitor ID and api key', async ({sdkApi}) => {
    const {response, data} = await sdkApi.getVisitor({
      apiKey: testData.credentials.invalid.privateKey,
      visitorId: testData.mocks.invalid.visitorId,
    })

    expect(response.status()).toEqual(403)
    expect(data).toEqual({
      error: 'Forbidden (HTTP 403)'
    })
  })

  test('with invalid visitor ID', async ({sdkApi}) => {
    const {response, data} = await sdkApi.getVisitor({
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      visitorId: testData.mocks.invalid.visitorId,
      requestId: testData.mocks.invalid.requestId
    })

    expect(response.status()).toEqual(400)
    expect(data).toEqual({
      error: 'bad request'
    })
  })

  test('with different region', async ({sdkApi}) => {
    const {visitorId, requestId} = await generateIdentificationDataPair(testData.credentials.maxFeaturesUS.publicKey);

    const {response, data} = await sdkApi.getVisitor({
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      visitorId,
      requestId,
      region: 'eu'
    })


    expect(response.status()).toEqual(403)
    expect(data).toEqual({
      error: 'Wrong region (HTTP 403)'
    })
  })

  test('with deleted API key', async ({sdkApi}) => {
    const {visitorId, requestId} = await generateIdentificationDataPair(testData.credentials.deleted.publicKey);

    const {response, data} = await sdkApi.getVisitor({
      apiKey: testData.credentials.deleted.privateKey,
      visitorId,
      requestId,
      region: 'eu'
    })


    expect(response.status()).toEqual(403)
    expect(data).toEqual({
      error: 'Forbidden (HTTP 403)'
    })
  })
});
