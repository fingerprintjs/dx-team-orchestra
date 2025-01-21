import {testData} from "../utils/testData";
import {test} from "../utils/playwright";
import {expect} from "@playwright/test";
import {getRandomDevice} from "../htmlScripts/runIdentification";

test.describe('GetVisitor Suite', () => {
  test('with valid apiKey', async ({assert, identify}) => {
    const {visitorId, requestId} = await identify({
      auth: testData.credentials.maxFeaturesUS
    });

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

  test('with different region', async ({sdkApi, identify}) => {
    const {visitorId, requestId} = await identify({
      auth: testData.credentials.maxFeaturesUS
    });

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

  test('with deleted API key', async ({sdkApi, identify}) => {
    const {visitorId, requestId} = await identify({
      auth: testData.credentials.deleted,
      skipCleanup: true,
    });

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

  test('with pagination', async ({sdkApi, identifyBulk}) => {
    const visitors = await identifyBulk({
      auth: testData.credentials.maxFeaturesUS,
      device: getRandomDevice(),
    }, 10);

    const params = {
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      visitorId: visitors[0].visitorId,
      limit: 5,
      region: testData.credentials.maxFeaturesUS.region,
    };
    const {data} = await sdkApi.getVisitor(params)

    expect(data.visits).toHaveLength(5)

    const {data: nextData} = await sdkApi.getVisitor({
      ...params,
      paginationKey: data.paginationKey
    })

    expect(nextData.visits).toHaveLength(5)
    expect(nextData.visits).not.toEqual(data.visits)
  })

  test('with linked id', async ({sdkApi, identify}) => {
    const linkedId = `test_${Date.now()}`;
    const {visitorId, requestId} = await identify({
      auth: testData.credentials.maxFeaturesUS,
      linkedId,
    });

    const {data} = await sdkApi.getVisitor({
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      linkedId,
      visitorId,
      requestId,
    });

    expect(data.visits).toHaveLength(1);

    const {data: emptyData} = await sdkApi.getVisitor({
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      linkedId: 'different',
      visitorId,
      requestId,
    });

    expect(emptyData.visits).toHaveLength(0);
  })
});
