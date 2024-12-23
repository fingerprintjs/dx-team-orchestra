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
    const initialEvent = await getEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey
    );

    await updateEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey,
      testData.updateEvent.linkedId,
      testData.updateEvent.suspect,
      testData.updateEvent.tag
    );

    const updatedEvent = await getEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey
    );

    // validate fields are updated
    const updatedResponseBody = updatedEvent.products.identification.data;
    const propertiesToValidate = ["linkedId", "tag", "suspect"];
    propertiesToValidate.forEach((property) => {
      expect(updatedResponseBody[property]).toStrictEqual(
        testData.updateEvent[property]
      );
    });

    // Validate other fields were not changed
    function removeRepeatedFields(response) {
      Object.keys(response).forEach((key) => {
        if (typeof response[key] === "object" && response[key] !== null) {
          removeRepeatedFields(response[key]);
        }

        // Remove `linkedId`, `tag`, and `suspect` outside `.products.identification.data`
        if (
          ["linkedId", "tag", "suspect"].includes(key) &&
          !response.products?.identification?.data
        ) {
          delete response[key];
        }
        if (key === "meta" && response[key]?.automationTest) {
          delete response[key];
        }
      });
    }

    removeRepeatedFields(initialEvent);
    removeRepeatedFields(updatedEvent);

    expect(initialEvent).toStrictEqual(updatedEvent);
  });

  test("updateEvents for valid apiKey and requestId without Smart Signals", async ({
    request,
  }) => {
    const requestId = await generateRequestId(
      "requestId",
      testData.generatidentification.publicApiKey
    );
    await updateEventByRequestId(
      request,
      requestId,
      testData.valid.apiKey,
      testData.updateEvent.linkedId,
      testData.updateEvent.suspect,
      testData.updateEvent.tag
    );

    const eventByRequestId = await getEventByRequestId(
      request,
      requestId,
      testData.valid.apiKey
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

test.describe("Node updateEvents Suite 400 errors", () => {
  test("updateEvents without sending any parameter to update - RequestCannotBeParsed", async ({
    request,
  }) => {
    const requestId = await generateRequestId(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    const updateEventResponse = await updateEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey
    );
    expect(updateEventResponse.status).toBe(400);
    expect(updateEventResponse.json).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          code: "RequestCannotBeParsed",
          message: "must provide one of: linkedId, suspect, tags to be updated",
        }),
      })
    );
  });
});

test.describe("Node updateEvents Suite 403 errors", () => {
  test("updateEvents Auth-API-Key header is missing - TokenRequired", async ({
    request,
  }) => {
    const requestId = await generateRequestId(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    const updateEventResponse = await updateEventByRequestId(
      request,
      requestId
    );
    expect(updateEventResponse.status).toBe(403);
    expect(updateEventResponse.json).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          code: "TokenRequired",
          message: "secret key is required",
        }),
      })
    );
  });
  test("updateEvents invalid Auth-API-Key - TokenNotFound", async ({
    request,
  }) => {
    const requestId = await generateRequestId(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    const updateEventResponse = await updateEventByRequestId(
      request,
      requestId,
      testData.invalid.apiKey
    );
    expect(updateEventResponse.status).toBe(403);
    expect(updateEventResponse.json).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          code: "TokenNotFound",
          message: "secret key is not found",
        }),
      })
    );
  });
});

test.describe("Node updateEvents Suite 404 errors", () => {
  test("updateEvents invalid requestId - RequestNotFound", async ({
    request,
  }) => {
    const updateEventResponse = await updateEventByRequestId(
      request,
      testData.invalid.requestID
    );
    expect(updateEventResponse.status).toBe(404);
    expect(updateEventResponse.json).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          code: "RequestNotFound",
          message: "request id not found",
        }),
      })
    );
  });
});

test.describe("Node updateEvents Suite 409 errors", () => {
  test("updateEvents Event Not ready - StateNotReady", async ({ request }) => {
    const requestId = await generateRequestId(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    const updateEventResponse = await updateEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey,
      testData.updateEvent.linkedId,
      undefined,
      undefined,
      false
    );
    expect(updateEventResponse.status).toBe(409);
    expect(updateEventResponse.json).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          code: "StateNotReady",
          message: "resource is not mutable yet, try again",
        }),
      })
    );
  });
});
