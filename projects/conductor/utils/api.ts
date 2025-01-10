import {APIRequestContext, expect} from "@playwright/test";
import testData from "./testData";
import {jsonRequest, JsonResponse} from "./http";
import {GetEventsParams, MusicianResponse} from "./musician";

export type GetVisitorParams = {
  apiKey: string;
  region?: string;
  visitorId: string;
  requestId?: string;
  linkedId?: string;
  limit?: number;
  paginationKey?: string;
  before?: number;
}

export interface FingerprintApi {
  getEvent(params: GetEventsParams): Promise<JsonResponse<any>>;

  getVisitor(params: GetVisitorParams): Promise<JsonResponse<any>>;
}

export class SdkFingerprintApi implements FingerprintApi {
  constructor(private request: APIRequestContext) {
  }

  async getEvent(params: GetEventsParams): Promise<JsonResponse<any>> {
    return this.doRequest('/getEvents', params);
  }

  async getVisitor(params: GetVisitorParams) {
    return this.doRequest('/getVisits', params);
  }

  private async doRequest(path: string, params: any) {
    const resp =  await jsonRequest<MusicianResponse>({
      request: this.request,
      url: `${testData.config.baseURL}${path}/`,
      params,
    });

    return {
      ...resp,
      response: {
        ...resp.response,
        status: () => resp.data.code,
      },
      data: resp.data.parsedResponse
    };
  }

}

export class RealFingerprintApi implements FingerprintApi {
  constructor(private request: APIRequestContext) {
  }

  async getEvent(params: GetEventsParams) {
    return await jsonRequest(
      {
        request: this.request,
        url: `${testData.config.apiUrl}/events/${params.requestId}`,
        headers: {
          "Auth-API-Key": params.apiKey,
          "content-type": "application/json",
        },
      }
    );
  }

  async getVisitor(params: GetVisitorParams) {
    const queryParams: Record<string, string | number> = {

    }

    if(params.requestId) {
      queryParams.request_id = params.requestId;
    }

    if(params.linkedId) {
      queryParams.linked_id = params.linkedId;
    }

    if(params.limit) {
      queryParams.limit = params.limit;
    }

    if(params.paginationKey) {
      queryParams.paginationKey = params.paginationKey;
    }

    if(params.before) {
      queryParams.before = params.before;
    }

    return await jsonRequest({
      request: this.request,
      url: `${testData.config.apiUrl}/visitors/${params.visitorId}`,
      params: queryParams,
      headers: {
        "Auth-API-Key": params.apiKey,
        "content-type": "application/json",
      },
    });
  }
}

/**
 * @deprecated Use RealFingerprintApi.getEvent instead
 * */
export async function getEvent(request: APIRequestContext, requestId: string, apiKey: string) {
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