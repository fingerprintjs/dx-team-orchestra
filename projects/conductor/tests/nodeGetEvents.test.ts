import { expect, test } from "@playwright/test";
import testData from "../testData";
import { generateRequestId } from "../htmlScripts/generateRequestId";

test.describe("Node", () => {
  test("getEvents for valid apiKey and requestId", async ({ request }) => {
    const requestId = await generateRequestId();
    const nodeGetEvents = await request.get(
      `${testData.config.baseURL}/getEvents`,
      {
        params: {
          apiKey: testData.valid.apiKey,
          region: testData.valid.region,
          requestId: requestId,
        },
      }
    );
    expect(nodeGetEvents.status()).toEqual(200);
  });
});
