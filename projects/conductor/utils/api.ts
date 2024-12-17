import { APIRequestContext, expect } from "@playwright/test";
import testData from "../utils/testData";

export async function getApiRequest(
  request: APIRequestContext,
  url: string,
  params: Record<string, string>
): Promise<any> {
  const response = await request.get(url, { params });
  if (!response.ok()) {
    throw new Error(`Request failed with status ${response.status()}`);
  }
  return await response.json();
}

export async function validateGetEventsResponse(
  request: any,
  requestData: { apiKey: string; region: string; requestId: string },
  expectedCode: number,
  expectedStructure?: any
) {
  const responseBody = await getApiRequest(
    request,
    `${testData.config.baseURL}/getEvents`,
    requestData
  );

  expect(responseBody.code).toBe(expectedCode);

  if (expectedStructure) {
    expect(responseBody).toMatchObject(expectedStructure);
  }

  return responseBody;
}

export const getEventsexpectedResponseStructure = {
  code: expect.any(Number),
  originalResponse: expect.objectContaining({
    products: expect.objectContaining({
      identification: expect.objectContaining({
        data: expect.objectContaining({
          requestId: expect.any(String),
          visitorId: expect.any(String),
          ip: expect.any(String),
          browserDetails: expect.objectContaining({
            browserName: expect.any(String),
            browserFullVersion: expect.any(String),
            os: expect.any(String),
            osVersion: expect.any(String),
          }),
        }),
      }),
      rawDeviceAttributes: expect.objectContaining({
        data: expect.objectContaining({
          architecture: expect.objectContaining({
            value: expect.any(Number),
          }),
          audio: expect.objectContaining({
            value: expect.any(Number),
          }),
          canvas: expect.objectContaining({
            value: expect.objectContaining({
              Geometry: expect.any(String),
              Text: expect.any(String),
              Winding: expect.any(Boolean),
            }),
          }),
          hardwareConcurrency: expect.objectContaining({
            value: expect.any(Number),
          }),
        }),
      }),
      botd: expect.objectContaining({
        data: expect.objectContaining({
          bot: expect.objectContaining({
            result: expect.any(String),
            type: expect.any(String),
          }),
        }),
      }),
    }),
  }),
  parsedResponse: expect.any(Object),
};
