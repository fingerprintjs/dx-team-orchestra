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
