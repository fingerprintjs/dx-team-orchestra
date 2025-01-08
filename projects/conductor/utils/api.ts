import { APIRequestContext, expect } from "@playwright/test";
import testData from "../utils/testData";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export type MusicianResponse = {
  code: number;
  originalResponse: String,
  parsedResponse: unknown,
}

export async function getEventsApiRequest(
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
  request: APIRequestContext,
  requestData: { apiKey: string; region: string; requestId: string },
  expectedCode: number,
  expectedStructure?: any
) {
  const responseBody = await getEventsApiRequest(
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

export async function getEventByRequestId(request: APIRequestContext, requestId: string, apiKey: string) {
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


type UpdateEventParams = {
  apiKey?: string;
  region?: string;
  requestId?: string;
  linkedId?: string;
  suspect?: boolean;
  tag?: { [key: string]: unknown };
}

export async function updateEventApiRequest(
  request: APIRequestContext,
  params: UpdateEventParams,
  withDelay: boolean = true
): Promise<MusicianResponse> {
  // delay added before updating to ensure that the requestId is ready to be used
  if (withDelay) {
    await delay(12000);
  }
  const {tag, ...queryParamsWithoutTag} = params;
  const queryParams: { [key: string]: string | number | boolean; } = queryParamsWithoutTag;
  if (tag) {
    queryParams.tag = JSON.stringify(tag);
  }

  const updateEventByRequestID = await request.get(`${testData.config.baseURL}/updateEvent`, {params: queryParams});
  const musicianResponse = await updateEventByRequestID.json();
  expect(updateEventByRequestID.status()).toEqual(200);
  return musicianResponse;
}

type DeleteVisitorDataParams = {
  apiKey?: string;
  region?: string;
  visitorId?: string;
}

export async function deleteVisitorDataRequest(request: APIRequestContext, params: DeleteVisitorDataParams): Promise<MusicianResponse> {
  const deleteEventByRequestID = await request.get(`${testData.config.baseURL}/deleteVisitorData`, {params});
  const musicianResponse = await deleteEventByRequestID.json();
  expect(deleteEventByRequestID.status()).toEqual(200);
  return musicianResponse;
}
export async function getEventByVisitorId(
  request,
  visitorId,
  apiKey,
  withDelay: boolean = false
) {
  if (withDelay) {
    await delay(30000);
  }
  const getEventByVisitorId = await request.get(
    `${testData.config.apiUrl}/visitors/${visitorId}`,
    {
      headers: {
        "Auth-API-Key": apiKey,
        "content-type": "application/json",
      },
    }
  );
  expect(getEventByVisitorId.status()).toEqual(200);
  return getEventByVisitorId.json();
}
