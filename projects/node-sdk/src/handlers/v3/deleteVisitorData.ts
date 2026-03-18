import { Handler, MusicianResponse } from '../../types'
import { FingerprintJsServerApiClient } from '@fingerprintjs/fingerprintjs-pro-server-api'
import { getV3Region, unwrapV3Error } from '../../utils'

interface QueryParams {
  apiKey?: string
  region?: string
  visitorId?: string
}

export const deleteVisitorData: Handler<QueryParams> = async (req, res) => {
  const { apiKey = '', region = '', visitorId = '' } = req.query
  let result: MusicianResponse<void>
  try {
    const client = new FingerprintJsServerApiClient({
      apiKey,
      region: getV3Region(region),
    })

    const event = await client.deleteVisitorData(visitorId)
    result = {
      code: 200,
      originalResponse: event,
      parsedResponse: event,
    }
  } catch (error) {
    result = await unwrapV3Error<void>(error, 'deleteVisitorData')
  }
  res.send(result)
}
