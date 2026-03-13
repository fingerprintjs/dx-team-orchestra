import { Handler, MusicianResponse } from '../../types'
import { EventsGetResponse, FingerprintJsServerApiClient } from '@fingerprintjs/fingerprintjs-pro-server-api'
import { getV3Region, unwrapV3Error } from '../../utils'

interface QueryParams {
  apiKey?: string
  region?: string
  requestId?: string
}

export const getEvents: Handler<QueryParams> = async (req, res) => {
  const { apiKey = '', region = '', requestId = '' } = req.query
  let result: MusicianResponse<EventsGetResponse>
  try {
    const client = new FingerprintJsServerApiClient({
      apiKey,
      region: getV3Region(region),
    })

    const event = await client.getEvent(requestId)
    result = {
      code: 200,
      originalResponse: event,
      parsedResponse: event,
    }
  } catch (error) {
    result = await unwrapV3Error<EventsGetResponse>(error)
  }
  res.send(result)
}
