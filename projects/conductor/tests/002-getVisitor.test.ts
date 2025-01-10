import {generateIdentificationData} from "../htmlScripts/runIdentification";
import {testData} from "../utils/testData";
import {test} from "../utils/playwright";
import {expect} from "@playwright/test";

test.describe('GetVisitor Suite', () => {
  test('getVisitor for valid apiKey', async ({assert}) => {
    const [requestId, visitorId] = await Promise.all([
      generateIdentificationData(
        'requestId',
        testData.identificationKey.maximumFeaturesUS
      ),
      generateIdentificationData(
        'visitorId',
        testData.identificationKey.maximumFeaturesUS
      )
    ])

    const params = {
      apiKey: testData.validSmartSignal.apiKey,
      region: testData.validSmartSignal.region,
      requestId,
      visitorId
    };

    await assert.thatResponsesMatch('getVisitor', params)
  })

  test('getVisitor with invalid visitor ID and api key', async ({sdkApi}) => {
    const {response} = await sdkApi.getVisitor({
      apiKey: testData.invalid.apiKey,
      visitorId: testData.invalid.visitorId
    })

    expect(response.status()).toEqual(403)
  })

  test('getVisitor with invalid visitor ID', async ({sdkApi}) => {
    const {response} = await sdkApi.getVisitor({
      apiKey: testData.validSmartSignal.apiKey,
      visitorId: testData.invalid.visitorId,
      requestId: testData.invalid.requestID
    })

    expect(response.status()).toEqual(400)
  })
});
