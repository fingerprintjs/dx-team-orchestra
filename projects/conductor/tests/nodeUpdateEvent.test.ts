import { test, expect } from "@playwright/test";
import { generateIdentificationData } from "../htmlScripts/runNodeIdentification";
import testData from "../utils/testData";
import { getEventByRequestId, updateEventApiRequest } from "../utils/api";

test.describe("Node updateEvents Suite", () => {
  test("updateEvents for valid apiKey and requestId with Smart Signals", async ({
    request,
  }) => {
    const requestId = await generateIdentificationData(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
     const updateResult = await updateEventApiRequest(
      request,
      {
        requestId,
        apiKey: testData.validSmartSignal.apiKey,
        region: testData.validSmartSignal.region,
        linkedId: testData.updateEvent.linkedId,
        suspect: testData.updateEvent.suspect,
        tag: testData.updateEvent.tag
      }
    );
    expect(updateResult.code, {message: JSON.stringify(updateResult.parsedResponse)}).toBe(200);

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
  });

  test("updateEvents for valid apiKey and requestId without Smart Signals", async ({
    request,
  }) => {
    const requestId = await generateIdentificationData(
      "requestId",
      testData.generatidentification.publicApiKey
    );
    const updateResult = await updateEventApiRequest(
      request,
      {
        requestId,
        apiKey: testData.valid.apiKey,
        region: testData.valid.region,
        linkedId: testData.updateEvent.linkedId,
        suspect: testData.updateEvent.suspect,
        tag: testData.updateEvent.tag
      }
    );
    expect(updateResult.code, {message: JSON.stringify(updateResult.parsedResponse)}).toBe(200);

    const eventByRequestId = await getEventByRequestId(
      request,
      requestId,
      testData.valid.apiKey
    );
    const ResponseBody = await eventByRequestId.products.identification.data;
    const propertiesToValidate = ["linkedId", "tag", "suspect"];
    propertiesToValidate.forEach((property) => {
      expect(ResponseBody[property]).toStrictEqual(
        testData.updateEvent[property]
      );
    });
  });

  test("updateEvents for valid compelx tag only", async ({ request }) => {
    const requestId = await generateIdentificationData(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    const initialEvent = await getEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey
    );
    const initialResponseBody = await initialEvent.products.identification.data;
    const updateResult = await updateEventApiRequest(
      request,
      {
        requestId,
        apiKey: testData.validSmartSignal.apiKey,
        region: testData.validSmartSignal.region,
        tag: testData.updateEventComplexTag.tag
      }
    );
    expect(updateResult.code, {message: JSON.stringify(updateResult.parsedResponse)}).toBe(200);

    const eventByRequestId = await getEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey
    );
    const updatedResponseBody = await eventByRequestId.products.identification
      .data;
    expect(updatedResponseBody.tag).toStrictEqual(
      testData.updateEventComplexTag.tag
    );
    expect(updatedResponseBody.linkedId).toStrictEqual(
      initialResponseBody.linkedId
    );
    expect(updatedResponseBody.suspect).toStrictEqual(
      initialResponseBody.suspect
    );
  });

  test("updateEvents for linkedId only", async ({ request }) => {
    const requestId = await generateIdentificationData(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    const initialEvent = await getEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey
    );
    const initialResponseBody = await initialEvent.products.identification.data;
    const updateResult = await updateEventApiRequest(
      request,
        {
          requestId,
          apiKey: testData.validSmartSignal.apiKey,
          region: testData.validSmartSignal.region,
          linkedId: testData.updateEvent.linkedId
        }
    );
    expect(updateResult.code, {message: JSON.stringify(updateResult.parsedResponse)}).toBe(200);

    const eventByRequestId = await getEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey
    );
    const updatedResponseBody = eventByRequestId.products.identification.data;
    expect(updatedResponseBody.linkedId).toStrictEqual(
      testData.updateEvent.linkedId
    );
    expect(updatedResponseBody.suspect).toStrictEqual(
      initialResponseBody.suspect
    );
    expect(updatedResponseBody.tag).toStrictEqual(initialResponseBody.tag);
  });

  test("updateEvents for suspect only", async ({ request }) => {
    const requestId = await generateIdentificationData(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    const initialEvent = await getEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey
    );
    const initialResponseBody = await initialEvent.products.identification.data;

    const updateResult = await updateEventApiRequest(
      request,
      {
        requestId,
        apiKey: testData.validSmartSignal.apiKey,
        region: testData.validSmartSignal.region,
        suspect: testData.updateEvent.suspect
      }
    );
    expect(updateResult.code, {message: JSON.stringify(updateResult.parsedResponse)}).toBe(200);

    const updatedEvent = await getEventByRequestId(
      request,
      requestId,
      testData.validSmartSignal.apiKey
    );
    const updatedResponseBody = await updatedEvent.products.identification.data;
    expect(updatedResponseBody.suspect).toStrictEqual(
      testData.updateEvent.suspect
    );

    expect(updatedResponseBody.linkedId).toStrictEqual(initialResponseBody.linkedId);
    expect(updatedResponseBody.tag).toStrictEqual(initialResponseBody.tag);
  });
});

test.describe("Node updateEvents Suite 400 errors", () => {
  test("updateEvents without sending any parameter to update - RequestCannotBeParsed", async ({
    request,
  }) => {
    const requestId = await generateIdentificationData(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    const updateEventResponse = await updateEventApiRequest(
        request,
        {
          requestId,
          apiKey: testData.validSmartSignal.apiKey,
          region: testData.validSmartSignal.region,
        }
    );
    expect(updateEventResponse.code).toBe(400);
    expect(updateEventResponse.parsedResponse).toEqual(
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
    const requestId = await generateIdentificationData(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    const updateEventResponse = await updateEventApiRequest(
      request,
      {requestId}
    );

    expect(updateEventResponse.code).toBe(403);
    expect(updateEventResponse.parsedResponse).toEqual(
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
    const requestId = await generateIdentificationData(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    const updateEventResponse = await updateEventApiRequest(
      request,
      {
        requestId,
        apiKey: testData.invalid.apiKey,
        region: testData.invalid.region,
      }
    );
    expect(updateEventResponse.code).toBe(403);
    expect(updateEventResponse.parsedResponse).toEqual(
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
    const updateEventResponse = await updateEventApiRequest(
      request,
      {
        apiKey: testData.invalid.apiKey,
        requestId: testData.invalid.requestID
      }
    );
    expect(updateEventResponse.code).toBe(404);
    expect(updateEventResponse.parsedResponse).toEqual(
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
    const requestId = await generateIdentificationData(
      "requestId",
      testData.generatidentification.publicApiKeySS
    );
    const updateEventResponse = await updateEventApiRequest(
      request,
      {
        requestId,
        apiKey: testData.validSmartSignal.apiKey,
        region: testData.validSmartSignal.region,
        linkedId: testData.updateEvent.linkedId
      },
      false
    );
    expect(updateEventResponse.code).toBe(409);
    expect(updateEventResponse.parsedResponse).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          code: "StateNotReady",
          message: "resource is not mutable yet, try again",
        }),
      })
    );
  });
});
