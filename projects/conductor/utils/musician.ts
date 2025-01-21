import {APIRequestContext, expect} from "@playwright/test";
import testData from "../utils/testData";
import {jsonRequest} from "./http";
import {delay} from "./delay";

export type MusicianResponse = {
  code: number;
  originalResponse: String,
  parsedResponse: unknown,
}

export type GetEventsParams = { apiKey: string; region: string; requestId: string }

export async function validateGetEventsResponse(
  request: APIRequestContext,
  requestData: { apiKey: string; region: string; requestId: string },
  expectedCode: number,
  expectedStructure?: any
) {
  const responseBody = await jsonRequest<MusicianResponse>(
    {request, url: `${testData.config.baseURL}/getEvents`, params: requestData}
  );

  expect(responseBody.data.code).toBe(expectedCode);

  if (expectedStructure) {
    expect(responseBody.data).toMatchObject(expectedStructure);
  }

  return responseBody.data;
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
