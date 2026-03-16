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
  throw new InvalidRequestError('invalid boolean value')
}

type QueryValue = unknown

function normalizeQueryValue(value: QueryValue): string | undefined {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    const firstValue = value.find((item) => typeof item === 'string')
    return typeof firstValue === 'string' ? firstValue : undefined
  }

  return undefined
}

export function getStringQueryValue(value: QueryValue): string | undefined {
  return normalizeQueryValue(value)
}

export function getStringArrayQueryValue(value: QueryValue): string[] | undefined {
  if (typeof value === 'string') {
    return [value]
  }

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  return undefined
}

export function getBooleanQueryValue(value: QueryValue, fieldName = 'boolean'): boolean | undefined {
  const normalizedValue = normalizeQueryValue(value)
  if (normalizedValue === undefined) {
    return undefined
  }

  try {
    return parseBoolean(normalizedValue)
  } catch (error) {
    if (error instanceof InvalidRequestError) {
      throw new InvalidRequestError(`invalid ${fieldName}`)
    }

    throw error
  }
}

export function getNumberQueryValue(value: QueryValue, fieldName = 'number'): number | undefined {
  const normalizedValue = normalizeQueryValue(value)

  if (normalizedValue === undefined || normalizedValue === '') {
    return undefined
  }

  const parsedValue = Number(normalizedValue)
  if (!Number.isFinite(parsedValue)) {
    throw new InvalidRequestError(`invalid ${fieldName}`)
  }

  return parsedValue
}

export function parseJsonValue<T>(value: string, fieldName: string): T {
  try {
    return JSON.parse(value) as T
  } catch {
    throw new InvalidRequestError(`invalid ${fieldName}`)
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
