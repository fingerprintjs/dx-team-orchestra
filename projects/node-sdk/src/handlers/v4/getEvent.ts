import { FingerprintServerApiClient, Event } from '@fingerprint/node-sdk'

import { Handler, MusicianResponse } from '../../types'
import { createErrorResponse, getV4Region, unwrapV4Error } from '../../utils'

interface QueryParams {
  api_key?: string
  region?: string
  event_id?: string
  ruleset_id?: string
}

export const getEvent: Handler<QueryParams> = async (req, res) => {
  const { api_key = '', region = '', event_id = '', ruleset_id } = req.query

  if (!api_key) {
    res.send(createErrorResponse(403, 'secret_api_key_required', 'secret API key in header is missing or empty'))
    return
  }

  let result: MusicianResponse<Event>
  try {
    const client = new FingerprintServerApiClient({
      apiKey: api_key,
      region: getV4Region(region),
    })

    const event = await client.getEvent(event_id, ruleset_id ? { ruleset_id } : undefined)
    result = {
      code: 200,
      originalResponse: event,
      parsedResponse: event,
    }
  } catch (error) {
    result = await unwrapV4Error<Event>(error)
  }
  res.send(result)
}
