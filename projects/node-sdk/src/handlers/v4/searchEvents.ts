import { FingerprintServerApiClient, SearchEventsFilter, SearchEventsResponse } from '@fingerprint/node-sdk'

import { Handler, MusicianResponse } from '../../types'
import {
  createErrorResponse,
  getBooleanQueryValue,
  getNumberQueryValue,
  getStringArrayQueryValue,
  getStringQueryValue,
  getV4Region,
  unwrapV4Error,
} from '../../utils'

interface QueryParams {
  api_key?: string
  region?: string
  limit?: string
  pagination_key?: string
  visitor_id?: string
  bot?: string
  ip_address?: string
  linked_id?: string
  start?: string
  end?: string
  reverse?: string
  suspect?: string
  vpn?: string
  virtual_machine?: string
  tampering?: string
  anti_detect_browser?: string
  incognito?: string
  privacy_settings?: string
  jailbroken?: string
  frida?: string
  factory_reset?: string
  cloned_app?: string
  emulator?: string
  root_apps?: string
  vpn_confidence?: string
  min_suspect_score?: string
  ip_blocklist?: string
  datacenter?: string
  developer_tools?: string
  location_spoofing?: string
  mitm_attack?: string
  proxy?: string
  sdk_version?: string
  sdk_platform?: string
  environment?: string | string[]
  proximity_id?: string
  proximity_precision_radius?: string
}

const stringFields = [
  'pagination_key',
  'visitor_id',
  'bot',
  'ip_address',
  'linked_id',
  'vpn_confidence',
  'sdk_version',
  'sdk_platform',
  'proximity_id',
] as const

const numberFields = ['limit', 'start', 'end', 'min_suspect_score', 'proximity_precision_radius'] as const

const booleanFields = [
  'reverse',
  'suspect',
  'vpn',
  'virtual_machine',
  'tampering',
  'anti_detect_browser',
  'incognito',
  'privacy_settings',
  'jailbroken',
  'frida',
  'factory_reset',
  'cloned_app',
  'emulator',
  'root_apps',
  'ip_blocklist',
  'datacenter',
  'developer_tools',
  'location_spoofing',
  'mitm_attack',
  'proxy',
] as const

export const searchEvents: Handler<QueryParams> = async (req, res) => {
  const apiKey = getStringQueryValue(req.query.api_key) ?? ''
  const region = getStringQueryValue(req.query.region) ?? ''

  if (!apiKey) {
    res.send(createErrorResponse(403, 'secret_api_key_required', 'secret API key in header is missing or empty'))
    return
  }

  const filter: Record<string, unknown> = {}

  for (const field of stringFields) {
    const value = getStringQueryValue(req.query[field])
    if (value !== undefined) {
      filter[field] = value
    }
  }

  for (const field of numberFields) {
    const value = getNumberQueryValue(req.query[field])
    if (value !== undefined) {
      filter[field] = value
    }
  }

  for (const field of booleanFields) {
    const value = getBooleanQueryValue(req.query[field])
    if (value !== undefined) {
      filter[field] = value
    }
  }

  const environments = getStringArrayQueryValue(req.query.environment)
  if (environments !== undefined) {
    filter.environment = environments
  }

  let result: MusicianResponse<SearchEventsResponse>
  try {
    const client = new FingerprintServerApiClient({
      apiKey,
      region: getV4Region(region),
    })

    const response = await client.searchEvents(filter as SearchEventsFilter)
    result = {
      code: 200,
      originalResponse: response,
      parsedResponse: response,
    }
  } catch (error) {
    result = await unwrapV4Error<SearchEventsResponse>(error)
  }

  res.send(result)
}
