import { Handler, MusicianResponse } from '../../types'
import { FingerprintJsServerApiClient, RelatedVisitorsResponse } from '@fingerprintjs/fingerprintjs-pro-server-api'
import { getV3Region, unwrapV3Error } from '../../utils'

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
      apiKey,
      region: getV3Region(region),
    })

    const event = await client.getRelatedVisitors({ visitor_id: visitorId })
    result = {
      code: 200,
      originalResponse: event,
      parsedResponse: event,
    }
  } catch (error) {
    result = await unwrapV3Error<RelatedVisitorsResponse>(error)
  }
  res.send(result)
}
