import { FingerprintServerApiClient, Event } from '@fingerprint/node-sdk'

import { Handler, MusicianResponse } from '../../types'
import { createErrorResponse, getStringQueryValue, getV4Region, unwrapV4Error } from '../../utils'

interface QueryParams {
  api_key?: string
  region?: string
  event_id?: string
  ruleset_id?: string
}

export const getEvent: Handler<QueryParams> = async (req, res) => {
  const apiKey = getStringQueryValue(req.query.api_key) ?? ''
  const region = getStringQueryValue(req.query.region) ?? ''
  const eventId = getStringQueryValue(req.query.event_id) ?? ''
  const rulesetId = getStringQueryValue(req.query.ruleset_id)

  if (!apiKey) {
    res.send(createErrorResponse(403, 'secret_api_key_required', 'secret API key in header is missing or empty'))
    return
  }

  let result: MusicianResponse<Event>
  try {
    const client = new FingerprintServerApiClient({
      apiKey,
      region: getV4Region(region),
    })

    const event = await client.getEvent(eventId, rulesetId ? { ruleset_id: rulesetId } : undefined)
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
