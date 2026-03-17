import { Region as V4Region, RequestError as V4RequestError } from '@fingerprint/node-sdk'
import { Region as V3Region, RequestError as V3RequestError } from '@fingerprintjs/fingerprintjs-pro-server-api'

import { MusicianResponse } from './types'

export class InvalidRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidRequestError'
  }
}

function getRegionCode(region: string): 'EU' | 'AP' | 'Global' {
  switch (region) {
    case 'eu':
      return 'EU'
    case 'ap':
      return 'AP'
    default:
      return 'Global'
  }
}

export function getV3Region(region: string): V3Region {
  return V3Region[getRegionCode(region)]
}

export function getV4Region(region: string): V4Region {
  return V4Region[getRegionCode(region)]
}

type V3Method = 'updateEvent' | 'deleteVisitorData'

export async function unwrapV3Error<Response200Type>(
  error: unknown,
  method?: V3Method
): Promise<MusicianResponse<Response200Type>> {
  if (error instanceof V3RequestError) {
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
    if (method && ['updateEvent', 'deleteVisitorData'].includes(method)) {
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

    if (error.message === 'Api key is not set') {
      return {
        code: 403,
        originalResponse: error.toString(),
        parsedResponse: JSON.stringify(error),
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

export async function unwrapV4Error<Response200Type>(error: unknown): Promise<MusicianResponse<Response200Type>> {
  if (error instanceof InvalidRequestError) {
    return createErrorResponse(400, 'request_cannot_be_parsed', error.message)
  }

  if (error instanceof V4RequestError) {
    const originalResponse = await error.response.text()
    return {
      code: error.statusCode,
      originalResponse,
      parsedResponse: error.responseBody,
    }
  }

  return {
    code: 500,
    originalResponse: error instanceof Error ? error.toString() : String(error),
    parsedResponse: JSON.stringify(error),
  }
}

export function createErrorResponse(code: number, errorCode: string, message: string): MusicianResponse<never> {
  return {
    code,
    originalResponse: message,
    parsedResponse: {
      error: {
        code: errorCode,
        message,
      },
    },
  }
}

export function parseBoolean(value: string) {
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  throw new InvalidRequestError('invalid boolean value')
}

export function parseNumberFromString(value: string, fieldName: string): number {
  if (value === '') {
    throw new InvalidRequestError(`${fieldName} is not a valid number`)
  }

  const parsedValue = Number(value)
  if (!Number.isFinite(parsedValue)) {
    throw new InvalidRequestError(`${fieldName} is not a valid number`)
  }

  return parsedValue
}

export function parseJsonFromString(value: string, fieldName: string): Record<string, unknown> {
  try {
    return JSON.parse(value)
  } catch {
    throw new InvalidRequestError(`${fieldName} is not a valid JSON`)
  }
}

export function parseBooleanFromString(value: string, fieldName: string): boolean {
  if (value === '') {
    throw new InvalidRequestError(`${fieldName} is not a valid boolean`)
  }

  try {
    return parseBoolean(value)
  } catch {
    throw new InvalidRequestError(`${fieldName} is not a valid boolean`)
  }
}
