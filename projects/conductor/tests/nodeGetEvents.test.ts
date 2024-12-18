import { test, expect } from "@playwright/test";
import { generateRequestId } from "../htmlScripts/runNodeIdentification";
import { validateGetEventsResponse } from "../utils/api";
import testData from "../utils/testData";
import { getEventByRequestId } from "../utils/api";

test.describe("Node getEvents Suite", () => {
  test("getEvents for valid apiKey and requestId", async ({ request }) => {
    const requestId = await generateRequestId("requestId");
    const requestData = {
      apiKey: testData.valid.apiKey,
      region: testData.valid.region,
      requestId: requestId,
    };

    const muisicanAppResponseBody = await validateGetEventsResponse(
      request,
      requestData,
      200
    );
    const eventByRequestId = await getEventByRequestId(request, requestId);
    expect(muisicanAppResponseBody.parsedResponse).toMatchObject(
      eventByRequestId
    );
  });

  test("getEvents for missing parameters", async ({ request }) => {
    const requestData = {
      apiKey: testData.missing.apiKey,
      region: testData.missing.region,
      requestId: testData.missing.requestID,
    };

    await validateGetEventsResponse(request, requestData, 500);
  });

  test("getEvents for invalid apikey, region, and requestID", async ({
    request,
  }) => {
    const requestData = {
      apiKey: testData.invalid.apiKey,
      region: testData.invalid.region,
      requestId: testData.invalid.requestID,
    };

    await validateGetEventsResponse(request, requestData, 404);
  });

  test("getEvents for invalid apikey", async ({ request }) => {
    const requestId = await generateRequestId("requestId");
    const requestData = {
      apiKey: testData.invalid.apiKey,
      region: testData.valid.region,
      requestId: requestId,
    };

    await validateGetEventsResponse(request, requestData, 403);
  });

  test("getEvents for invalid region", async ({ request }) => {
    const requestId = await generateRequestId("requestId");
    const requestData = {
      apiKey: testData.valid.apiKey,
      region: testData.invalid.region,
      requestId: requestId,
    };

    await validateGetEventsResponse(request, requestData, 200);
  });

  test("getEvents for invalid requestId", async ({ request }) => {
    const requestData = {
      apiKey: testData.valid.apiKey,
      region: testData.valid.region,
      requestId: testData.invalid.requestID,
    };

    await validateGetEventsResponse(request, requestData, 404);
  });

  test("getEvents for different region", async ({ request }) => {
    const requestId = await generateRequestId("requestId");
    const requestData = {
      apiKey: testData.differentRegion.apiKey,
      region: testData.differentRegion.region,
      requestId: requestId,
    };

    await validateGetEventsResponse(request, requestData, 403);
  });

  test("getEvents for deleted APIkey", async ({ request }) => {
    const requestId = await generateRequestId("requestId");
    const requestData = {
      apiKey: testData.deletedApiKey.apiKey,
      region: testData.deletedApiKey.region,
      requestId: requestId,
    };

    await validateGetEventsResponse(request, requestData, 403);
  });
});
