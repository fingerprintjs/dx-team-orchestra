import {expect} from "@playwright/test";
import {testData} from "../utils/testData";
import {test} from "../utils/playwright";
import {delay} from "../utils/delay";
import {EventsGetResponse} from "@fingerprintjs/fingerprintjs-pro-server-api";

function checkUpdatedEvent(updatedEvent: EventsGetResponse) {
  const updatedResponseBody = updatedEvent.products.identification.data;
  const propertiesToValidate = ["linkedId", "tag", "suspect"];
  propertiesToValidate.forEach((property) => {
    expect(updatedResponseBody[property]).toStrictEqual(
      testData.updateEvent[property]
    );
  });
}

test.slow()

async function waitBeforeUpdate() {
  // delay added before updating to ensure that the requestId is ready to be used
  await delay(12000);
}

test.describe("UpdateEvents Suite", () => {
  test("for valid apiKey and requestId with Smart Signals", async ({sdkApi, identify}) => {
    const {requestId} = await identify(
      {
        auth: testData.credentials.maxFeaturesUS
      }
    );

    await waitBeforeUpdate()

    const {response} = await sdkApi.updateEvent(
      {
        requestId,
        apiKey: testData.credentials.maxFeaturesUS.privateKey,
        region: testData.credentials.maxFeaturesUS.publicKey,
        linkedId: testData.updateEvent.linkedId,
        suspect: testData.updateEvent.suspect,
        tag: testData.updateEvent.tag
      }
    );

    expect(response.status()).toEqual(200);

    const {data: updatedEvent} = await sdkApi.getEvent(
      {
        apiKey: testData.credentials.maxFeaturesUS.privateKey,
        region: testData.credentials.maxFeaturesUS.region,
        requestId
      }
    );

    checkUpdatedEvent(updatedEvent);
  });

  test("for valid apiKey and requestId without Smart Signals", async ({sdkApi, identify,}) => {
    const {requestId} = await identify(
      {
        auth: testData.credentials.minFeaturesUS
      }
    );

    await waitBeforeUpdate()

    const {response} = await sdkApi.updateEvent(
      {
        requestId,
        apiKey: testData.credentials.minFeaturesUS.privateKey,
        region: testData.credentials.minFeaturesUS.region,
        linkedId: testData.updateEvent.linkedId,
        suspect: testData.updateEvent.suspect,
        tag: testData.updateEvent.tag
      }
    );
    expect(response.status()).toEqual(200);

    const {data: updatedEvent} = await sdkApi.getEvent(
      {
        requestId,
        apiKey: testData.credentials.minFeaturesUS.privateKey,
        region: testData.credentials.minFeaturesUS.region,
      }
    );
    checkUpdatedEvent(updatedEvent);
  });

  test("for valid complex tag only", async ({sdkApi, identify}) => {
    const {requestId} = await identify(
      {
        auth: testData.credentials.maxFeaturesUS
      }
    );
    const {data: initialEvent} = await sdkApi.getEvent(
      {
        apiKey: testData.credentials.maxFeaturesUS.privateKey,
        region: testData.credentials.maxFeaturesUS.region,
        requestId
      }
    );
    const initialResponseBody = initialEvent.products.identification.data;

    await waitBeforeUpdate()

    const {response} = await sdkApi.updateEvent(
      {
        requestId,
        apiKey: testData.credentials.maxFeaturesUS.privateKey,
        region: testData.credentials.maxFeaturesUS.region,
        tag: testData.updateEventComplexTag.tag
      }
    );
    expect(response.status()).toEqual(200)

    const {data: updatedEvent} = await sdkApi.getEvent(
      {
        requestId,
        apiKey: testData.credentials.maxFeaturesUS.privateKey,
        region: testData.credentials.maxFeaturesUS.region,
      }
    );
    const identificationData = updatedEvent.products.identification.data;
    expect(identificationData.tag).toStrictEqual(
      testData.updateEventComplexTag.tag
    );
    expect(identificationData.linkedId).toStrictEqual(
      initialResponseBody.linkedId
    );
    expect(identificationData.suspect).toStrictEqual(
      initialResponseBody.suspect
    );
  });

  test("for linkedId only", async ({sdkApi, identify}) => {
    const {requestId} = await identify(
      {
        auth: testData.credentials.maxFeaturesUS
      }
    );
    const {data: initialEvent} = await sdkApi.getEvent(
      {
        apiKey: testData.credentials.maxFeaturesUS.privateKey,
        region: testData.credentials.maxFeaturesUS.region,
        requestId
      }
    );
    const initialResponseBody = initialEvent.products.identification.data;

    await waitBeforeUpdate();

    const {response} = await sdkApi.updateEvent(
      {
        requestId,
        apiKey: testData.credentials.maxFeaturesUS.privateKey,
        region: testData.credentials.maxFeaturesUS.region,
        linkedId: testData.updateEvent.linkedId
      }
    );
    expect(response.status()).toEqual(200)

    const {data: updatedEvent} = await sdkApi.getEvent(
      {
        requestId,
        apiKey: testData.credentials.maxFeaturesUS.privateKey,
        region: testData.credentials.maxFeaturesUS.region,
      }
    );
    const updatedResponseBody = updatedEvent.products.identification.data;
    expect(updatedResponseBody.linkedId).toStrictEqual(
      testData.updateEvent.linkedId
    );
    expect(updatedResponseBody.suspect).toStrictEqual(
      initialResponseBody.suspect
    );
    expect(updatedResponseBody.tag).toStrictEqual(initialResponseBody.tag);
  });

  for (const suspect of [true, false]) {
    test(`updateEvents for suspect=${suspect} only`, async ({sdkApi, identify}) => {
      const {requestId} = await identify(
        {
          auth: testData.credentials.maxFeaturesUS
        }
      );
      const {data: initialEvent} = await sdkApi.getEvent(
        {
          requestId,
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
        }
      );
      const initialResponseBody = initialEvent.products.identification.data;

      await waitBeforeUpdate();

      const {response} = await sdkApi.updateEvent(
        {
          requestId,
          apiKey: testData.validSmartSignal.apiKey,
          region: testData.validSmartSignal.region,
          suspect
        }
      );
      expect(response.status()).toEqual(200)

      const {data: updatedEvent} = await sdkApi.getEvent(
        {
          requestId,
          apiKey: testData.validSmartSignal.apiKey,
          region: testData.validSmartSignal.region,
        }
      );
      const updatedResponseBody = updatedEvent.products.identification.data;
      expect(updatedResponseBody.suspect).toBe(suspect);

      expect(updatedResponseBody.linkedId).toStrictEqual(initialResponseBody.linkedId);
      expect(updatedResponseBody.tag).toStrictEqual(initialResponseBody.tag);
    })
  }
});

test.describe("UpdateEvents Suite 400 errors", () => {
  test("without sending any parameter to update - RequestCannotBeParsed", async ({identify, assert}) => {
    const {requestId} = await identify({
      auth: testData.credentials.maxFeaturesUS
    });

    await assert.thatResponseMatch(
      {
        expectedResponse: {
          error: {
            code: "RequestCannotBeParsed",
            message: "must provide one of: linkedId, suspect, tags to be updated",
          },
        },
        expectedStatusCode: 400,
        callback: api => api.updateEvent({
          requestId,
          apiKey: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
        })
      }
    )
  });
});

test.describe("UpdateEvents Suite 403 errors", () => {
  test("Auth-API-Key header is missing - TokenRequired", async ({identify, assert}) => {
    const {requestId} = await identify({
      auth: testData.credentials.maxFeaturesUS
    });

    await assert.thatResponseMatch(
      {
        expectedStatusCode: 403,
        expectedResponse: {
          error: {
            code: "TokenRequired",
            message: "secret key is required",
          },
        },
        callback: api => api.updateEvent({
          requestId,
          region: testData.credentials.maxFeaturesUS.region,
          linkedId: testData.updateEvent.linkedId,
          suspect: testData.updateEvent.suspect,
          tag: testData.updateEvent.tag,
        })
      }
    );
  });

  test("invalid Auth-API-Key - TokenNotFound", async ({assert, identify}) => {
    const {requestId} = await identify({
      auth: testData.credentials.maxFeaturesUS
    });

    await assert.thatResponseMatch({
      expectedResponse: {
        error: {
          code: "TokenNotFound",
          message: "secret key is not found",
        },
      },
      expectedStatusCode: 403,
      callback: api => api.updateEvent({
        requestId,
        apiKey: testData.credentials.invalid.privateKey,
        region: testData.credentials.invalid.region,
        linkedId: testData.updateEvent.linkedId,
        suspect: testData.updateEvent.suspect,
        tag: testData.updateEvent.tag,
      })
    })
  });
});

test.describe("UpdateEvents Suite 404 errors", () => {
  test("invalid requestId - RequestNotFound", async ({assert}) => {
    await assert.thatResponseMatch({
      expectedResponse: {
        error: {
          code: "RequestNotFound",
          message: "request id not found",
        },
      },
      expectedStatusCode: 404,
      callback: api => api.updateEvent({
        requestId: testData.invalid.requestID,
        apiKey: testData.credentials.maxFeaturesUS.privateKey,
        region: testData.credentials.maxFeaturesUS.region,
        linkedId: testData.updateEvent.linkedId,
        suspect: testData.updateEvent.suspect,
        tag: testData.updateEvent.tag,
      }),
    })
  });
});

test.describe("UpdateEvents Suite 409 errors", () => {
  test("updateEvents Event Not ready - StateNotReady", async ({identify, assert}) => {
    const {requestId} = await identify({
      auth: testData.credentials.maxFeaturesUS
    });

    await assert.thatResponseMatch({
      expectedStatusCode: 409,
      expectedResponse: {
        error: {
          code: "StateNotReady",
          message: "resource is not mutable yet, try again",
        },
      },
      callback: api => api.updateEvent({
        requestId,
        apiKey: testData.credentials.maxFeaturesUS.privateKey,
        region: testData.credentials.maxFeaturesUS.region,
        linkedId: testData.updateEvent.linkedId,
        suspect: testData.updateEvent.suspect,
        tag: testData.updateEvent.tag,
      })
    })
  });
});
