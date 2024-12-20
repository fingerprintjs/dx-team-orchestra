import { test, expect } from "@playwright/test";
import { generateRequestId } from "../htmlScripts/runNodeIdentification";
import testData from "../utils/testData";
import { getEventByRequestId, updateEventByRequestId } from "../utils/api";

test.describe("Node updateEvents Suite", () => {
  test("updateEvents for valid apiKey and requestId with Smart Signals", async ({
    request,
  }) => {
    const requestId = await generateRequestId(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    await updateEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey
    );

    const eventByRequestId = await getEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey
    );
    const responsebody = await eventByRequestId.products.identification.data;
    const propertiesToValidate = ["linkedId", "tag", "suspect"];
    propertiesToValidate.forEach((property) => {
      expect(responsebody[property]).toStrictEqual(
        testData.updateEvent[property]
      );
    });
  });
});
