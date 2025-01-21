import {expect} from "@playwright/test";
import {validateGetEventsResponse} from "../utils/musician";
import {testData} from "../utils/testData";
import {test} from "../utils/playwright";

test.describe("GetEvents Suite", () => {
  test("for valid apiKey and requestId with Smart Signals", async ({identify, assert}) => {
    const {requestId} = await identify(
      {
        auth: testData.credentials.maxFeaturesUS
      }
    );
    const requestData = {
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      requestId,
    };

    await assert.thatResponsesMatch('getEvent', requestData)
  });

  test("for valid apiKey and requestId without Smart Signals", async ({identify, assert}) => {
    const {requestId} = await identify(
      {
        auth: testData.credentials.minFeaturesUS,
      }
    );
    const requestData = {
      apiKey: testData.credentials.minFeaturesUS.privateKey,
      region: testData.credentials.minFeaturesUS.region,
      requestId,
    };

    await assert.thatResponsesMatch('getEvent', requestData)
  });

  test("getEvents for missing parameters", async ({request}) => {
    const requestData = {
      apiKey: testData.missing.apiKey,
      region: testData.missing.region,
      requestId: testData.missing.requestID,
    };

    await validateGetEventsResponse(request, requestData, 404);
  });

  test("for invalid apikey, region, and requestID", async ({sdkApi}) => {
    const requestData = {
      apiKey: testData.credentials.invalid.privateKey,
      region: testData.credentials.invalid.region,
      requestId: testData.invalid.requestID,
    };

    const {data, response} = await sdkApi.getEvent(requestData)

    expect(response.status()).toEqual(404)
    expect(data).toStrictEqual({
      error: {
        code: 'RequestNotFound',
        message: 'request id not found'
      }
    })
  });

  test("for invalid apikey", async ({sdkApi, identify}) => {
    const {requestId} = await identify(
      {
        auth: testData.credentials.maxFeaturesUS
      }
    );
    const requestData = {
      apiKey: testData.credentials.invalid.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      requestId: requestId,
    };

    const {data, response} = await sdkApi.getEvent(requestData)

    expect(response.status()).toEqual(403)
    expect(data).toStrictEqual({
      error: {
        code: 'TokenNotFound',
        message: 'secret key is not found'
      }
    })
  });

  test("for invalid region", async ({sdkApi, identify}) => {
    const {requestId} = await identify(
      {
        auth: testData.credentials.maxFeaturesUS
      }
    );
    const requestData = {
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.invalid.region,
      requestId,
    };

    const {response} = await sdkApi.getEvent(requestData)

    expect(response.status()).toEqual(200)
  });

  test("for invalid requestId", async ({sdkApi}) => {
    const requestData = {
      apiKey: testData.credentials.maxFeaturesUS.publicKey,
      region: testData.credentials.maxFeaturesUS.region,
      requestId: testData.invalid.requestID,
    };

    const {response, data} = await sdkApi.getEvent(requestData)

    expect(response.status()).toEqual(404)
    expect(data).toStrictEqual({
      error: {
        code: 'RequestNotFound',
        message: 'request id not found'
      }
    })
  });

  test("for different region", async ({sdkApi, identify}) => {
    const {requestId} = await identify(
      {
        auth: testData.credentials.maxFeaturesUS
      }
    );
    const requestData = {
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.regularEU.region,
      requestId,
    };

    const {response, data} = await sdkApi.getEvent(requestData)

    expect(response.status()).toEqual(403)
    expect(data).toStrictEqual({
      error: {
        code: 'WrongRegion',
        message: 'wrong region'
      }
    })
  });

  test("for deleted APIkey", async ({sdkApi, identify}) => {
    const {requestId} = await identify(
      {
        auth: testData.credentials.maxFeaturesUS,
      }
    );
    const requestData = {
      apiKey: testData.credentials.deleted.privateKey,
      region: testData.credentials.deleted.region,
      requestId,
    };

    const {response, data} = await sdkApi.getEvent(requestData)

    expect(response.status()).toEqual(403)
    expect(data).toStrictEqual({
      error: {
        code: 'TokenNotFound',
        message: 'secret key is not found'
      }
    })
  });
});
