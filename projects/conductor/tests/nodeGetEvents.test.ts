import { expect, test } from "@playwright/test";
import testData from "../utils/testData";
import { generateRequestId } from "../htmlScripts/runNodeIdentification";
import { getApiRequest } from "../utils/api";

test.describe("Node getEvents Suite", () => {
  test("getEvents for valid apiKey and requestId", async ({ request }) => {
    const requestId = await generateRequestId("requestId");
    const responseBody = await getApiRequest(
      request,
      `${testData.config.baseURL}/getEvents`,
      {
        apiKey: testData.valid.apiKey,
        region: testData.valid.region,
        requestId: requestId,
      }
    );
    expect(responseBody).toEqual(
      expect.objectContaining({
        code: 200,
      })
    );
  });

  test("getEvents for missing parameters", async ({ request }) => {
    const responseBody = await getApiRequest(
      request,
      `${testData.config.baseURL}/getEvents`,
      {
        apiKey: testData.missing.apiKey,
        region: testData.missing.region,
        requestId: testData.missing.requestID,
      }
    );

    expect(responseBody).toEqual(
      expect.objectContaining({
        code: 500,
      })
    );
  });

  test("getEvents for invalid apikey, region and requestID parameters", async ({
    request,
  }) => {
    const responseBody = await getApiRequest(
      request,
      `${testData.config.baseURL}/getEvents`,
      {
        apiKey: testData.invalid.apiKey,
        region: testData.invalid.region,
        requestId: testData.invalid.requestID,
      }
    );

    expect(responseBody).toEqual(
      expect.objectContaining({
        code: 404,
      })
    );
  });

  test("getEvents for invalid apikey", async ({ request }) => {
    const requestId = await generateRequestId("requestId");
    const responseBody = await getApiRequest(
      request,
      `${testData.config.baseURL}/getEvents`,
      {
        apiKey: testData.invalid.apiKey,
        region: testData.valid.region,
        requestId: requestId,
      }
    );

    expect(responseBody).toEqual(
      expect.objectContaining({
        code: 403,
      })
    );
  });
  test("getEvents for invalid region", async ({ request }) => {
    const requestId = await generateRequestId("requestId");
    const responseBody = await getApiRequest(
      request,
      `${testData.config.baseURL}/getEvents`,
      {
        apiKey: testData.valid.apiKey,
        region: testData.invalid.region,
        requestId: requestId,
      }
    );

    expect(responseBody).toEqual(
      expect.objectContaining({
        code: 200,
      })
    );
  });
  test("getEvents for invalid requestId", async ({ request }) => {
    const responseBody = await getApiRequest(
      request,
      `${testData.config.baseURL}/getEvents`,
      {
        apiKey: testData.valid.apiKey,
        region: testData.valid.region,
        requestId: testData.invalid.requestID,
      }
    );

    expect(responseBody).toEqual(
      expect.objectContaining({
        code: 404,
      })
    );
  });
});
