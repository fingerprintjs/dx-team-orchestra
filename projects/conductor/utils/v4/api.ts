import { APIRequestContext } from '@playwright/test'
import testData from '../testData'
import { jsonRequest, JsonResponse } from '../http'
import { MusicianResponse } from '../musician'
import { Event, EventUpdate, SearchEventsFilter, SearchEventsResponse } from '@fingerprint/node-sdk'

export type UpdateEventParams = EventUpdate & {
  api_key?: string
  region?: string

  event_id: string
}

export type UnsealParams = {
  sealedData: string
  keys: { key: string; algorithm: string }[]
}

export type DeleteVisitorParams = {
  api_key?: string
  region?: string
  visitor_id?: string
}

export type SearchEventsParams = SearchEventsFilter & {
  api_key?: string
  region?: string
}

export type GetEventsParams = { api_key: string; region: string; event_id: string }

export type ExtractFingerprintV4ApiReturnType<Method extends keyof FingerprintV4Api> =
  FingerprintV4Api[Method] extends (...args: any[]) => Promise<JsonResponse<infer Data>> ? Data : never

export interface FingerprintV4Api {
  getEvent(params: GetEventsParams): Promise<JsonResponse<Event>>

  updateEvent(params: UpdateEventParams): Promise<JsonResponse<unknown>>

  searchEvents(params: SearchEventsParams): Promise<JsonResponse<SearchEventsResponse>>

  deleteVisitor(params: DeleteVisitorParams): Promise<JsonResponse<unknown>>
}

export class SdkFingerprintV4Api implements FingerprintV4Api {
  constructor(private request: APIRequestContext) {}

  async getEvent(params: GetEventsParams): Promise<JsonResponse<Event>> {
    return this.doRequest<Event>('/v4/getEvent', params)
  }

  async deleteVisitor(params: DeleteVisitorParams): Promise<JsonResponse<unknown>> {
    return this.doRequest<unknown>('/v4/deleteVisitorData', params)
  }

  async searchEvents(params: SearchEventsParams): Promise<JsonResponse<SearchEventsResponse>> {
    return this.doRequest('/v4/searchEvents', params)
  }

  async updateEvent({ tags, ...params }: UpdateEventParams): Promise<JsonResponse<void>> {
    const requestParams = {
      ...params,
    } as Omit<UpdateEventParams, 'tags'> & { tags?: string }

    if (tags) {
      requestParams.tags = JSON.stringify(tags)
    }

    return this.doRequest<void>('/v4/updateEvent', requestParams)
  }

  async unseal(params: UnsealParams) {
    return this.doRequest<Event>('/v4/unseal', params, 'post')
  }

  private async doRequest<T>(path: string, params: any, method: 'post' | 'get' = 'get'): Promise<JsonResponse<T>> {
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

export class RealFingerprintV4Api implements FingerprintV4Api {
  constructor(private request: APIRequestContext) {}

  private get baseURL() {
    return `${testData.config.apiUrl}/v4`
  }

  async updateEvent({ event_id, api_key, region, ...data }: UpdateEventParams): Promise<JsonResponse<void>> {
    return await jsonRequest<void>({
      request: this.request,
      url: `${this.baseURL}/events/${event_id}`,
      params: data,
      method: 'patch',
      headers: {
        Authorization: `Bearer ${api_key}`,
        'content-type': 'application/json',
      },
    })
  }

  async searchEvents({ api_key, region, ...params }: SearchEventsParams): Promise<JsonResponse<SearchEventsResponse>> {
    return await jsonRequest<SearchEventsResponse>({
      request: this.request,
      url: `${this.baseURL}/events`,
      params,
      headers: {
        Authorization: `Bearer ${api_key}`,
        'content-type': 'application/json',
      },
    })
  }

  async deleteVisitor({ api_key, region, ...params }: DeleteVisitorParams): Promise<JsonResponse<unknown>> {
    return await jsonRequest<void>({
      request: this.request,
      method: 'delete',
      url: `${this.baseURL}/visitors/${params.visitor_id}`,
      headers: {
        Authorization: `Bearer ${api_key}`,
        'content-type': 'application/json',
      },
    })
  }

  async getEvent(params: GetEventsParams) {
    return await jsonRequest({
      request: this.request,
      url: `${this.baseURL}/events/${params.event_id}`,
      headers: {
        Authorization: `Bearer ${params.api_key}`,
        'content-type': 'application/json',
      },
    })
  }
}
