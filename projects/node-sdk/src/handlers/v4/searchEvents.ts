import { FingerprintServerApiClient, SearchEventsFilter, SearchEventsResponse } from '@fingerprint/node-sdk'

import { Handler, MusicianResponse } from '../../types'
import { InvalidRequestError, createErrorResponse, getV4Region, parseBoolean, unwrapV4Error } from '../../utils'

type V4SearchEventsFilter = NonNullable<SearchEventsFilter>
interface QueryParams {
  api_key?: string
  region?: string
  asn?: string
  bundle_id?: string
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
  origin?: string
  package_name?: string
  proximity_id?: string
  proximity_precision_radius?: string
  tor_node?: string
  url?: string
}

function parseNumberQuery(value: string, fieldName: string): number {
  if (value === '') {
    throw new InvalidRequestError(`${fieldName} is not a valid number`)
  }

  const parsedValue = Number(value)
  if (!Number.isFinite(parsedValue)) {
    throw new InvalidRequestError(`${fieldName} is not a valid number`)
  }

  return parsedValue
}

function parseBooleanQuery(value: string, fieldName: string): boolean {
  if (value === '') {
    throw new InvalidRequestError(`${fieldName} is not a valid boolean`)
  }

  try {
    return parseBoolean(value)
  } catch {
    throw new InvalidRequestError(`${fieldName} is not a valid boolean`)
  }
}

export const searchEvents: Handler<QueryParams> = async (req, res) => {
  const {
    api_key = '',
    region = '',
    asn,
    bundle_id,
    limit,
    pagination_key,
    visitor_id,
    bot,
    ip_address,
    linked_id,
    start,
    end,
    reverse,
    suspect,
    vpn,
    virtual_machine,
    tampering,
    anti_detect_browser,
    incognito,
    privacy_settings,
    jailbroken,
    frida,
    factory_reset,
    cloned_app,
    emulator,
    root_apps,
    vpn_confidence,
    min_suspect_score,
    ip_blocklist,
    datacenter,
    developer_tools,
    location_spoofing,
    mitm_attack,
    proxy,
    sdk_version,
    sdk_platform,
    environment,
    origin,
    package_name,
    proximity_id,
    proximity_precision_radius,
    tor_node,
    url,
  } = req.query

  if (!api_key) {
    res.send(createErrorResponse(403, 'secret_api_key_required', 'secret API key in header is missing or empty'))
    return
  }

  let result: MusicianResponse<SearchEventsResponse>
  try {
    const filter: V4SearchEventsFilter = {}
    if (limit !== undefined) {
      filter.limit = parseNumberQuery(limit, 'limit')
    }
    if (asn !== undefined) {
      filter.asn = asn
    }
    if (bundle_id !== undefined) {
      filter.bundle_id = bundle_id
    }
    if (pagination_key !== undefined) {
      filter.pagination_key = pagination_key
    }
    if (visitor_id !== undefined) {
      filter.visitor_id = visitor_id
    }
    if (bot !== undefined) {
      filter.bot = bot as NonNullable<V4SearchEventsFilter['bot']>
    }
    if (ip_address !== undefined) {
      filter.ip_address = ip_address
    }
    if (linked_id !== undefined) {
      filter.linked_id = linked_id
    }
    if (start !== undefined) {
      filter.start = parseNumberQuery(start, 'start')
    }
    if (end !== undefined) {
      filter.end = parseNumberQuery(end, 'end')
    }
    if (reverse !== undefined) {
      filter.reverse = parseBooleanQuery(reverse, 'reverse')
    }
    if (suspect !== undefined) {
      filter.suspect = parseBooleanQuery(suspect, 'suspect')
    }
    if (vpn !== undefined) {
      filter.vpn = parseBooleanQuery(vpn, 'vpn')
    }
    if (virtual_machine !== undefined) {
      filter.virtual_machine = parseBooleanQuery(virtual_machine, 'virtual_machine')
    }
    if (tampering !== undefined) {
      filter.tampering = parseBooleanQuery(tampering, 'tampering')
    }
    if (anti_detect_browser !== undefined) {
      filter.anti_detect_browser = parseBooleanQuery(anti_detect_browser, 'anti_detect_browser')
    }
    if (incognito !== undefined) {
      filter.incognito = parseBooleanQuery(incognito, 'incognito')
    }
    if (privacy_settings !== undefined) {
      filter.privacy_settings = parseBooleanQuery(privacy_settings, 'privacy_settings')
    }
    if (jailbroken !== undefined) {
      filter.jailbroken = parseBooleanQuery(jailbroken, 'jailbroken')
    }
    if (frida !== undefined) {
      filter.frida = parseBooleanQuery(frida, 'frida')
    }
    if (factory_reset !== undefined) {
      filter.factory_reset = parseBooleanQuery(factory_reset, 'factory_reset')
    }
    if (cloned_app !== undefined) {
      filter.cloned_app = parseBooleanQuery(cloned_app, 'cloned_app')
    }
    if (emulator !== undefined) {
      filter.emulator = parseBooleanQuery(emulator, 'emulator')
    }
    if (root_apps !== undefined) {
      filter.root_apps = parseBooleanQuery(root_apps, 'root_apps')
    }
    if (vpn_confidence !== undefined) {
      filter.vpn_confidence = vpn_confidence as NonNullable<V4SearchEventsFilter['vpn_confidence']>
    }
    if (min_suspect_score !== undefined) {
      filter.min_suspect_score = parseNumberQuery(min_suspect_score, 'min_suspect_score')
    }
    if (ip_blocklist !== undefined) {
      filter.ip_blocklist = ip_blocklist as NonNullable<V4SearchEventsFilter['ip_blocklist']>
    }
    if (datacenter !== undefined) {
      filter.datacenter = datacenter as NonNullable<V4SearchEventsFilter['datacenter']>
    }
    if (developer_tools !== undefined) {
      filter.developer_tools = parseBooleanQuery(developer_tools, 'developer_tools')
    }
    if (location_spoofing !== undefined) {
      filter.location_spoofing = parseBooleanQuery(location_spoofing, 'location_spoofing')
    }
    if (mitm_attack !== undefined) {
      filter.mitm_attack = parseBooleanQuery(mitm_attack, 'mitm_attack')
    }
    if (proxy !== undefined) {
      filter.proxy = parseBooleanQuery(proxy, 'proxy')
    }
    if (sdk_version !== undefined) {
      filter.sdk_version = sdk_version
    }
    if (sdk_platform !== undefined) {
      filter.sdk_platform = sdk_platform
    }
    if (environment !== undefined) {
      filter.environment = Array.isArray(environment) ? environment : [environment]
    }
    if (origin !== undefined) {
      filter.origin = origin
    }
    if (package_name !== undefined) {
      filter.package_name = package_name
    }
    if (proximity_id !== undefined) {
      filter.proximity_id = proximity_id
    }
    if (proximity_precision_radius !== undefined) {
      filter.proximity_precision_radius = parseNumberQuery(proximity_precision_radius, 'proximity_precision_radius')
    }
    if (tor_node !== undefined) {
      filter.tor_node = parseBooleanQuery(tor_node, 'tor_node')
    }
    if (url !== undefined) {
      filter.url = url
    }

    const client = new FingerprintServerApiClient({
      apiKey: api_key,
      region: getV4Region(region),
    })

    const response = await client.searchEvents(filter)
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
