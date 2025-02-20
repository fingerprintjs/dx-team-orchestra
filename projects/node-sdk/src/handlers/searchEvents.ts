import { Handler, MusicianResponse } from '../types'
import {
  FingerprintJsServerApiClient,
  SearchEventsFilter,
  SearchEventsResponse,
} from '@fingerprintjs/fingerprintjs-pro-server-api'
import { getRegion, unwrapError } from '../utils'

interface QueryParams {
  apiKey?: string
  region?: string
  limit: SearchEventsFilter['limit']
  visitorId?: SearchEventsFilter['visitor_id']
  bot?: SearchEventsFilter['bot']
  ipAddress?: SearchEventsFilter['ip_address']
  linkedId?: SearchEventsFilter['linked_id']
  start?: SearchEventsFilter['start']
  end?: SearchEventsFilter['end']
  reverse?: SearchEventsFilter['reverse']
  suspect?: SearchEventsFilter['suspect']
}

export const searchEvents: Handler<QueryParams> = async (req, res) => {
  const {
    apiKey = '',
    region = '',
    limit,
    visitorId,
    bot,
    ipAddress,
    linkedId,
    start,
    end,
    reverse,
    suspect,
  } = req.query

  const filter: SearchEventsFilter = {
    limit,
  }

  if (visitorId) {
    filter.visitor_id = visitorId
  }
  if (bot !== undefined) {
    filter.bot = bot
  }
  if (ipAddress) {
    filter.ip_address = ipAddress
  }
  if (linkedId) {
    filter.linked_id = linkedId
  }
  if (start) {
    filter.start = start
  }
  if (end) {
    filter.end = end
  }
  if (reverse !== undefined) {
    filter.reverse = reverse
  }
  if (suspect !== undefined) {
    filter.suspect = suspect
  }

  let result: MusicianResponse<SearchEventsResponse>
  try {
    const client = new FingerprintJsServerApiClient({
      apiKey: apiKey,
      region: getRegion(region),
    })

    const events = await client.searchEvents(filter)
    result = {
      code: 200,
      originalResponse: events,
      parsedResponse: events,
    }
  } catch (error) {
    result = await unwrapError<SearchEventsResponse>(error)
  }
  res.send(result)
}
