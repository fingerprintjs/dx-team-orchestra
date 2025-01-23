import { Region, RequestError } from '@fingerprintjs/fingerprintjs-pro-server-api'
import { MusicianResponse } from './types'

export function getRegion(region: string): Region {
  switch (region) {
    case 'eu':
      return Region.EU
    case 'ap':
      return Region.AP
    default:
      return Region.Global
  }
}

type Method = 'updateEvent' | 'deleteVisitorData'

export async function unwrapError<Response200Type>(
  error: unknown,
  method?: Method
): Promise<MusicianResponse<Response200Type>> {
  console.log(unwrapError, error)
  if (error instanceof RequestError) {
    const originalResponse = await error.response.text()
    return {
      code: error.statusCode,
      originalResponse: originalResponse,
      parsedResponse: error.responseBody,
    }
  }
  // Make behaviour consistent with other Server SDKs
  if (error instanceof Error && error.message == `Api key is not set`) {
    console.log(error.message, error.toString(), JSON.stringify(error))
    if (['updateEvent', 'deleteVisitorData'].includes(method!)) {
      return {
        code: 403,
        originalResponse: error.toString(),
        parsedResponse: {
          // @ts-ignore
          error: {
            code: 'TokenRequired',
            message: 'secret key is required',
          },
        },
      }
    }
    return {
      code: 404,
      originalResponse: error.toString(),
      parsedResponse: JSON.stringify(error),
    }
  }
  if (method === 'deleteVisitorData' && error instanceof Error && error.message == 'VisitorId is not set') {
    return {
      code: 400,
      originalResponse: error?.toString(),
      parsedResponse: {
        // @ts-ignore
        error: {
          code: 'RequestCannotBeParsed',
          message: 'visitor id is required',
        },
      },
    }
  }
  return {
    code: 500,
    originalResponse: error?.toString(),
    parsedResponse: JSON.stringify(error),
  }
}

export function parseBoolean(value: string) {
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  throw new Error(`Invalid boolean value: ${value}`)
}
