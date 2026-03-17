import { FingerprintServerApiClient, SearchEventsFilter, SearchEventsResponse } from '@fingerprint/node-sdk'

import { Handler, MusicianResponse } from '../../types'
import { getV4Region, parseBooleanFromString, parseNumberFromString, unwrapV4Error } from '../../utils'

type V4SearchEventsFilter = NonNullable<SearchEventsFilter>
type QueryParams = { [K in keyof V4SearchEventsFilter]?: string } & {
  api_key?: string
  region?: string
  // Only environment can be multiple values
  environment?: string | string[]
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
    tor_node,
    url,
  } = req.query

  let result: MusicianResponse<SearchEventsResponse>
  try {
    const filter: V4SearchEventsFilter = {}
    if (limit !== undefined) {
      filter.limit = parseNumberFromString(limit, 'limit')
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
      filter.start = parseNumberFromString(start, 'start')
    }
    if (end !== undefined) {
      filter.end = parseNumberFromString(end, 'end')
    }
    if (reverse !== undefined) {
      filter.reverse = parseBooleanFromString(reverse, 'reverse')
    }
    if (suspect !== undefined) {
      filter.suspect = parseBooleanFromString(suspect, 'suspect')
    }
    if (vpn !== undefined) {
      filter.vpn = parseBooleanFromString(vpn, 'vpn')
    }
    if (virtual_machine !== undefined) {
      filter.virtual_machine = parseBooleanFromString(virtual_machine, 'virtual_machine')
    }
    if (tampering !== undefined) {
      filter.tampering = parseBooleanFromString(tampering, 'tampering')
    }
    if (anti_detect_browser !== undefined) {
      filter.anti_detect_browser = parseBooleanFromString(anti_detect_browser, 'anti_detect_browser')
    }
    if (incognito !== undefined) {
      filter.incognito = parseBooleanFromString(incognito, 'incognito')
    }
    if (privacy_settings !== undefined) {
      filter.privacy_settings = parseBooleanFromString(privacy_settings, 'privacy_settings')
    }
    if (jailbroken !== undefined) {
      filter.jailbroken = parseBooleanFromString(jailbroken, 'jailbroken')
    }
    if (frida !== undefined) {
      filter.frida = parseBooleanFromString(frida, 'frida')
    }
    if (factory_reset !== undefined) {
      filter.factory_reset = parseBooleanFromString(factory_reset, 'factory_reset')
    }
    if (cloned_app !== undefined) {
      filter.cloned_app = parseBooleanFromString(cloned_app, 'cloned_app')
    }
    if (emulator !== undefined) {
      filter.emulator = parseBooleanFromString(emulator, 'emulator')
    }
    if (root_apps !== undefined) {
      filter.root_apps = parseBooleanFromString(root_apps, 'root_apps')
    }
    if (vpn_confidence !== undefined) {
      filter.vpn_confidence = vpn_confidence as NonNullable<V4SearchEventsFilter['vpn_confidence']>
    }
    if (min_suspect_score !== undefined) {
      filter.min_suspect_score = parseNumberFromString(min_suspect_score, 'min_suspect_score')
    }
    if (developer_tools !== undefined) {
      filter.developer_tools = parseBooleanFromString(developer_tools, 'developer_tools')
    }
    if (location_spoofing !== undefined) {
      filter.location_spoofing = parseBooleanFromString(location_spoofing, 'location_spoofing')
    }
    if (mitm_attack !== undefined) {
      filter.mitm_attack = parseBooleanFromString(mitm_attack, 'mitm_attack')
    }
    if (proxy !== undefined) {
      filter.proxy = parseBooleanFromString(proxy, 'proxy')
    }
    if (sdk_version !== undefined) {
      filter.sdk_version = sdk_version
    }
    if (sdk_platform !== undefined) {
      filter.sdk_platform = sdk_platform as NonNullable<V4SearchEventsFilter['sdk_platform']>
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
    if (tor_node !== undefined) {
      filter.tor_node = parseBooleanFromString(tor_node, 'tor_node')
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
