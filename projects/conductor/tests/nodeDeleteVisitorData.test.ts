import { test, expect } from "@playwright/test";
import { generateIdentificationData } from "../htmlScripts/runNodeIdentification";
import testData from "../utils/testData";
import { deleteDataByVisitorId, getEventByVisitorId } from "../utils/api";

test.describe("Node deleteVisitorData Suite", () => {
  test("deleteVisitorData for valid apiKey and visitorId with Smart Signals", async ({
    request,
  }) => {
    const visitorId = await generateIdentificationData(
      "visitorId",
      testData.generatidentification.publicApiKeySS
    );

    await deleteDataByVisitorId(
      request,
      visitorId,
      testData.validSmartSignal.apiKey
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

test.describe("Node deleteVisitorData Suite 400 errors", () => {
  test("deleteVisitorData without sending vistorId - RequestCannotBeParsed", async ({
    request,
  }) => {
    const visitorId = await generateIdentificationData(
      "visitorId",
      testData.generatidentification.publicApiKeySS
    );
    const deleteResponseBody = await deleteDataByVisitorId(
      request,
      undefined,
      testData.validSmartSignal.apiKey
    );
    expect(deleteResponseBody.status).toBe(400);
    expect(deleteResponseBody.json).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          code: "RequestCannotBeParsed",
          message: "invalid visitor id",
        }),
      })
    );
  });
  test.describe("Node deleteVisitorData Suite 403 errors", () => {
    test("deleteVisitorData Auth-API-Key header is missing - TokenRequired", async ({
      request,
    }) => {
      const visitorId = await generateIdentificationData(
        "visitorId",
        testData.generatidentification.publicApiKeySS
      );
      const deleteResponseBody = await deleteDataByVisitorId(
        request,
        visitorId
      );
      expect(deleteResponseBody.status).toBe(403);
      expect(deleteResponseBody.json).toEqual(
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
      const deleteResponseBody = await deleteDataByVisitorId(
        request,
        visitorId,
        testData.valid.apiKey
      );
      expect(deleteResponseBody.status).toBe(403);
      expect(deleteResponseBody.json).toEqual(
        expect.objectContaining({
          error: expect.objectContaining({
            code: "FeatureNotEnabled",
            message: "feature not enabled",
          }),
        })
      );
    });
  });

  test.describe("Node deleteVisitorData Suite 404 errors", () => {
    test("deleteVisitorData - VisitorNotFound", async ({ request }) => {
      const deleteResponseBody = await deleteDataByVisitorId(
        request,
        testData.invalid.visitorId,
        testData.validSmartSignal.apiKey
      );
      expect(deleteResponseBody.status).toBe(404);
      expect(deleteResponseBody.json).toEqual(
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
