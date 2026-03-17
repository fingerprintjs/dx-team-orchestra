import { EventUpdate, FingerprintServerApiClient } from '@fingerprint/node-sdk'

import { Handler, MusicianResponse } from '../../types'
import { getV4Region, parseBoolean, unwrapV4Error } from '../../utils'

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

  let result: MusicianResponse<void>
  try {
    const client = new FingerprintServerApiClient({
      apiKey: api_key,
      region: getV4Region(region),
    })

    const eventUpdateBody: EventUpdate = {}
    if (linked_id != undefined) {
      eventUpdateBody.linked_id = linked_id
    }
    if (tags != undefined) {
      eventUpdateBody.tags = JSON.parse(tags)
    }
    if (suspect != undefined) {
      eventUpdateBody.suspect = parseBoolean(suspect)
    }

    const response = await client.updateEvent(event_id, eventUpdateBody)
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
