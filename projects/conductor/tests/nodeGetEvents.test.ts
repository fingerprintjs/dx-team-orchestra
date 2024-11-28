import { expect, test } from "@playwright/test";
import testData from "../testData";

test.describe("Node", () => {
  test("getEvents for valid apiKey and requestId", async ({ request }) => {
    const nodeGetEvents = await request.get(
      `${testData.config.baseURL}/getEvents`,
      {
        params: {
          apiKey: testData.valid.apiKey,
          region: testData.valid.region,
          requestId: testData.valid.requestId,
        },
      }
    );
    expect(nodeGetEvents.status()).toEqual(200);
  });
});
