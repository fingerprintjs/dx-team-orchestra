import {expect} from "@playwright/test";
import testData from "../utils/testData";
import {test} from "../utils/playwright";
import {identify} from "../htmlScripts/runIdentification";

test.describe('Related Visitors Suite', () => {
  test('with valid apiKey and visitor id', async ({sdkApi}) => {
    const {visitorId} = await identify({
      publicApiKey: testData.credentials.maxFeaturesUS.publicKey,
    })

    const {data} = await sdkApi.getRelatedVisitors({
      visitorId,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
    })

    expect(data).toStrictEqual({
      relatedVisitors: []
    })
  })
})