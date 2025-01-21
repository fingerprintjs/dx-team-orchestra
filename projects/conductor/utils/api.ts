import {APIRequestContext, expect} from "@playwright/test";
import testData from "./testData";
import { jsonRequest, JsonResponse, RequestParams } from './http';
import {GetEventsParams, MusicianResponse} from "./musician";
import {
  EventsGetResponse,
  EventsUpdateRequest,
  RelatedVisitorsResponse,
  VisitorsResponse
} from '@fingerprintjs/fingerprintjs-pro-server-api'

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

export type GetRelatedVisitorsParams = {
  apiKey: string;
  region?: string;
  visitorId: string
};

export type UpdateEventParams = EventsUpdateRequest & {
  apiKey?: string;
  requestId: string
  region?: string
}

export type UnsealParams = {
  sealedData: string;
  keys: { key: string; algorithm: string }[];
}

export interface FingerprintApi {
  getEvent(params: GetEventsParams): Promise<JsonResponse<EventsGetResponse>>;

  getVisitor(params: GetVisitorParams): Promise<JsonResponse<VisitorsResponse>>;

  getRelatedVisitors(params: GetRelatedVisitorsParams): Promise<JsonResponse<RelatedVisitorsResponse>>;

  updateEvent(params: UpdateEventParams): Promise<JsonResponse<unknown>>;
}

export class SdkFingerprintApi implements FingerprintApi {
  constructor(private request: APIRequestContext) {
  }

  async getEvent(params: GetEventsParams): Promise<JsonResponse<EventsGetResponse>> {
    return this.doRequest<EventsGetResponse>('/getEvents', params);
  }

  async getVisitor(params: GetVisitorParams): Promise<JsonResponse<VisitorsResponse>> {
    return this.doRequest<VisitorsResponse>('/getVisits', params);
  }

  async getRelatedVisitors(params: GetRelatedVisitorsParams) {
    return this.doRequest<RelatedVisitorsResponse>('/getRelatedVisitors', params);
  }

  async updateEvent({tag, ...params}: UpdateEventParams): Promise<JsonResponse<void>> {
    const requestParams = {
      ...params,
    } as Omit<UpdateEventParams, 'tag'> & { tag?: string };

    if (tag) {
      requestParams.tag = JSON.stringify(tag);
    }

    return this.doRequest<void>('/updateEvent', requestParams)
  }

  async unseal(params: UnsealParams) {
    return this.doRequest<EventsGetResponse>('/unseal', params, 'post');
  }

  private async doRequest<T>(path: string, params: RequestParams): Promise<JsonResponse<T>> {
    const url = `${testData.config.baseURL}${path}`;
    const resp = await jsonRequest<MusicianResponse>({
      request: this.request,
      url,
      params,
      method,
    });

    Object.assign(resp.response, {
      status: () => resp.data.code,
    })

    return {
      ...resp,
      data: resp.data.parsedResponse as T
    };
  }

}

export class RealFingerprintApi implements FingerprintApi {
  constructor(private request: APIRequestContext) {
  }

  async updateEvent({requestId, apiKey, region, ...data}: UpdateEventParams): Promise<JsonResponse<void>> {
    return await jsonRequest<void>(
      {
        request: this.request,
        url: `${testData.config.apiUrl}/events/${requestId}`,
        data,
        headers: {
          "Auth-API-Key": apiKey,
          "content-type": "application/json",
        },
      })
  }

  async getRelatedVisitors(params: GetRelatedVisitorsParams) {
    return await jsonRequest(
      {
        request: this.request,
        url: `${testData.config.apiUrl}/related-visitors`,
        params: {
          visitor_id: params.visitorId,
        },
        headers: {
          "Auth-API-Key": params.apiKey,
          "content-type": "application/json",
        },
      })
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