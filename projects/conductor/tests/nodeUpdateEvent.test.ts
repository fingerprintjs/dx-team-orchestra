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
      testData.validSmartSignal.apiKey,
      testData.updateEvent.linkedId,
      testData.updateEvent.suspect,
      testData.updateEvent.tag
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

  test("updateEvents for valid compelx tag", async ({ request }) => {
    const requestId = await generateRequestId(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    await updateEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey,
      undefined,
      undefined,
      testData.updateEventComplexTag.tag
    );

    const eventByRequestId = await getEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey
    );
    const responsebody = await eventByRequestId.products.identification.data;
    expect(responsebody.tag).toStrictEqual(testData.updateEventComplexTag.tag);
  });

  test("updateEvents for linkedId only", async ({ request }) => {
    const requestId = await generateRequestId(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    await updateEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey,
      testData.updateEvent.linkedId
    );

    const eventByRequestId = await getEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey
    );
    const responsebody = await eventByRequestId.products.identification.data;
    expect(responsebody.linkedId).toStrictEqual(testData.updateEvent.linkedId);
  });

  test("updateEvents for suspect only", async ({ request }) => {
    const requestId = await generateRequestId(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    await updateEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey,
      undefined,
      testData.updateEvent.suspect
    );

    const eventByRequestId = await getEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey
    );
    const responsebody = await eventByRequestId.products.identification.data;
    expect(responsebody.suspect).toStrictEqual(testData.updateEvent.suspect);
  });
});
