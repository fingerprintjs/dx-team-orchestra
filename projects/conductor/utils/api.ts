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

export async function getEventByRequestId(request, requestId, apiKey) {
  const getEventByRequestID = await request.get(
    `${testData.config.apiUrl}/events/${requestId}`,
    {
      headers: {
        "Auth-API-Key": apiKey,
        "content-type": "application/json",
      },
    }
  );
  expect(getEventByRequestID.status()).toEqual(200);
  return getEventByRequestID.json();
}
