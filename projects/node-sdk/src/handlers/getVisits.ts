import { Handler, MusicianResponse } from '../types'
import {
  FingerprintJsServerApiClient,
  VisitorHistoryFilter,
  VisitorsResponse,
} from '@fingerprintjs/fingerprintjs-pro-server-api'
import { getRegion, unwrapError } from '../utils'

interface QueryParams {
  apiKey?: string
  region?: string
  visitorId?: string
  requestId: string
  linkedId?: string
  limit?: number
  paginationKey?: string
  before?: number
}

export const getVisits: Handler<QueryParams> = async (req, res) => {
  const { apiKey = '', region = '', visitorId = '', requestId, linkedId, limit, paginationKey, before } = req.query
  let result: MusicianResponse<VisitorsResponse>
  try {
    const client = new FingerprintJsServerApiClient({
      apiKey: apiKey,
      region: getRegion(region),
    })

    const filter: VisitorHistoryFilter = {}
    if (requestId != undefined) {
      filter.request_id = requestId
    }
    if (linkedId != undefined) {
      filter.linked_id = linkedId
    }
    if (limit != undefined) {
      filter.limit = limit
    }
    if (paginationKey != undefined) {
      filter.paginationKey = paginationKey
    }
    if (before != undefined) {
      filter.before = before
    }
    let visits: VisitorsResponse
    if (Object.keys(filter).length > 0) {
      visits = await client.getVisits(visitorId, filter)
    } else {
      visits = await client.getVisits(visitorId)
    }
    result = {
      code: 200,
      originalResponse: visits,
      parsedResponse: visits,
    }
  } catch (error) {
    result = await unwrapError<VisitorsResponse>(error)
  }
  res.send(result)
}
