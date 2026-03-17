import { FingerprintServerApiClient } from '@fingerprint/node-sdk'

import { Handler, MusicianResponse } from '../../types'
import { getV4Region, unwrapV4Error } from '../../utils'

interface QueryParams {
  api_key?: string
  region?: string
  visitor_id?: string
}

export const deleteVisitorData: Handler<QueryParams> = async (req, res) => {
  const { api_key = '', region = '', visitor_id = '' } = req.query

  let result: MusicianResponse<void>
  try {
    const client = new FingerprintServerApiClient({
      apiKey: api_key,
      region: getV4Region(region),
    })

    const response = await client.deleteVisitorData(visitor_id)
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
