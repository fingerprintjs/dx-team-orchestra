import { EventUpdate, FingerprintServerApiClient } from '@fingerprint/node-sdk'

import { Handler, MusicianResponse } from '../../types'
import { InvalidRequestError, createErrorResponse, getV4Region, parseBoolean, unwrapV4Error } from '../../utils'

interface QueryParams {
  api_key?: string
  region?: string
  event_id?: string
  linked_id?: string
  tags?: string
  suspect?: string
}

export const updateEvent: Handler<QueryParams> = async (req, res) => {
  const { api_key = '', region = '', event_id = '', linked_id, tags, suspect } = req.query

  if (!api_key) {
    res.send(createErrorResponse(403, 'secret_api_key_required', 'secret API key in header is missing or empty'))
    return
  }

  let result: MusicianResponse<void>
  try {
    const eventUpdate: EventUpdate = {}
    if (linked_id != undefined) {
      eventUpdate.linked_id = linked_id
    }

    if (tags != undefined) {
      try {
        eventUpdate.tags = JSON.parse(tags)
      } catch {
        throw new InvalidRequestError('invalid tags')
      }
    }

    if (suspect != undefined) {
      try {
        eventUpdate.suspect = parseBoolean(suspect)
      } catch {
        throw new InvalidRequestError('invalid suspect')
      }
    }

    const client = new FingerprintServerApiClient({
      apiKey: api_key,
      region: getV4Region(region),
    })

    const response = await client.updateEvent(event_id, eventUpdate)
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
