import { test } from '../../utils/v4/playwright'
import testData from '../../utils/testData'
import { expect } from '@playwright/test'
import { delay } from '../../utils/delay'
import { SearchEventsFilter } from '@fingerprint/node-sdk'

test.describe('SearchEvents suite', () => {
  test('with valid api key and limit', async ({ assert, identify }) => {
    const linkedId = `test_${Date.now()}`

    const { visitor_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
      linkedId,
    })

    // Wait for event to propagate
    await delay(5000)

    await assert.thatResponsesMatch('searchEvents', {
      visitor_id,
      linked_id: linkedId,
      start: new Date().getTime() - 10_000,
      end: new Date().getTime() + 10_000,
      limit: 10,
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })
  })

  test('with multiple environments', async ({ identify, sdkApi }) => {
    const linkedId = `test_multi_env_${Date.now()}`

    await identify({
      auth: testData.credentials.maxFeaturesUS,
      linkedId,
    })

    await identify({
      auth: testData.credentials.sealedMaximumFeaturesUs,
      linkedId,
    })

    // Wait for event to propagate
    await delay(5000)

    const result = await sdkApi.searchEvents({
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      limit: 10,
      linked_id: linkedId,
    })

    const environmentIds = result.data?.events?.map((event) => event.environment_id)?.filter(Boolean) ?? []

    expect(environmentIds).toHaveLength(2)

    const sdkResultsByEnv = await sdkApi.searchEvents({
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      limit: 10,
      environment: environmentIds,
      linked_id: linkedId,
    })

    expect(sdkResultsByEnv.data?.events ?? []).toHaveLength(2)
  })

  test('with invalid limit', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 400,
      expectedResponse: {
        error: {
          code: 'request_cannot_be_parsed',
          message: 'invalid limit',
        },
      },
      callback: (api) =>
        api.searchEvents({
          api_key: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          limit: -1,
        }),
    })
  })

  test('with partial params', async ({ identify, assert }) => {
    const { visitor_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await assert.thatResponseMatch({
      expectedStatusCode: 200,
      callback: (api) =>
        api.searchEvents({
          api_key: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          limit: 10,
          bot: 'good',
          visitor_id,
        }),
    })
  })

  test('with environment as empty array param', async ({ identify, assert }) => {
    const { visitor_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await assert.thatResponseMatch({
      expectedStatusCode: 200,
      callback: (api) =>
        api.searchEvents({
          api_key: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          limit: 10,
          visitor_id,
          environment: [],
        }),
    })
  })

  test('with environment as incorrect array params', async ({ identify, assert }) => {
    const { visitor_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await assert.thatResponseMatch({
      expectedStatusCode: 200,
      callback: (api) =>
        api.searchEvents({
          api_key: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          limit: 10,
          visitor_id,
          environment: [null, undefined],
        }),
    })
  })

  test('with all params', async ({ identify, assert, fingerprintApi, sdkApi }) => {
    let linkedId = `test_all_params_${Date.now()}`
    const { visitor_id, event_id } = await identify({
      auth: testData.credentials.maxFeaturesUS,
      linkedId,
    })

    // Wait for event to propagate
    await delay(5000)

    const { data: event } = await fingerprintApi.getEvent({
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      event_id,
    })

    // Use timestamp from the event to create start and end times
    const timestamp = event.timestamp || Date.now()
    const start = timestamp - 60 * 60 * 1000 // 1 hour before
    const end = timestamp + 60 * 60 * 1000 // 1 hour after

    let botValue: SearchEventsFilter['bot']
    switch (event.bot) {
      case 'good':
        botValue = 'good'
        break

      case 'bad':
        botValue = 'bad'
        break

      case 'not_detected':
        botValue = 'none'
        break

      default:
        botValue = 'all'
    }

    const ipValue = `${event.ip_address || '127.0.0.1'}/24`
    const vpnValue = event.vpn || undefined
    const tampering = event.tampering || undefined
    const antiDetectBrowser = event.tampering_details?.anti_detect_browser || undefined
    const incognito = event.incognito || undefined
    const privacySettings = event.privacy_settings || undefined
    const jailbroken = event.jailbroken || undefined
    const virtualMachine = event.virtual_machine || undefined
    const vpnConfidence = event.vpn_confidence || undefined
    const suspectScore = event.suspect_score || undefined
    const developerTools = event.developer_tools || undefined
    const locationSpoofing = event.location_spoofing || undefined
    const mitmAttack = event.mitm_attack || undefined
    const proxy = event.proxy || undefined
    const sdkVersion = event.sdk?.version || undefined
    const sdkPlatform = event.sdk?.platform as 'android' | 'js' | 'ios' | undefined
    const environmentId = event.environment_id || undefined
    const environment = environmentId ? [environmentId] : undefined
    const proximityId = event.proximity?.id || undefined
    const asn = event.ip_info.v4.asn || event.ip_info.v6.asn || undefined
    const url = event.url || undefined
    const origin = event.vpn_origin_country || undefined
    const bundleId = event.bundle_id || undefined
    const torNode = event.ip_blocklist.tor_node || undefined
    const packageName = event.package_name || undefined

    const result = await sdkApi.searchEvents({
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      limit: 10,
      bot: botValue,
      visitor_id,
      linked_id: linkedId,
      start,
      end,
      //ip_address: ipValue,
      reverse: false,
      suspect: event.suspect || undefined,
      vpn: vpnValue,
      virtual_machine: virtualMachine,
      tampering,
      anti_detect_browser: antiDetectBrowser,
      incognito,
      privacy_settings: privacySettings,
      jailbroken,
      frida: event.frida || undefined,
      factory_reset: Boolean(event.factory_reset_timestamp),
      cloned_app: event.cloned_app || undefined,
      emulator: event.emulator || undefined,
      root_apps: event.root_apps || undefined,
      vpn_confidence: vpnConfidence,
      min_suspect_score: suspectScore,
      developer_tools: developerTools,
      location_spoofing: locationSpoofing,
      mitm_attack: mitmAttack,
      proxy,
      sdk_version: sdkVersion,
      sdk_platform: sdkPlatform,
      environment,
      proximity_id: proximityId,
      asn,
      url,
      origin,
      bundle_id: bundleId,
      tor_node: torNode,
      package_name: packageName,
    })

    await assert.thatResponseMatch({
      expectedStatusCode: 200,
      expectedResponse: {
        events: expect.any(Array),
      },
      callback: async () => result,
    })

    expect(result.data.events).toHaveLength(1)
  })

  test('with reverse params', async ({ sdkApi }) => {
    const { data: normalData } = await sdkApi.searchEvents({
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      limit: 10,
      reverse: false,
    })
    const { data: reversedData } = await sdkApi.searchEvents({
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      limit: 10,
      reverse: true,
    })

    expect(normalData.events).toHaveLength(10)
    expect(reversedData.events).toHaveLength(10)

    expect(normalData.events[0].timestamp).toBeGreaterThanOrEqual(reversedData.events[0].timestamp)
  })

  test('with paginationKey', async ({ fingerprintApi, assert }) => {
    const { data: originalResult } = await fingerprintApi.searchEvents({
      limit: 1,
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    expect(originalResult.events.length).toBe(1)

    const paginatedResult = await assert.thatResponsesMatch('searchEvents', {
      pagination_key: originalResult.pagination_key,
      limit: 1,
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    expect(originalResult.events.length).toBe(1)
    expect(paginatedResult.events[0].event_id).not.toEqual(originalResult.events[0].event_id)
  })

  test('with paginationKey reversed', async ({ fingerprintApi, assert }) => {
    const { data: originalResult } = await fingerprintApi.searchEvents({
      limit: 1,
      reverse: true,
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    expect(originalResult.events.length).toBe(1)

    const paginatedResult = await assert.thatResponsesMatch('searchEvents', {
      pagination_key: originalResult.pagination_key,
      limit: 1,
      reverse: true,
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })

    expect(originalResult.events.length).toBe(1)
    expect(paginatedResult.events[0].event_id).not.toEqual(originalResult.events[0].event_id)
  })

  test('with invalid bot', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 400,
      expectedResponse: {
        error: {
          code: 'request_cannot_be_parsed',
          message: 'invalid bot type',
        },
      },
      callback: (api) =>
        api.searchEvents({
          api_key: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          limit: 10,
          bot: 'bot' as any,
        }),
    })
  })

  test('with invalid ip address', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 400,
      expectedResponse: {
        error: {
          code: 'request_cannot_be_parsed',
          message: 'invalid ip address',
        },
      },
      callback: (api) =>
        api.searchEvents({
          api_key: testData.credentials.maxFeaturesUS.privateKey,
          region: testData.credentials.maxFeaturesUS.region,
          limit: 10,
          ip_address: '127.0.0.',
        }),
    })
  })

  test('with start and end date', async ({ sdkApi, identifyBulk }) => {
    test.slow()

    const linkedId = `test_start_end_date_${Date.now()}`

    await identifyBulk(
      {
        auth: testData.credentials.maxFeaturesUS,
        linkedId,
      },
      10
    )

    // Wait for events to propagate
    await delay(30_000)

    const { data: dataWithoutDateFilter } = await sdkApi.searchEvents({
      limit: 10,
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      linked_id: linkedId,
    })

    expect(dataWithoutDateFilter.events).toHaveLength(10)

    const [event] = dataWithoutDateFilter.events

    const { data: dataWithFilter } = await sdkApi.searchEvents({
      limit: 10,
      visitor_id: event.identification.visitor_id,
      api_key: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
      start: event.timestamp - 10,
      end: event.timestamp + 10,
      linked_id: linkedId,
    })

    expect(dataWithFilter.events).toHaveLength(1)
  })

  test('with invalid token', async ({ assert }) => {
    await assert.thatResponseMatch({
      expectedStatusCode: 403,
      expectedResponse: {
        error: {
          code: 'secret_api_key_not_found',
          message: 'no fingerprint workspace found for specified secret API key',
        },
      },
      callback: (api) =>
        api.searchEvents({
          api_key: testData.credentials.invalid.privateKey,
          region: testData.credentials.invalid.region,
          limit: 10,
        }),
    })
  })
})
