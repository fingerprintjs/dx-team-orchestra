import { EventUpdate, FingerprintServerApiClient } from '@fingerprint/node-sdk'

import { Handler, MusicianResponse } from '../../types'
import {
  createErrorResponse,
  getBooleanQueryValue,
  getStringQueryValue,
  getV4Region,
  parseJsonValue,
  unwrapV4Error,
} from '../../utils'

interface QueryParams {
  api_key?: string
  region?: string
  event_id?: string
  linked_id?: string
  tags?: string
  suspect?: string
}

export const updateEvent: Handler<QueryParams> = async (req, res) => {
  const apiKey = getStringQueryValue(req.query.api_key) ?? ''
  const region = getStringQueryValue(req.query.region) ?? ''
  const eventId = getStringQueryValue(req.query.event_id) ?? ''

  if (!apiKey) {
    res.send(createErrorResponse(403, 'secret_api_key_required', 'secret API key in header is missing or empty'))
    return
  }

  let result: MusicianResponse<void>
  try {
    const eventUpdate: EventUpdate = {}
    const linkedId = getStringQueryValue(req.query.linked_id)
    const tags = getStringQueryValue(req.query.tags)
    const suspect = getBooleanQueryValue(req.query.suspect, 'suspect')

    if (linkedId !== undefined) {
      eventUpdate.linked_id = linkedId
    }

    if (tags !== undefined) {
      eventUpdate.tags = parseJsonValue(tags, 'tags')
    }

    if (suspect !== undefined) {
      eventUpdate.suspect = suspect
    }

    const client = new FingerprintServerApiClient({
      apiKey,
      region: getV4Region(region),
    })

    const response = await client.updateEvent(eventId, eventUpdate)
    result = {
      code: 200,
      originalResponse: response,
      parsedResponse: response,
    }
  } catch (error) {
    result = await unwrapV4Error<void>(error)
  }

  res.send(result)
}
