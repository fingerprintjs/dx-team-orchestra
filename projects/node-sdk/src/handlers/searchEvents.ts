import { Handler, MusicianResponse } from '../types'
import {
  FingerprintJsServerApiClient,
  SearchEventsFilter,
  SearchEventsResponse,
} from '@fingerprintjs/fingerprintjs-pro-server-api'
import { getRegion, unwrapError } from '../utils'

interface QueryParams {
  apiKey?: string
  region?: string
  limit: SearchEventsFilter['limit']
  paginationKey?: SearchEventsFilter['pagination_key']
  visitorId?: SearchEventsFilter['visitor_id']
  bot?: SearchEventsFilter['bot']
  ipAddress?: SearchEventsFilter['ip_address']
  linkedId?: SearchEventsFilter['linked_id']
  start?: SearchEventsFilter['start']
  end?: SearchEventsFilter['end']
  reverse?: SearchEventsFilter['reverse']
  suspect?: SearchEventsFilter['suspect']
  vpn?: SearchEventsFilter['vpn']
  virtualMachine?: SearchEventsFilter['virtual_machine']
  tampering?: SearchEventsFilter['tampering']
  antiDetectBrowser?: SearchEventsFilter['anti_detect_browser']
  incognito?: SearchEventsFilter['incognito']
  privacySettings?: SearchEventsFilter['privacy_settings']
  jailbroken?: SearchEventsFilter['jailbroken']
  frida?: SearchEventsFilter['frida']
  factoryReset?: SearchEventsFilter['factory_reset']
  clonedApp?: SearchEventsFilter['cloned_app']
  emulator?: SearchEventsFilter['emulator']
  rootApps?: SearchEventsFilter['root_apps']
  minSuspectScore?: SearchEventsFilter['min_suspect_score']
  ipBlocklist?: SearchEventsFilter['ip_blocklist']
  datacenter?: SearchEventsFilter['datacenter']
  developerTools?: SearchEventsFilter['developer_tools']
  locationSpoofing?: SearchEventsFilter['location_spoofing']
  mitmAttack?: SearchEventsFilter['mitm_attack']
  proxy?: SearchEventsFilter['proxy']
  sdkVersion?: SearchEventsFilter['sdk_version']
  sdkPlatform?: SearchEventsFilter['sdk_platform']
  environment?: SearchEventsFilter['environment']
  proximityId?: SearchEventsFilter['proximity_id']
  proximityPrecisionRadius?: SearchEventsFilter['proximity_precision_radius']
}

export const searchEvents: Handler<QueryParams> = async (req, res) => {
  const {
    apiKey = '',
    region = '',
    limit,
    paginationKey,
    visitorId,
    bot,
    ipAddress,
    linkedId,
    start,
    end,
    reverse,
    suspect,
    vpn,
    virtualMachine,
    tampering,
    antiDetectBrowser,
    incognito,
    privacySettings,
    jailbroken,
    frida,
    factoryReset,
    clonedApp,
    emulator,
    rootApps,
    minSuspectScore,
    ipBlocklist,
    datacenter,
    developerTools,
    locationSpoofing,
    mitmAttack,
    proxy,
    sdkVersion,
    sdkPlatform,
    environment,
    proximityId,
    proximityPrecisionRadius,
  } = req.query

  const filter: SearchEventsFilter = {
    limit,
  }

  if (paginationKey) {
    filter.pagination_key = paginationKey
  }

  if (visitorId) {
    filter.visitor_id = visitorId
  }
  if (bot !== undefined) {
    filter.bot = bot
  }
  if (ipAddress) {
    filter.ip_address = ipAddress
  }
  if (linkedId) {
    filter.linked_id = linkedId
  }
  if (start) {
    filter.start = start
  }
  if (end) {
    filter.end = end
  }
  if (reverse !== undefined) {
    filter.reverse = reverse
  }
  if (suspect !== undefined) {
    filter.suspect = suspect
  }
  if (vpn !== undefined) {
    filter.vpn = vpn
  }
  if (virtualMachine !== undefined) {
    filter.virtual_machine = virtualMachine
  }
  if (tampering !== undefined) {
    filter.tampering = tampering
  }
  if (antiDetectBrowser !== undefined) {
    filter.anti_detect_browser = antiDetectBrowser
  }
  if (incognito !== undefined) {
    filter.incognito = incognito
  }
  if (privacySettings !== undefined) {
    filter.privacy_settings = privacySettings
  }
  if (jailbroken !== undefined) {
    filter.jailbroken = jailbroken
  }
  if (frida !== undefined) {
    filter.frida = frida
  }
  if (factoryReset !== undefined) {
    filter.factory_reset = factoryReset
  }
  if (clonedApp !== undefined) {
    filter.cloned_app = clonedApp
  }
  if (emulator !== undefined) {
    filter.emulator = emulator
  }
  if (rootApps !== undefined) {
    filter.root_apps = rootApps
  }
  if (minSuspectScore) {
    filter.min_suspect_score = minSuspectScore
  }
  if (ipBlocklist !== undefined) {
    filter.ip_blocklist = ipBlocklist
  }
  if (datacenter !== undefined) {
    filter.datacenter = datacenter
  }
  if (developerTools !== undefined) {
    filter.developer_tools = developerTools
  }
  if (locationSpoofing !== undefined) {
    filter.location_spoofing = locationSpoofing
  }
  if (mitmAttack !== undefined) {
    filter.mitm_attack = mitmAttack
  }
  if (proxy !== undefined) {
    filter.proxy = proxy
  }
  if (sdkVersion !== undefined) {
    filter.sdk_version = sdkVersion
  }
  if (sdkPlatform !== undefined) {
    filter.sdk_platform = sdkPlatform
  }
  if (environment !== undefined) {
    filter.environment = environment
  }
  if (proximityId !== undefined) {
    filter.proximity_id = proximityId
  }
  if (proximityPrecisionRadius !== undefined) {
    filter.proximity_precision_radius = proximityPrecisionRadius
  }

  let result: MusicianResponse<SearchEventsResponse>
  try {
    const client = new FingerprintJsServerApiClient({
      apiKey: apiKey,
      region: getRegion(region),
    })

    const events = await client.searchEvents(filter)
    result = {
      code: 200,
      originalResponse: events,
      parsedResponse: events,
    }
  } catch (error) {
    result = await unwrapError<SearchEventsResponse>(error)
  }
  res.send(result)
}
