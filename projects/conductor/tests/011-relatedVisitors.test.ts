import {expect, test} from "@playwright/test";
import testData from "../utils/testData";
import generateIdentificationData from "../htmlScripts/runIdentification";
import {getRelatedVisitors} from "../utils/api";
import {getFingerprintEndpoint} from "../utils/fingerprint";

test.describe('Related Visitors Suite', () => {
  test('get related visitors with valid apiKey and visitor id', async ({request}) => {
    const visitorId = await generateIdentificationData(
      "visitorId",
     testData.identificationKey.maximumFeaturesUS,
    );

    const musicianResponse = await getRelatedVisitors(request, {
      visitorId,
      apiKey: testData.validSmartSignal.apiKey,
    })

    expect(musicianResponse.parsedResponse).toStrictEqual({
      relatedVisitors: []
    })
  })
})