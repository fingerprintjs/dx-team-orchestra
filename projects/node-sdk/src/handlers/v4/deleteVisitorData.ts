import { FingerprintServerApiClient } from '@fingerprint/node-sdk'

import { Handler, MusicianResponse } from '../../types'
import { createErrorResponse, getStringQueryValue, getV4Region, unwrapV4Error } from '../../utils'

interface QueryParams {
  api_key?: string
  region?: string
  visitor_id?: string
}

export const deleteVisitorData: Handler<QueryParams> = async (req, res) => {
  const apiKey = getStringQueryValue(req.query.api_key) ?? ''
  const region = getStringQueryValue(req.query.region) ?? ''
  const visitorId = getStringQueryValue(req.query.visitor_id) ?? ''

  if (!apiKey) {
    res.send(createErrorResponse(403, 'secret_api_key_required', 'secret API key in header is missing or empty'))
    return
  }

  if (!visitorId) {
    res.send(createErrorResponse(400, 'request_cannot_be_parsed', 'visitor id is required'))
    return
  }

  let result: MusicianResponse<void>
  try {
    const client = new FingerprintServerApiClient({
      apiKey,
      region: getV4Region(region),
    })

    const response = await client.deleteVisitorData(visitorId)
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
