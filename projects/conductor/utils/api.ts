import { APIRequestContext, expect } from '@playwright/test'
import testData from './testData'
import { jsonRequest, JsonResponse, RequestParams } from './http'
import { MusicianResponse } from './musician'
import {
  EventsGetResponse,
  EventsUpdateRequest,
  RelatedVisitorsResponse,
  SearchEventsResponse,
  VisitorsResponse,
} from '@fingerprintjs/fingerprintjs-pro-server-api'

export type GetVisitorParams = {
  apiKey: string
  region?: string
  visitorId: string
  requestId?: string
  linkedId?: string
  limit?: number
  paginationKey?: string
  before?: number
}

export type GetRelatedVisitorsParams = {
  apiKey: string
  region?: string
  visitorId: string
}

export type UpdateEventParams = EventsUpdateRequest & {
  apiKey?: string
  requestId: string
  region?: string
}

export type UnsealParams = {
  sealedData: string
  keys: { key: string; algorithm: string }[]
}

export type DeleteVisitorParams = {
  apiKey?: string
  region?: string
  visitorId?: string
}

export type SearchEventsParams = {
  apiKey?: string
  region?: string
  limit?: number
  paginationKey?: string
  visitorId?: string
  bot?: string
  ipAddress?: string
  linkedId?: string
  start?: number
  end?: number
  reverse?: boolean
  suspect?: boolean
}

export type GetEventsParams = { apiKey: string; region: string; requestId: string }

export type ExtractFingerprintApiReturnType<Method extends keyof FingerprintApi> =
    FingerprintApi[Method] extends (...args: any[]) => Promise<JsonResponse<infer Data>>
        ? Data
        : never;

export interface FingerprintApi {
  getEvent(params: GetEventsParams): Promise<JsonResponse<EventsGetResponse>>

  getVisitor(params: GetVisitorParams): Promise<JsonResponse<VisitorsResponse>>

  getRelatedVisitors(params: GetRelatedVisitorsParams): Promise<JsonResponse<RelatedVisitorsResponse>>

  updateEvent(params: UpdateEventParams): Promise<JsonResponse<unknown>>

  searchEvents(params: SearchEventsParams): Promise<JsonResponse<SearchEventsResponse>>

  deleteVisitor(params: DeleteVisitorParams): Promise<JsonResponse<unknown>>
}

export class SdkFingerprintApi implements FingerprintApi {
  constructor(private request: APIRequestContext) {}

  async getEvent(params: GetEventsParams): Promise<JsonResponse<EventsGetResponse>> {
    return this.doRequest<EventsGetResponse>('/getEvents', params)
  }

  async getVisitor(params: GetVisitorParams): Promise<JsonResponse<VisitorsResponse>> {
    return this.doRequest<VisitorsResponse>('/getVisits', params)
  }

  async getRelatedVisitors(params: GetRelatedVisitorsParams) {
    return this.doRequest<RelatedVisitorsResponse>('/getRelatedVisitors', params)
  }

  async deleteVisitor(params: DeleteVisitorParams): Promise<JsonResponse<unknown>> {
    return this.doRequest<unknown>('/deleteVisitorData', params)
  }

  async searchEvents(params: SearchEventsParams): Promise<JsonResponse<SearchEventsResponse>> {
    return this.doRequest('/searchEvents', params)
  }

  async updateEvent({ tag, ...params }: UpdateEventParams): Promise<JsonResponse<void>> {
    const requestParams = {
      ...params,
    } as Omit<UpdateEventParams, 'tag'> & { tag?: string }

    if (tag) {
      requestParams.tag = JSON.stringify(tag)
    }

    return this.doRequest<void>('/updateEvent', requestParams)
  }

  async unseal(params: UnsealParams) {
    return this.doRequest<EventsGetResponse>('/unseal', params, 'post')
  }

  private async doRequest<T>(
    path: string,
    params: RequestParams,
    method: 'post' | 'get' = 'get'
  ): Promise<JsonResponse<T>> {
    const url = `${testData.config.baseURL}${path}`
    const resp = await jsonRequest<MusicianResponse>({
      request: this.request,
      url,
      params,
      method,
    })

    Object.assign(resp.response, {
      status: () => resp.data.code,
    })

    return {
      ...resp,
      data: resp.data.parsedResponse as T,
    }
  }
}

export class RealFingerprintApi implements FingerprintApi {
  constructor(private request: APIRequestContext) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateEvent({ requestId, apiKey, region, ...data }: UpdateEventParams): Promise<JsonResponse<void>> {
    return await jsonRequest<void>({
      request: this.request,
      url: `${testData.config.apiUrl}/events/${requestId}`,
      data,
      headers: {
        'Auth-API-Key': apiKey,
        'content-type': 'application/json',
      },
    })
  }

  async searchEvents(params: SearchEventsParams): Promise<JsonResponse<SearchEventsResponse>> {
    const queryParams: Record<string, string | number | boolean> = {}

    if (typeof params.limit === 'number') {
      queryParams.limit = params.limit
    }
    if (params.paginationKey) {
      queryParams.pagination_key = params.paginationKey
    }
    if (params.visitorId) {
      queryParams.visitor_id = params.visitorId
    }
    if (params.bot) {
      queryParams.bot = params.bot
    }
    if (params.ipAddress) {
      queryParams.ip_address = params.ipAddress
    }
    if (params.linkedId) {
      queryParams.linked_id = params.linkedId
    }
    if (typeof params.start === 'number') {
      queryParams.start = params.start
    }
    if (typeof params.end === 'number') {
      queryParams.end = params.end
    }
    if (typeof params.reverse === 'boolean') {
      queryParams.reverse = params.reverse
    }
    if (typeof params.suspect === 'boolean') {
      queryParams.suspect = params.suspect
    }

    return await jsonRequest<SearchEventsResponse>({
      request: this.request,
      url: `${testData.config.apiUrl}/events/search`,
      params: queryParams,
      headers: {
        'Auth-API-Key': params.apiKey,
        'content-type': 'application/json',
      },
    })
  }

  async deleteVisitor(params: DeleteVisitorParams): Promise<JsonResponse<unknown>> {
    return await jsonRequest<void>({
      request: this.request,
      url: `${testData.config.apiUrl}/visitors/${params.visitorId}`,
      headers: {
        'Auth-API-Key': params.apiKey,
        'content-type': 'application/json',
      },
    })
  }

  async getRelatedVisitors(params: GetRelatedVisitorsParams) {
    return await jsonRequest({
      request: this.request,
      url: `${testData.config.apiUrl}/related-visitors`,
      params: {
        visitor_id: params.visitorId,
      },
      headers: {
        'Auth-API-Key': params.apiKey,
        'content-type': 'application/json',
      },
    })
  }

  async getEvent(params: GetEventsParams) {
    return await jsonRequest({
      request: this.request,
      url: `${testData.config.apiUrl}/events/${params.requestId}`,
      headers: {
        'Auth-API-Key': params.apiKey,
        'content-type': 'application/json',
      },
    })
  }

  async getVisitor(params: GetVisitorParams) {
    const queryParams: Record<string, string | number> = {}

    if (params.requestId) {
      queryParams.request_id = params.requestId
    }

    if (params.linkedId) {
      queryParams.linked_id = params.linkedId
    }

    if (params.limit) {
      queryParams.limit = params.limit
    }

    if (params.paginationKey) {
      queryParams.paginationKey = params.paginationKey
    }

    if (params.before) {
      queryParams.before = params.before
    }

    return await jsonRequest({
      request: this.request,
      url: `${testData.config.apiUrl}/visitors/${params.visitorId}`,
      params: queryParams,
      headers: {
        'Auth-API-Key': params.apiKey,
        'content-type': 'application/json',
      },
    })
  }
}

/**
 * @deprecated Use RealFingerprintApi.getEvent instead
 * */
export async function getEvent(request: APIRequestContext, requestId: string, apiKey: string) {
  const getEventByRequestID = await request.get(`${testData.config.apiUrl}/events/${requestId}`, {
    headers: {
      'Auth-API-Key': apiKey,
      'content-type': 'application/json',
    },
  })
  expect(getEventByRequestID.status()).toEqual(200)
  return getEventByRequestID.json()
}
