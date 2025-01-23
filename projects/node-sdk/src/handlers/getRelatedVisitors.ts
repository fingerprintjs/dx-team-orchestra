import { Handler, MusicianResponse } from '../types'
import { FingerprintJsServerApiClient, RelatedVisitorsResponse } from '@fingerprintjs/fingerprintjs-pro-server-api'
import { getRegion, unwrapError } from '../utils'

interface QueryParams {
  apiKey?: string
  region?: string
  visitorId?: string
}

export const getRelatedVisitors: Handler<QueryParams> = async (req, res) => {
  const { apiKey = '', region = '', visitorId = '' } = req.query
  let result: MusicianResponse<RelatedVisitorsResponse>
  try {
    const client = new FingerprintJsServerApiClient({
      apiKey: apiKey,
      region: getRegion(region),
    })

    const event = await client.getRelatedVisitors({ visitor_id: visitorId })
    result = {
      code: 200,
      originalResponse: event,
      parsedResponse: event,
    }
  } catch (error) {
    result = await unwrapError<RelatedVisitorsResponse>(error)
  }
  res.send(result)
}
