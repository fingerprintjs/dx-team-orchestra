import { test, expect } from "@playwright/test";
import { generateIdentificationData } from "../htmlScripts/runIdentification";
import testData from "../utils/testData";
import { deleteVisitorDataRequest, getEventByVisitorId } from "../utils/api";

test.describe("DeleteVisitorData Suite", () => {
  test("deleteVisitorData for valid apiKey and visitorId with Smart Signals", async ({
    request,
  }) => {
    const visitorId = await generateIdentificationData(
      "visitorId",
      testData.generatidentification.publicApiKeySS
    );

    await deleteVisitorDataRequest(
      request,
      {
        visitorId,
        apiKey: testData.validSmartSignal.apiKey
      }
    );

    const deletedVisitor = await getEventByVisitorId(
      request,
      visitorId,
      testData.validSmartSignal.apiKey,
      true
    );
    expect(deletedVisitor).toEqual(
      expect.objectContaining({
        visitorId: visitorId,
        visits: [],
      })
    );
  });
});

test.describe("DeleteVisitorData Suite 400 errors", () => {
  test("deleteVisitorData without sending vistorId - RequestCannotBeParsed", async ({
    request,
  }) => {
    const deleteResponseBody = await deleteVisitorDataRequest(
      request,
      {
        apiKey: testData.validSmartSignal.apiKey
      }
    );
    expect(deleteResponseBody.code).toBe(400);
    expect(deleteResponseBody.parsedResponse).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          code: "RequestCannotBeParsed",
          message: "visitor id is required",
        }),
      })
    );
  });
  test.describe("DeleteVisitorData Suite 403 errors", () => {
    test("deleteVisitorData APIKey is missing - TokenRequired", async ({
      request,
    }) => {
      const visitorId = await generateIdentificationData(
        "visitorId",
        testData.generatidentification.publicApiKeySS
      );
      const deleteResponseBody = await deleteVisitorDataRequest(
        request,
        {visitorId}
      );
      expect(deleteResponseBody.code).toBe(403);
      expect(deleteResponseBody.parsedResponse).toEqual(
        expect.objectContaining({
          error: expect.objectContaining({
            code: "TokenRequired",
            message: "secret key is required",
          }),
        })
      );
    });
    test("deleteVisitorData - FeatureNotEnabled", async ({ request }) => {
      const visitorId = await generateIdentificationData(
        "visitorId",
        testData.generatidentification.publicApiKeySS
      );
      const deleteResponseBody = await deleteVisitorDataRequest(
        request,
        {
          visitorId,
          apiKey: testData.valid.apiKey
        }
      );
      expect(deleteResponseBody.code).toBe(403);
      expect(deleteResponseBody.parsedResponse).toEqual(
        expect.objectContaining({
          error: expect.objectContaining({
            code: "FeatureNotEnabled",
            message: "feature not enabled",
          }),
        })
      );
    });
  });

  test.describe("DeleteVisitorData Suite 404 errors", () => {
    test("deleteVisitorData - VisitorNotFound", async ({ request }) => {
      const deleteResponseBody = await deleteVisitorDataRequest(
        request,
        {
          visitorId: testData.invalid.visitorId,
          apiKey: testData.validSmartSignal.apiKey
        }
      );
      expect(deleteResponseBody.code).toBe(404);
      expect(deleteResponseBody.parsedResponse).toEqual(
        expect.objectContaining({
          error: expect.objectContaining({
            code: "VisitorNotFound",
            message: "visitor not found",
          }),
        })
      );
    });
  });
});
