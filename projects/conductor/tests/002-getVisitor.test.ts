import {generateIdentificationData} from "../htmlScripts/runIdentification";
import {testData} from "../utils/testData";
import {test} from "../utils/playwright";
import {expect} from "@playwright/test";

test.describe('GetVisitor Suite', () => {
  test('getVisitor for valid apiKey', async ({assert}) => {
    const [requestId, visitorId] = await Promise.all([
      generateIdentificationData(
        'requestId',
        testData.credentials.maxFeaturesUS.publicKey
      ),
      generateIdentificationData(
        'visitorId',
        testData.credentials.maxFeaturesUS.publicKey
      )
    ])

    const params = {
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      requestId,
      visitorId
    };

    await assert.thatResponsesMatch('getVisitor', params)
  })

  test('getVisitor with invalid visitor ID and api key', async ({sdkApi}) => {
    const {response} = await sdkApi.getVisitor({
      apiKey: testData.credentials.invalid.privateKey,
      visitorId: testData.mocks.invalid.visitorId,
    })

    expect(response.status()).toEqual(403)
  })

  test('getVisitor with invalid visitor ID', async ({sdkApi}) => {
    const {response} = await sdkApi.getVisitor({
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      visitorId: testData.mocks.invalid.visitorId,
      requestId: testData.mocks.invalid.requestID
    })

    expect(response.status()).toEqual(400)
  })
});
