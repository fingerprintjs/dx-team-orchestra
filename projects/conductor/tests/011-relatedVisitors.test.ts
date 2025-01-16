import {expect} from "@playwright/test";
import testData from "../utils/testData";
import {test} from "../utils/playwright";

test.describe('Related Visitors Suite', () => {
  test('with valid apiKey and visitor id', async ({sdkApi}) => {
    const {data} = await sdkApi.getRelatedVisitors({
      visitorId: 'SzJDU0OIz1AoClm2vtcH',
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
    })

    expect(data).toStrictEqual({
      relatedVisitors: []
    })
  })
})