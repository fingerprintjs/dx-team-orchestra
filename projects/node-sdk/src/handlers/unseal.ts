import { Handler, MusicianResponse } from '../types'
import {
  EventsGetResponse,
  unsealEventsResponse,
  DecryptionKey,
  DecryptionAlgorithm,
} from '@fingerprintjs/fingerprintjs-pro-server-api'
import { unwrapError } from '../utils'

interface RequestBody {
  sealedData: string
  keys: { key: string; algorithm: string }[]
}

export const unseal: Handler<{}, RequestBody> = async (req, res) => {
  const { sealedData, keys } = req.body

  const sealedDataBuffer = Buffer.from(sealedData, 'base64')
  const unsealKeys: DecryptionKey[] = keys.map(({ key, algorithm }) => ({
    key: Buffer.from(key, 'base64'),
    algorithm: algorithm as DecryptionAlgorithm,
  }))

  let result: MusicianResponse<EventsGetResponse>
  try {
    const event = await unsealEventsResponse(sealedDataBuffer, unsealKeys)
    result = {
      code: 200,
      originalResponse: event,
      parsedResponse: event,
    }
  } catch (error) {
    result = await unwrapError<EventsGetResponse>(error)
  }
  res.send(result)
}
